export default interface ProdutoDTO {
  idProduto?: number;
  idCategoria: number;
  codigo: string;
  nome: string;
  descricao?: string;
  precoUnitario: number;
  quantidadeDisponivel: number;
  quantidadeMinima: number;
  ativo?: boolean;
  dataCadastro?: Date;
}

export interface ProdutoReposicao {
  idProduto: number;
  codigo: string;
  nome: string;
  quantidadeDisponivel: number;
  quantidadeMinima: number;
}

export interface ValorProdutoEstoque {
  idProduto: number;
  codigo: string;
  nome: string;
  quantidadeDisponivel: number;
  precoUnitario: string; // O pg retorna NUMERIC/DECIMAL como string no JS para evitar perda de precisão
  valorEmEstoque: string;
}

export interface ValorTotalEstoque {
  valorTotalEstoque: string;
}