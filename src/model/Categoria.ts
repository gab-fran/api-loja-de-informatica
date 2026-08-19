import type CategoriaDTO from "../dto/CategoriaDTO.js";

import { DatabaseModel } from "./DatabaseModel.js";

const database = new DatabaseModel().pool;

class Categoria {
    private id_categoria: number = 0;
    private nome: string;

    constructor(_nome: string) {
        this.nome = _nome;
    }

    // ==================== GETTERS E SETTERS ====================

    public setIdCategoria(_id_categoria: number): void {
        this.id_categoria = _id_categoria;
    }

    public getIdCategoria(): number {
        return this.id_categoria;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(_nome: string): void {
        this.nome = _nome;
    }

    // ==================== MÉTODOS ESTÁTICOS (operações no banco de dados) ====================

    static async listarCategorias(): Promise<Array<CategoriaDTO> | null> {

        let listaDeCategorias: Array<CategoriaDTO> = [];

        try {
            const querySelectCategoria = `SELECT * FROM categoria;`;
            const respostaBD = await database.query(querySelectCategoria);
            respostaBD.rows.forEach((categoria: any) => {

                const categoriaDTO: CategoriaDTO = {
                    id_categoria: categoria.id_categoria,
                    nome: categoria.nome
                };

                listaDeCategorias.push(categoriaDTO);
            });

            return listaDeCategorias;
        } catch (error) {
            console.log(`Erro ao realizar consulta: ${error}`);
            return null;
        }
    }

    static async listarCategoria(id_categoria: number): Promise<CategoriaDTO | null> {
        try {
            const querySelectCategoria = `SELECT * FROM categoria WHERE id_categoria = $1`;
            const respostaBD = await database.query(querySelectCategoria, [id_categoria]);

            const categoriaDTO: CategoriaDTO = {
                id_categoria: respostaBD.rows[0].id_categoria,
                nome: respostaBD.rows[0].nome
            };

            return categoriaDTO;
        } catch (error) {
            console.log(`Erro ao realizar a consulta: ${error}`);
            return null;
        }
    }

     static async cadastrarCategoria(categoria: Categoria): Promise<boolean> {
        try {
           
            const queryInsertCategoria = `INSERT INTO categoria (nome)
                                VALUES ($1) RETURNING id_categoria;`;

            const result = await database.query(queryInsertCategoria, [categoria.getNome()]);

            if (result.rows.length > 0) {
                console.log(`Categoria cadastrada com sucesso. ID: ${result.rows[0].id_categoria}`);
                return true;
            }

            return false;
        } catch (error) {
            console.error(`Erro ao cadastrar categoria: ${error}`);
            return false;
        }
    }

    static async atualizarCategoria(categoria: Categoria): Promise<boolean> {
        try {
            const categoriaConsulta: CategoriaDTO | null = await this.listarCategoria(categoria.id_categoria);

            if (categoriaConsulta) {
                
                const queryAtualizarCategoria = `UPDATE categoria SET 
                                                    nome = $1                                            
                                                WHERE id_categoria = $2`;

                
                const respostaBD = await database.query(queryAtualizarCategoria, [
                    categoria.getNome().toUpperCase(),       // Nome em maiúsculas
                    categoria.id_categoria                           // ID da categoria (para o WHERE)
                ]);

                
                
            }

            return true;
        } catch (error) {
            console.log(`Erro ao atualizar categoria: ${error}`);
            throw error;
        }
    }

}

export default Categoria;