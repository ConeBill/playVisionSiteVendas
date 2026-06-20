export interface ProductApiDTO {
  id: string;
  nome: string;
  codigo: string;
  preco: number;
  estoque: number;
  disponivel: boolean;
}

export interface ProductsApiResponse {
  atualizadoEm: string;
  total: number;
  produtos: ProductApiDTO[];
}
