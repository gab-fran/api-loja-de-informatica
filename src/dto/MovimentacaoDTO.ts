import type ProdutoDTO from "./ProdutoDTO.js";

export default interface MovimentacaoDTO {
    idMovimentacao?: number;
    produto: ProdutoDTO;
    idMovimentacaoOrigem?: number | null;
    tipo: string;
    motivo: string;
    quantidade: number;
    precoUnitarioPraticado?: number | null;
    valorTotal?: number | null;
    observacao: string;
    dataMovimentacao?: Date | string;
}
