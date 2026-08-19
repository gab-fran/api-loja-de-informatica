import type { ProdutoReposicao, ValorProdutoEstoque, ValorTotalEstoque } from "../dto/ProdutoDTO.js";
import type ProdutoDTO from "../dto/ProdutoDTO.js";

import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Produto {
    private id_produto: number = 0;
    private id_categoria: number;
    private codigo: string;
    private nome: string;
    private descricao: string;
    private preco_unitario: number;
    private quantidade_disponivel: number;
    private quantidade_minima: number
    private ativo: boolean;
    private data_cadastro: Date;

    constructor(
        _id_categoria: number,
        _codigo: string, _nome: string,
        _descricao: string,
        _preco_unitario: number,
        _quantidade_disponivel: number,
        _quantidade_minima: number,
        _ativo: boolean,
        _data_cadastro: Date
    ) {
        this.id_categoria = _id_categoria;
        this.codigo = _codigo;
        this.nome = _nome;
        this.descricao = _descricao;
        this.preco_unitario = _preco_unitario;
        this.quantidade_disponivel = _quantidade_disponivel;
        this.quantidade_minima = _quantidade_minima;
        this.ativo = _ativo;
        this.data_cadastro = _data_cadastro;
    }

    // ==================== GETTERS E SETTERS ====================

    public getIdProduto(): number {
        return this.id_produto;
    }

    public setIdProduto(_id_produto: number): void {
        this.id_produto = _id_produto;
    }

    public getIdCategoria(): number {
        return this.id_categoria;
    }

    public setIdCategoria(_id_categoria: number): void {
        this.id_categoria = _id_categoria;
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
        return this.preco_unitario;
    }

    public setPrecoUnitario(_preco_unitario: number): void {
        this.preco_unitario = _preco_unitario;
    }

    public getQuantidadeDisponivel(): number {
        return this.quantidade_disponivel;
    }

    public setQuantidadeDisponivel(_quantidade_disponivel: number): void {
        this.quantidade_disponivel = _quantidade_disponivel;
    }

    public getQuantidadeMinima(): number {
        return this.quantidade_minima;
    }

    public setQuantidadeMinima(_quantidade_minima: number): void {
        this.quantidade_minima = _quantidade_minima;
    }

    public isAtivo(): boolean {
        return this.ativo;
    }

    public setAtivo(_ativo: boolean): void {
        this.ativo = _ativo;
    }

    public getDataCadastro(): Date {
        return this.data_cadastro;
    }

    public setDataCadastro(_data_cadastro: Date): void {
        this.data_cadastro = _data_cadastro;
    }

    // ==================== MÉTODOS ESTÁTICOS (operações no banco de dados) ====================

    static async listarProdutos(): Promise<Array<ProdutoDTO> | null> {

        let listaDeProdutos: Array<ProdutoDTO> = [];

        try {
            const querySelectProduto = `SELECT * FROM produto WHERE ativo = true;`;
            const respostaBD = await database.query(querySelectProduto);
            respostaBD.rows.forEach((produto: any) => {

                const produtoDTO: ProdutoDTO = {
                    id_produto: produto.id_produto,
                    id_categoria: produto.id_categoria,
                    codigo: produto.codigo,
                    nome: produto.nome,
                    descricao: produto.descricao,
                    preco_unitario: produto.preco_unitario,
                    quantidade_disponivel: produto.quantidade_disponivel,
                    quantidade_minima: produto.quantidade_minima,
                    ativo: produto.ativo,
                    data_cadastro: produto.data_cadastro
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
            const querySelectProduto = `SELECT * FROM produto WHERE id_produto = $1`;
            const respostaBD = await database.query(querySelectProduto, [id_produto]);

            const produtoDTO: ProdutoDTO = {
                id_produto: respostaBD.rows[0].id_produto,
                id_categoria: respostaBD.rows[0].id_categoria,
                codigo: respostaBD.rows[0].codigo,
                nome: respostaBD.rows[0].nome,
                descricao: respostaBD.rows[0].descricao,
                preco_unitario: respostaBD.rows[0].preco_unitario,
                quantidade_disponivel: respostaBD.rows[0].quantidade_disponivel,
                quantidade_minima: respostaBD.rows[0].quantidade_minima,
                ativo: respostaBD.rows[0].ativo,
                data_cadastro: respostaBD.rows[0].data_cadastro
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

            return Number(rows[0]?.valor_total_estoque ?? 0);
        } catch (error) {
            console.error(`Erro ao buscar valor total do estoque: ${error}`);
            return 0;
        }
    }

}

export default Produto;