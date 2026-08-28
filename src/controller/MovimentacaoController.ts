import { type Request, type Response } from "express";
import Movimentacao from "../model/Movimentacao.js";
import { validarId, validarMovimentacao } from "../validation/dados.js";

class MovimentacaoController extends Movimentacao {
    static async todos(_req: Request, res: Response) {
        try {
            return res.status(200).json(await Movimentacao.listarMovimentacoes());
        } catch (error) {
            console.error("Erro ao recuperar movimentações:", error);
            return res.status(500).json({ mensagem: "Erro ao recuperar as informações da movimentação." });
        }
    }

    static async movimentacao(req: Request, res: Response) {
        const idMovimentacao = validarId(req.params.id);
        if (idMovimentacao === null) return res.status(400).json({ mensagem: "ID inválido." });
        try {
            const movimentacao = await Movimentacao.listarMovimentacao(idMovimentacao);
            return movimentacao
                ? res.status(200).json(movimentacao)
                : res.status(404).json({ mensagem: "Movimentação não encontrada." });
        } catch (error) {
            console.error("Erro ao recuperar movimentação:", error);
            return res.status(500).json({ mensagem: "Erro ao recuperar as informações da movimentação." });
        }
    }

    static async cadastrar(req: Request, res: Response) {
        const validacao = validarMovimentacao(req.body);
        if (!validacao.valido) return res.status(400).json({ mensagem: "Dados inválidos.", erros: validacao.erros });

        const dados = validacao.dados;
        const movimentacao = new Movimentacao(
            dados.idProduto, dados.idMovimentacaoOrigem, dados.tipo, dados.motivo,
            dados.quantidade, dados.precoUnitarioPraticado, dados.valorTotal,
            dados.observacao, dados.dataMovimentacao
        );
        try {
            const result = await Movimentacao.cadastrarMovimentacao(movimentacao);
            return result
                ? res.status(201).json({ mensagem: "Movimentação cadastrada com sucesso." })
                : res.status(500).json({ mensagem: "Não foi possível cadastrar a movimentação no banco de dados." });
        } catch (error) {
            console.error("Erro ao cadastrar movimentação:", error);
            return res.status(500).json({ mensagem: "Erro ao cadastrar a movimentação." });
        }
    }
}

export default MovimentacaoController;
