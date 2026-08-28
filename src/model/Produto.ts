import type { ProdutoReposicao, ValorProdutoEstoque, ValorTotalEstoque } from "../dto/ProdutoDTO.js";
import type ProdutoDTO from "../dto/ProdutoDTO.js";

import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Produto {
    private idProduto: number = 0;
    private idCategoria: number;
    private codigo: string;
    private nome: string;
    private descricao: string;
    private precoUnitario: number;
    private quantidadeDisponivel: number;
    private quantidadeMinima: number
    private ativo: boolean;
    private dataCadastro: Date;

    constructor(
        _idCategoria: number,
        _codigo: string, _nome: string,
        _descricao: string,
        _precoUnitario: number,
        _quantidadeDisponivel: number,
        _quantidadeMinima: number,
        _ativo: boolean,
        _dataCadastro: Date
    ) {
        this.idCategoria = _idCategoria;
        this.codigo = _codigo;
        this.nome = _nome;
        this.descricao = _descricao;
        this.precoUnitario = _precoUnitario;
        this.quantidadeDisponivel = _quantidadeDisponivel;
        this.quantidadeMinima = _quantidadeMinima;
        this.ativo = _ativo;
        this.dataCadastro = _dataCadastro;
    }

    // ==================== GETTERS E SETTERS ====================

    public getIdProduto(): number {
        return this.idProduto;
    }

    public setIdProduto(_idProduto: number): void {
        this.idProduto = _idProduto;
    }

    public getIdCategoria(): number {
        return this.idCategoria;
    }

    public setIdCategoria(_idCategoria: number): void {
        this.idCategoria = _idCategoria;
    }

    public getCodigo(): string {
        return this.codigo;
    }

    public setCodigo(_codigo: string): void {
        this.codigo = _codigo;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(_nome: string): void {
        this.nome = _nome;
    }

    public getDescricao(): string {
        return this.descricao;
    }

    public setDescricao(_descricao: string): void {
        this.descricao = _descricao;
    }

    public getPrecoUnitario(): number {
        return this.precoUnitario;
    }

    public setPrecoUnitario(_precoUnitario: number): void {
        this.precoUnitario = _precoUnitario;
    }

    public getQuantidadeDisponivel(): number {
        return this.quantidadeDisponivel;
    }

    public setQuantidadeDisponivel(_quantidadeDisponivel: number): void {
        this.quantidadeDisponivel = _quantidadeDisponivel;
    }

    public getQuantidadeMinima(): number {
        return this.quantidadeMinima;
    }

    public setQuantidadeMinima(_quantidadeMinima: number): void {
        this.quantidadeMinima = _quantidadeMinima;
    }

    public isAtivo(): boolean {
        return this.ativo;
    }

    public setAtivo(_ativo: boolean): void {
        this.ativo = _ativo;
    }

    public getDataCadastro(): Date {
        return this.dataCadastro;
    }

    public setDataCadastro(_dataCadastro: Date): void {
        this.dataCadastro = _dataCadastro;
    }

    // ==================== MÉTODOS ESTÁTICOS (operações no banco de dados) ====================

    static async listarProdutos(): Promise<Array<ProdutoDTO> | null> {

        let listaDeProdutos: Array<ProdutoDTO> = [];

        try {
            const querySelectProduto = `SELECT * FROM vw_produtos_detalhes WHERE ativo = true;`;
            const respostaBD = await database.query(querySelectProduto);
            respostaBD.rows.forEach((produto: any) => {

                const produtoDTO: ProdutoDTO = {
                    idProduto: produto.id_produto,
                    categoria: {
                        idCategoria: produto.id_categoria,
                        nome: produto.nome_categoria
                    },
                    codigo: produto.codigo,
                    nome: produto.nome_produto,
                    descricao: produto.descricao,
                    precoUnitario: produto.preco_unitario,
                    quantidadeDisponivel: produto.quantidade_disponivel,
                    quantidadeMinima: produto.quantidade_minima,
                    ativo: produto.ativo,
                    dataCadastro: produto.data_cadastro
                };

                listaDeProdutos.push(produtoDTO);
            });

            return listaDeProdutos;
        } catch (error) {
            console.log(`Erro ao realizar consulta: ${error}`);
            return null;
        }
    }

    static async listarProduto(id_produto: number): Promise<ProdutoDTO | null> {
        try {
            const querySelectProduto = `SELECT * FROM vw_produtos_detalhes WHERE id_produto = $1`;
            const respostaBD = await database.query(querySelectProduto, [id_produto]);

            const produtoDTO: ProdutoDTO = {
                idProduto: respostaBD.rows[0].id_produto,
                categoria: {
                    idCategoria: respostaBD.rows[0].id_categoria,
                    nome: respostaBD.rows[0].nome_categoria
                },
                codigo: respostaBD.rows[0].codigo,
                nome: respostaBD.rows[0].nome_produto,
                descricao: respostaBD.rows[0].descricao,
                precoUnitario: respostaBD.rows[0].preco_unitario,
                quantidadeDisponivel: respostaBD.rows[0].quantidade_disponivel,
                quantidadeMinima: respostaBD.rows[0].quantidade_minima,
                ativo: respostaBD.rows[0].ativo,
                dataCadastro: respostaBD.rows[0].data_cadastro
            };

            return produtoDTO;
        } catch (error) {
            console.log(`Erro ao realizar a consulta: ${error}`);
            return null;
        }
    }

    static async cadastrarProduto(produto: Produto): Promise<boolean> {
        try {

            const queryInsertProduto = `INSERT INTO produto (id_categoria, codigo, nome, descricao, preco_unitario, quantidade_disponivel, quantidade_minima, data_cadastro)
                                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_produto;`;

            const result = await database.query(queryInsertProduto, [
                produto.getIdCategoria(),
                produto.getCodigo(),
                produto.getNome(),
                produto.getDescricao(),
                produto.getPrecoUnitario(),
                produto.getQuantidadeDisponivel(),
                produto.getQuantidadeMinima(),
                produto.getDataCadastro()
            ]);

            if (result.rows.length > 0) {
                console.log(`Produto cadastrado com sucesso. ID: ${result.rows[0].id_produto}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar produto: ${error}`);
            return false;
        }
    }

    static async atualizarProduto(produto: Produto): Promise<boolean> {
        try {
            const produtoConsulta: ProdutoDTO | null = await this.listarProduto(produto.getIdProduto());

            if (produtoConsulta) {

                const queryAtualizarProduto = `UPDATE produto SET 
                                                        id_categoria = $1,
                                                        codigo = $2,
                                                        nome = $3,
                                                        descricao = $4,
                                                        preco_unitario = $5,
                                                        quantidade_disponivel = $6,
                                                        quantidade_minima = $7
                                                    WHERE id_produto = $8`;


                const respostaBD = await database.query(queryAtualizarProduto, [
                    produto.getIdCategoria(),
                    produto.getCodigo(),
                    produto.getNome(),
                    produto.getDescricao(),
                    produto.getPrecoUnitario(),
                    produto.getQuantidadeDisponivel(),
                    produto.getQuantidadeMinima(),
                    produto.getIdProduto()
                ]);



            }

            return true;
        } catch (error) {
            console.log(`Erro ao atualizar produto: ${error}`);
            throw error;
        }
    }

    static async removerProduto(id_produto: number): Promise<boolean> {
        try {
            const produto: ProdutoDTO | null = await this.listarProduto(id_produto);

            if (produto) {
                const queryDeleteProduto = `UPDATE produto
                                          SET ativo = FALSE
                                          WHERE id_produto = $1`;

                const result = await database.query(queryDeleteProduto, [id_produto]);

                return result.rowCount != 0;
            }

            return false;
        } catch (error) {
            console.log(`Erro ao remover produto: ${error}`);
            throw error;
        }
    }

    static async buscarProdutosParaReposicao(): Promise<ProdutoReposicao[]> {
        try {
            const query = 'SELECT * FROM vw_produtos_reposicao ORDER BY nome;';
            const { rows } = await database.query<ProdutoReposicao>(query);
            return rows;
        } catch (error) {
            console.error(`Erro ao buscar produtos para reposicao: ${error}`);
            return [];
        }
    }

    static async buscarValorPorProduto(): Promise<ValorProdutoEstoque[]> {
        try {
            const query = 'SELECT * FROM vw_valor_produto_estoque ORDER BY nome;';
            const { rows } = await database.query<ValorProdutoEstoque>(query);
            return rows;
        } catch (error) {
            console.error(`Erro ao buscar valor por produto: ${error}`);
            return [];
        }
    }

    static async buscarValorTotalEstoque(): Promise<number> {
        try {
            const query = 'SELECT * FROM vw_valor_total_estoque;';
            const { rows } = await database.query<ValorTotalEstoque>(query);

            return Number(rows[0]?.valorTotalEstoque ?? 0);
        } catch (error) {
            console.error(`Erro ao buscar valor total do estoque: ${error}`);
            return 0;
        }
    }

}

export default Produto;