
import { type Request, type Response } from "express";
import Movimentacao from "../model/Movimentacao.js";
import type MovimentacaoDTO from "../dto/MovimentacaoDTO.js";

const TIPOS = ["ENTRADA", "SAIDA"] as const;
const MOTIVOS = ["RECEBIMENTO", "VENDA", "USO_INTERNO", "PERDA", "DANIFICADO", "CORRECAO"] as const;

function validarMovimentacao(dados: Partial<MovimentacaoDTO>): Movimentacao | string {
    const idProduto = dados.produto?.idProduto;
    const tipo = typeof dados.tipo === "string" ? dados.tipo.trim().toUpperCase() : "";
    const motivo = typeof dados.motivo === "string" ? dados.motivo.trim().toUpperCase() : "";
    const observacao = typeof dados.observacao === "string" ? dados.observacao.trim() : "";
    const origem = dados.idMovimentacaoOrigem ?? null;

    if (typeof idProduto !== "number" || !Number.isInteger(idProduto) || idProduto <= 0) return "Informe um id de produto válido.";
    if (!TIPOS.includes(tipo as typeof TIPOS[number])) return "O tipo deve ser ENTRADA ou SAIDA.";
    if (!MOTIVOS.includes(motivo as typeof MOTIVOS[number])) return "Motivo de movimentação inválido.";
    if (typeof dados.quantidade !== "number" || !Number.isInteger(dados.quantidade) || dados.quantidade <= 0) return "A quantidade deve ser um inteiro maior que zero.";
    if (!observacao || observacao.length > 255) return "A observação é obrigatória e deve ter no máximo 255 caracteres.";
    const produto = idProduto as number;
    const quantidade = dados.quantidade as number;
    if (motivo === "RECEBIMENTO" && tipo !== "ENTRADA") return "RECEBIMENTO deve ser do tipo ENTRADA.";
    if (motivo === "CORRECAO") {
        if (!Number.isInteger(origem) || (origem as number) <= 0) return "CORRECAO exige o idMovimentacaoOrigem válido.";
    } else if (origem !== null) return "idMovimentacaoOrigem só pode ser informado para CORRECAO.";

    if (motivo !== "VENDA") {
        if (dados.precoUnitarioPraticado != null || dados.valorTotal != null) return "Preço praticado e valor total só podem ser informados em uma VENDA.";
        return new Movimentacao(produto, origem, tipo, motivo, quantidade, null, null, observacao, new Date());
    }

    const preco = dados.precoUnitarioPraticado;
    const valor = dados.valorTotal;
    if (tipo !== "SAIDA") return "VENDA deve ser do tipo SAIDA.";
    if (typeof preco !== "number" || !Number.isFinite(preco) || preco < 0 || Math.abs(preco * 100 - Math.round(preco * 100)) > 0.000001) return "Informe um preço praticado não negativo com até duas casas decimais.";
    if (typeof valor !== "number" || !Number.isFinite(valor) || valor < 0 || Math.abs(valor * 100 - Math.round(valor * 100)) > 0.000001) return "Informe um valor total não negativo com até duas casas decimais.";
    if (Math.round(valor * 100) !== quantidade * Math.round(preco * 100)) return "O valorTotal deve ser igual a quantidade × precoUnitarioPraticado.";

    return new Movimentacao(produto, origem, tipo, motivo, quantidade, preco, valor, observacao, new Date());
}

class MovimentacaoController extends Movimentacao {

    static async todos(req: Request, res: Response) {
        try {
            const listaDeMovimentacoes = await Movimentacao.listarMovimentacoes();
            res.status(200).json(listaDeMovimentacoes);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);
            res.status(500).json("Erro ao recuperar as informações da movimentação.");
        }
    }

    static async movimentacao(req: Request, res: Response) {
        try {

            const idMovimentacao = parseInt(req.params.id as string);

            if (isNaN(idMovimentacao)) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }

            const movimentacao = await Movimentacao.listarMovimentacao(idMovimentacao);

            if (!movimentacao || (Array.isArray(movimentacao) && movimentacao.length === 0)) {
                return res.status(404).json({ mensagem: "Movimentação não encontrada." });
            }

            res.status(200).json(movimentacao);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);
            res.status(500).json("Erro ao recuperar as informações da movimentação.");
        }
    }

    static async cadastrar(req: Request, res: Response) {
        try {
            const validacao = validarMovimentacao(req.body as Partial<MovimentacaoDTO>);
            if (typeof validacao === "string") {
                return res.status(400).json({ mensagem: validacao });
            }

            const result = await Movimentacao.cadastrarMovimentacao(validacao);

            if (result) {
                return res.status(201).json({ mensagem: `Movimentação cadastrada com sucesso.` });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível cadastrar a movimentação no banco de dados.' });
            }
        } catch (error) {
            console.log(`Erro ao cadastrar a movimentação: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar a movimentação.' });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        return res.status(405).json({ mensagem: "Movimentações confirmadas não podem ser alteradas. Registre uma correção." });

        try {
            const dadosRecebidos: MovimentacaoDTO = req.body;

            const movimentacao = new Movimentacao(
                dadosRecebidos.produto.idProduto!,
                dadosRecebidos.idMovimentacaoOrigem ?? 0,
                dadosRecebidos.tipo,
                dadosRecebidos.motivo,
                dadosRecebidos.quantidade,
                dadosRecebidos.precoUnitarioPraticado ?? 0,
                dadosRecebidos.valorTotal ?? 0,
                dadosRecebidos.observacao ?? "",
                new Date()
            );


            const idMovimentacao = parseInt(req.params.id as string);
            if (isNaN(idMovimentacao)) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }
            movimentacao.setIdMovimentacao(idMovimentacao);

            const result = await Movimentacao.atualizarMovimentacao(movimentacao);

            if (result) {
                return res.status(200).json({ mensagem: "Movimentação atualizada com sucesso." });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível atualizar a movimentação no banco de dados.' });
            }
        } catch (error) {
            console.error(`Erro ao atualizar movimentação: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao atualizar movimentação." });
        }
    }

}

export default MovimentacaoController;
