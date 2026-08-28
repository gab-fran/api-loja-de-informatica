import Categoria from "../model/Categoria.js";

import { type Request, type Response } from "express";

import type CategoriaDTO from "../dto/CategoriaDTO.js";
import { validarCategoria, validarId } from "../validation/dados.js";

class CategoriaController extends Categoria {

    static async todos(req: Request, res: Response) {
        try {
            const listaDeCategorias = await Categoria.listarCategorias();
            res.status(200).json(listaDeCategorias);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);
            res.status(500).json("Erro ao recuperar as informações da categoria.");
        }
    }

    static async categoria(req: Request, res: Response) {
        try {
        
            const idCategoria = validarId(req.params.id);

            if (idCategoria === null) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }

            const categoria = await Categoria.listarCategoria(idCategoria);

            if (!categoria || (Array.isArray(categoria) && categoria.length === 0)) {
                return res.status(404).json({ mensagem: "Categoria não encontrada." });
            }

            res.status(200).json(categoria);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);
            res.status(500).json("Erro ao recuperar as informações da categoria.");
        }
    }

    static async cadastrar(req: Request, res: Response) {
        try {
            const validacao = validarCategoria(req.body);
            if (!validacao.valido) {
                return res.status(400).json({ mensagem: "Dados inválidos.", erros: validacao.erros });
            }

            const novaCategoria = new Categoria(
                validacao.dados.nome
            );

            const result = await Categoria.cadastrarCategoria(novaCategoria);

            if (result) {
                return res.status(201).json({ mensagem: `Categoria cadastrada com sucesso.` });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível cadastrar a categoria no banco de dados.' });
            }
        } catch (error) {
            console.log(`Erro ao cadastrar a categoria: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar a categoria.' });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const validacao = validarCategoria(req.body);
            if (!validacao.valido) {
                return res.status(400).json({ mensagem: "Dados inválidos.", erros: validacao.erros });
            }

            const categoria = new Categoria(
                validacao.dados.nome
            );
              

            const idCategoria = validarId(req.params.id);
            if (idCategoria === null) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }
            categoria.setIdCategoria(idCategoria);

            const result = await Categoria.atualizarCategoria(categoria);

            if (result) {
                return res.status(200).json({ mensagem: "Cadastro atualizado com sucesso." });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível atualizar a categoria no banco de dados.' });
            }
        } catch (error) {
            console.error(`Erro ao atualizar categoria: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao atualizar categoria." });
        }
    }
}

export default CategoriaController;
