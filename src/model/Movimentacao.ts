import type MovimentacaoDTO from "../dto/MovimentacaoDTO.js";
import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Movimentacao {
    private id_movimentacao: number = 0;
    private idProduto: number;
    private idMovimentacaoOrigem: number | null;
    private tipo: string;
    private motivo: string;
    private quantidade: number;
    private precoUnitarioPraticado: number | null;
    private valorTotal: number | null;
    private observacao: string;
    private dataMovimentacao: Date;

    constructor(
        _idProduto: number,
        _idMovimentacaoOrigem: number | null,
        _tipo: string,
        _motivo: string,
        _quantidade: number,
        _precoUnitarioPraticado: number | null,
        _valorTotal: number | null,
        _observacao: string,
        _dataMovimentacao: Date
    ) {
        this.idProduto = _idProduto;
        this.idMovimentacaoOrigem = _idMovimentacaoOrigem;
        this.tipo = _tipo;
        this.motivo = _motivo;
        this.quantidade = _quantidade;
        this.precoUnitarioPraticado = _precoUnitarioPraticado;
        this.valorTotal = _valorTotal;
        this.observacao = _observacao;
        this.dataMovimentacao = _dataMovimentacao;
    }

    // ==================== GETTERS E SETTERS ====================
    getIdMovimentacao() {
        return this.id_movimentacao;
    }

    setIdMovimentacao(_idMovimentacao: number) {
        this.id_movimentacao = _idMovimentacao;
    }

    getIdProduto() {
        return this.idProduto;
    }

    setIdProduto(_idProduto: number) {
        this.idProduto = _idProduto;
    }

    getIdMovimentacaoOrigem() {
        return this.idMovimentacaoOrigem;
    }

    setIdMovimentacaoOrigem(_idMovimentacaoOrigem: number | null) {
        this.idMovimentacaoOrigem = _idMovimentacaoOrigem;
    }

    getTipo() {
        return this.tipo;
    }

    setTipo(_tipo: string) {
        this.tipo = _tipo;
    }

    getMotivo() {
        return this.motivo;
    }

    setMotivo(_motivo: string) {
        this.motivo = _motivo;
    }

    getQuantidade() {
        return this.quantidade;
    }

    setQuantidade(_quantidade: number) {
        this.quantidade = _quantidade;
    }

    getPrecoUnitarioPraticado() {
        return this.precoUnitarioPraticado;
    }

    setPrecoUnitarioPraticado(_preco: number | null) {
        this.precoUnitarioPraticado = _preco;
    }

    getValorTotal() {
        return this.valorTotal;
    }

    setValorTotal(_valor: number | null) {
        this.valorTotal = _valor;
    }

    getObservacao() {
        return this.observacao;
    }

    setObservacao(_observacao: string) {
        this.observacao = _observacao;
    }

    getDataMovimentacao() {
        return this.dataMovimentacao;
    }

    setDataMovimentacao(_dataMovimentacao: Date) {
        this.dataMovimentacao = _dataMovimentacao;
    }

    // ==================== MÉTODOS ESTÁTICOS (operações no banco de dados) ====================

    static async listarMovimentacoes(): Promise<Array<MovimentacaoDTO> | null> {

        let listaDeMovimentacoes: Array<MovimentacaoDTO> = [];

        try {
            const querySelectMovimentacao = `SELECT * FROM vw_movimentacoes_detalhes;`;
            const respostaBD = await database.query(querySelectMovimentacao);
            respostaBD.rows.forEach((movimentacao: any) => {

                const movimentacaoDTO: MovimentacaoDTO = {
                    idMovimentacao: movimentacao.id_movimentacao,
                    produto: {
                        idProduto: movimentacao.id_produto,
                        categoria: {
                            idCategoria: movimentacao.id_categoria,
                            nome: movimentacao.nome_categoria
                        },
                        codigo: movimentacao.codigo_produto,
                        nome: movimentacao.nome_produto,
                        descricao: movimentacao.descricao_produto,
                        precoUnitario: movimentacao.preco_cadastro_produto,
                        quantidadeDisponivel: movimentacao.estoque_atual,
                        quantidadeMinima: movimentacao.estoque_minimo
                    },
                    idMovimentacaoOrigem: movimentacao.id_movimentacao_origem,
                    tipo: movimentacao.tipo_movimentacao,
                    motivo: movimentacao.motivo,
                    quantidade: movimentacao.quantidade_movimentada,
                    precoUnitarioPraticado: movimentacao.preco_unitario_praticado,
                    valorTotal: movimentacao.valor_total,
                    observacao: movimentacao.observacao,
                    dataMovimentacao: movimentacao.data_movimentacao
                };

                listaDeMovimentacoes.push(movimentacaoDTO);
            });

            return listaDeMovimentacoes;
        } catch (error) {
            console.log(`Erro ao realizar consulta: ${error}`);
            return null;
        }
    }

    static async listarMovimentacao(id_movimentacao: number): Promise<MovimentacaoDTO | null> {
        try {
            const querySelectMovimentacao = `SELECT * FROM vw_movimentacoes_detalhes WHERE id_movimentacao = $1`;
            const respostaBD = await database.query(querySelectMovimentacao, [id_movimentacao]);

            if (respostaBD.rows.length === 0) {
                return null;
            }

            const movimentacaoDTO: MovimentacaoDTO = {
                idMovimentacao: respostaBD.rows[0].id_movimentacao,
                produto: {
                    idProduto: respostaBD.rows[0].id_produto,
                    categoria: {
                        idCategoria: respostaBD.rows[0].id_categoria,
                        nome: respostaBD.rows[0].nome_categoria
                    },
                    codigo: respostaBD.rows[0].codigo_produto,
                    nome: respostaBD.rows[0].nome_produto,
                    descricao: respostaBD.rows[0].descricao_produto,
                    precoUnitario: respostaBD.rows[0].preco_cadastro_produto,
                    quantidadeDisponivel: respostaBD.rows[0].estoque_atual,
                    quantidadeMinima: respostaBD.rows[0].estoque_minimo
                },
                idMovimentacaoOrigem: respostaBD.rows[0].id_movimentacao_origem,
                tipo: respostaBD.rows[0].tipo_movimentacao,
                motivo: respostaBD.rows[0].motivo,
                quantidade: respostaBD.rows[0].quantidade_movimentada,
                precoUnitarioPraticado: respostaBD.rows[0].preco_unitario_praticado,
                valorTotal: respostaBD.rows[0].valor_total,
                observacao: respostaBD.rows[0].observacao,
                dataMovimentacao: respostaBD.rows[0].data_movimentacao
            };

            return movimentacaoDTO;
        } catch (error) {
            console.log(`Erro ao realizar consulta: ${error}`);
            return null;
        }
    }

    static async cadastrarMovimentacao(movimentacao: Movimentacao): Promise<boolean> {
        try {

            const queryInsertMovimentacao = `INSERT INTO movimentacao (id_produto, id_movimentacao_origem, tipo, motivo, quantidade, preco_unitario_praticado, valor_total, observacao, data_movimentacao)
                                             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_movimentacao;`;

            const result = await database.query(queryInsertMovimentacao, [
                movimentacao.getIdProduto(),
                movimentacao.getIdMovimentacaoOrigem(),
                movimentacao.getTipo(),
                movimentacao.getMotivo(),
                movimentacao.getQuantidade(),
                movimentacao.getPrecoUnitarioPraticado(),
                movimentacao.getValorTotal(),
                movimentacao.getObservacao(),
                movimentacao.getDataMovimentacao()
            ]);

            if (result.rows.length > 0) {
                console.log(`Movimentação cadastrada com sucesso. ID: ${result.rows[0].id_movimentacao}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar movimentação: ${error}`);
            return false;
        }
    }

    // O banco impede UPDATEs em movimentações confirmadas; correções são novos registros.
    static async atualizarMovimentacao(_movimentacao: Movimentacao): Promise<boolean> {
        return false;
    }

}

export default Movimentacao;
