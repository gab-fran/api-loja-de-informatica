import type MovimentacaoDTO from "../dto/MovimentacaoDTO.js";

type ResultadoValidacao<T> =
    | { valido: true; dados: T }
    | { valido: false; erros: string[] };

export interface CategoriaValidada {
    nome: string;
}

export interface ProdutoValidado {
    idCategoria: number;
    codigo: string;
    nome: string;
    descricao: string;
    precoUnitario: number;
    quantidadeDisponivel: number;
    quantidadeMinima: number;
    ativo: boolean;
    dataCadastro: Date;
}

export interface MovimentacaoValidada {
    idProduto: number;
    idMovimentacaoOrigem: number | null;
    tipo: "ENTRADA" | "SAIDA";
    motivo: "RECEBIMENTO" | "VENDA" | "USO_INTERNO" | "PERDA" | "DANIFICADO" | "CORRECAO";
    quantidade: number;
    precoUnitarioPraticado: number | null;
    valorTotal: number | null;
    observacao: string;
    dataMovimentacao: Date;
}

const tipos = ["ENTRADA", "SAIDA"] as const;
const motivos = ["RECEBIMENTO", "VENDA", "USO_INTERNO", "PERDA", "DANIFICADO", "CORRECAO"] as const;

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
    return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function texto(valor: unknown, campo: string, limite: number, erros: string[], obrigatorio = true): string {
    if (typeof valor !== "string") {
        if (obrigatorio) erros.push(`${campo} deve ser um texto.`);
        return "";
    }

    const resultado = valor.trim();
    if (obrigatorio && !resultado) erros.push(`${campo} é obrigatório.`);
    if (resultado.length > limite) erros.push(`${campo} deve ter no máximo ${limite} caracteres.`);
    return resultado;
}

function inteiroPositivo(valor: unknown, campo: string, erros: string[]): number {
    if (typeof valor !== "number" || !Number.isInteger(valor) || valor <= 0) {
        erros.push(`${campo} deve ser um número inteiro maior que zero.`);
        return 0;
    }
    return valor;
}

function inteiroNaoNegativo(valor: unknown, campo: string, erros: string[]): number {
    if (typeof valor !== "number" || !Number.isInteger(valor) || valor < 0) {
        erros.push(`${campo} deve ser um número inteiro maior ou igual a zero.`);
        return 0;
    }
    return valor;
}

function moeda(valor: unknown, campo: string, limite: number, erros: string[]): number {
    if (typeof valor !== "number" || !Number.isFinite(valor) || valor < 0 || valor > limite || Math.abs(valor * 100 - Math.round(valor * 100)) > 0.000001) {
        erros.push(`${campo} deve ser um valor não negativo, com no máximo duas casas decimais.`);
        return 0;
    }
    return valor;
}

function data(valor: unknown, campo: string, erros: string[]): Date {
    if (valor === undefined) return new Date();
    const resultado = valor instanceof Date ? valor : new Date(String(valor));
    if (Number.isNaN(resultado.getTime())) {
        erros.push(`${campo} deve ser uma data válida.`);
        return new Date();
    }
    return resultado;
}

export function validarId(valor: unknown): number | null {
    if (typeof valor !== "string" || !/^\d+$/.test(valor)) return null;
    const id = Number(valor);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export function validarCategoria(corpo: unknown): ResultadoValidacao<CategoriaValidada> {
    const erros: string[] = [];
    const dados = ehObjeto(corpo) ? corpo : {};
    if (!ehObjeto(corpo)) erros.push("O corpo da requisição deve ser um objeto JSON.");
    const nome = texto(dados.nome, "nome", 80, erros);
    return erros.length ? { valido: false, erros } : { valido: true, dados: { nome } };
}

export function validarProduto(corpo: unknown): ResultadoValidacao<ProdutoValidado> {
    const erros: string[] = [];
    const dados = ehObjeto(corpo) ? corpo : {};
    if (!ehObjeto(corpo)) erros.push("O corpo da requisição deve ser um objeto JSON.");
    const categoria = ehObjeto(dados.categoria) ? dados.categoria : {};
    if (!ehObjeto(dados.categoria)) erros.push("categoria deve ser um objeto com idCategoria.");

    const idCategoria = inteiroPositivo(categoria.idCategoria, "categoria.idCategoria", erros);
    const codigo = texto(dados.codigo, "codigo", 20, erros);
    const nome = texto(dados.nome, "nome", 100, erros);
    const descricao = dados.descricao == null ? "" : texto(dados.descricao, "descricao", 255, erros, false);
    const precoUnitario = moeda(dados.precoUnitario, "precoUnitario", 99_999_999.99, erros);
    const quantidadeDisponivel = inteiroNaoNegativo(dados.quantidadeDisponivel, "quantidadeDisponivel", erros);
    const quantidadeMinima = inteiroNaoNegativo(dados.quantidadeMinima, "quantidadeMinima", erros);
    const ativo = dados.ativo ?? true;
    if (typeof ativo !== "boolean") erros.push("ativo deve ser verdadeiro ou falso.");
    const dataCadastro = data(dados.dataCadastro, "dataCadastro", erros);

    if (erros.length) return { valido: false, erros };
    return { valido: true, dados: { idCategoria, codigo, nome, descricao, precoUnitario, quantidadeDisponivel, quantidadeMinima, ativo: ativo as boolean, dataCadastro } };
}

export function validarMovimentacao(corpo: unknown): ResultadoValidacao<MovimentacaoValidada> {
    const erros: string[] = [];
    const dados = ehObjeto(corpo) ? corpo : {};
    if (!ehObjeto(corpo)) erros.push("O corpo da requisição deve ser um objeto JSON.");
    const produto = ehObjeto(dados.produto) ? dados.produto : {};
    if (!ehObjeto(dados.produto)) erros.push("produto deve ser um objeto com idProduto.");

    const idProduto = inteiroPositivo(produto.idProduto, "produto.idProduto", erros);
    const tipo = typeof dados.tipo === "string" ? dados.tipo.trim().toUpperCase() : "";
    const motivo = typeof dados.motivo === "string" ? dados.motivo.trim().toUpperCase() : "";
    if (!tipos.includes(tipo as typeof tipos[number])) erros.push("tipo deve ser ENTRADA ou SAIDA.");
    if (!motivos.includes(motivo as typeof motivos[number])) erros.push("motivo de movimentação inválido.");
    const quantidade = inteiroPositivo(dados.quantidade, "quantidade", erros);
    const observacao = texto(dados.observacao, "observacao", 255, erros);
    const dataMovimentacao = data(dados.dataMovimentacao, "dataMovimentacao", erros);

    const origem = dados.idMovimentacaoOrigem ?? null;
    if (motivo === "CORRECAO") {
        inteiroPositivo(origem, "idMovimentacaoOrigem", erros);
    } else if (origem !== null) {
        erros.push("idMovimentacaoOrigem só pode ser informado para CORRECAO.");
    }
    if (motivo === "RECEBIMENTO" && tipo !== "ENTRADA") erros.push("RECEBIMENTO deve ser do tipo ENTRADA.");
    if (motivo === "VENDA" && tipo !== "SAIDA") erros.push("VENDA deve ser do tipo SAIDA.");

    let precoUnitarioPraticado: number | null = null;
    let valorTotal: number | null = null;
    if (motivo === "VENDA") {
        precoUnitarioPraticado = moeda(dados.precoUnitarioPraticado, "precoUnitarioPraticado", 99_999_999.99, erros);
        valorTotal = moeda(dados.valorTotal, "valorTotal", 9_999_999_999.99, erros);
        if (Math.round(valorTotal * 100) !== quantidade * Math.round(precoUnitarioPraticado * 100)) {
            erros.push("valorTotal deve ser igual a quantidade × precoUnitarioPraticado.");
        }
    } else if (dados.precoUnitarioPraticado != null || dados.valorTotal != null) {
        erros.push("precoUnitarioPraticado e valorTotal só podem ser informados em uma VENDA.");
    }

    if (erros.length) return { valido: false, erros };
    return {
        valido: true,
        dados: {
            idProduto,
            idMovimentacaoOrigem: origem as number | null,
            tipo: tipo as MovimentacaoValidada["tipo"],
            motivo: motivo as MovimentacaoValidada["motivo"],
            quantidade,
            precoUnitarioPraticado,
            valorTotal,
            observacao,
            dataMovimentacao
        }
    };
}
