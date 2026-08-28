import Produto from "../model/Produto.js";

import { type Request, type Response } from "express";

import type ProdutoDTO from "../dto/ProdutoDTO.js";

class ProdutoController extends Produto {

    static async todos(req: Request, res: Response) {
        try {
            const listaDeProdutos = await Produto.listarProdutos();
            res.status(200).json(listaDeProdutos);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);
            res.status(500).json("Erro ao recuperar as informações do produto.");
        }
    }

    static async produto(req: Request, res: Response) {
        try {

            const idProduto = parseInt(req.params.id as string);

            if (isNaN(idProduto)) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }

            const produto = await Produto.listarProduto(idProduto);

            if (!produto || (Array.isArray(produto) && produto.length === 0)) {
                return res.status(404).json({ mensagem: "Produto não encontrado." });
            }

            res.status(200).json(produto);
        } catch (error) {
            console.log(`Erro ao acessar método herdado: ${error}`);
            res.status(500).json("Erro ao recuperar as informações do produto.");
        }
    }

    static async cadastrar(req: Request, res: Response) {
        try {
            const dadosRecebidos: ProdutoDTO = req.body;

            const novaProduto = new Produto(
                dadosRecebidos.categoria.idCategoria!,
                dadosRecebidos.codigo,
                dadosRecebidos.nome,
                dadosRecebidos.descricao ?? "",
                dadosRecebidos.precoUnitario,
                dadosRecebidos.quantidadeDisponivel,
                dadosRecebidos.quantidadeMinima,
                dadosRecebidos.ativo ?? true,
                dadosRecebidos.dataCadastro ?? new Date()
            );

            const result = await Produto.cadastrarProduto(novaProduto);

            if (result) {
                return res.status(201).json({ mensagem: `Produto cadastrado com sucesso.` });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível cadastrar o produto no banco de dados.' });
            }
        } catch (error) {
            console.log(`Erro ao cadastrar o produto: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao cadastrar o produto.' });
        }
    }

    static async atualizar(req: Request, res: Response): Promise<Response> {
        try {
            const dadosRecebidos: ProdutoDTO = req.body;

            const produto = new Produto(
                dadosRecebidos.categoria.idCategoria!,
                dadosRecebidos.codigo,
                dadosRecebidos.nome,
                dadosRecebidos.descricao ?? "",
                dadosRecebidos.precoUnitario,
                dadosRecebidos.quantidadeDisponivel,
                dadosRecebidos.quantidadeMinima,
                dadosRecebidos.ativo ?? true,
                dadosRecebidos.dataCadastro ?? new Date()
            );


            const idProduto = parseInt(req.params.id as string);
            if (isNaN(idProduto)) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }
            produto.setIdProduto(idProduto);

            const result = await Produto.atualizarProduto(produto);

            if (result) {
                return res.status(200).json({ mensagem: "Produto atualizado com sucesso." });
            } else {
                return res.status(500).json({ mensagem: 'Não foi possível atualizar o produto no banco de dados.' });
            }
        } catch (error) {
            console.error(`Erro ao atualizar produto: ${error}`);
            return res.status(500).json({ mensagem: "Erro ao atualizar produto." });
        }
    }

    static async remover(req: Request, res: Response): Promise<Response> {
        try {
            const idProduto = parseInt(req.params.id as string);

            if (isNaN(idProduto)) {
                return res.status(400).json({ mensagem: "ID inválido." });
            }

            const result = await Produto.removerProduto(idProduto);

            if (result) {
                return res.status(200).json({ mensagem: 'Produto removido com sucesso.' });
            } else {
                return res.status(404).json({ mensagem: 'Produto não encontrado para exclusão.' });
            }
        } catch (error) {
            console.error("Erro ao remover o produto: ", error);
            return res.status(500).json({ mensagem: 'Erro ao remover o produto.' });
        }
    }

    static async valorPorProduto(req: Request, res: Response): Promise<Response> {
        try {
            const valorProdutos = await Produto.buscarValorPorProduto();
            return res.status(200).json(valorProdutos);
        } catch (error) {
            console.error(`Erro ao buscar valor por produto: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao buscar valor por produto.' });
        }
    }

    static async valorTotalEstoque(req: Request, res: Response): Promise<Response> {
        try {
            const valorTotal = await Produto.buscarValorTotalEstoque();
            return res.status(200).json({ valor_total_estoque: valorTotal });
        } catch (error) {
            console.error(`Erro ao buscar valor total do estoque: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao buscar valor total do estoque.' });
        }
    }

    static async produtosParaReposicao(req: Request, res: Response): Promise<Response> {
        try {
            const produtosReposicao = await Produto.buscarProdutosParaReposicao();
            return res.status(200).json(produtosReposicao);
        } catch (error) {
            console.error(`Erro ao buscar produtos para reposição: ${error}`);
            return res.status(500).json({ mensagem: 'Erro ao buscar produtos para reposição.' });
        }
    }
}

export default ProdutoController;