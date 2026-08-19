export default interface ProdutoDTO {
    id_produto?: number;
    id_categoria: number;
    codigo: string;
    nome: string;
    descricao?: string;
    preco_unitario: number;
    quantidade_disponivel: number;
    quantidade_minima: number;
    ativo?: boolean;
    data_cadastro?: Date;
}

export interface ProdutoReposicao {
  id_produto: number;
  codigo: string;
  nome: string;
  quantidade_disponivel: number;
  quantidade_minima: number;
}

export interface ValorProdutoEstoque {
  id_produto: number;
  codigo: string;
  nome: string;
  quantidade_disponivel: number;
  preco_unitario: string; // O pg retorna NUMERIC/DECIMAL como string no JS para evitar perda de precisão
  valor_em_estoque: string; 
}

export interface ValorTotalEstoque {
  valor_total_estoque: string;
}