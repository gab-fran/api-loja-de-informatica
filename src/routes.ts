// Importa o Router do Express — é ele quem permite criar e organizar as rotas da aplicação
// Request e Response são os tipos que representam a requisição e a resposta HTTP
import { Router, type Request, type Response } from "express";

import CategoriaController from "./controller/CategoriaController.js";
import ProdutoController from "./controller/ProdutoController.js";

// Cria uma instância do Router — é neste objeto que todas as rotas serão registradas
// O router é depois exportado e conectado ao servidor principal (geralmente no app.ts ou server.ts)
const router = Router();

/**
 * Endpoint padrão
 */
// Rota GET na raiz "/" — serve para verificar se a API está no ar (chamada de "health check")
// Quando acessada, retorna uma mensagem simples confirmando que o servidor está funcionando
router.get('/', (req: Request, res: Response) => {
    return res
        .status(200) // Status HTTP 200 (OK)
        // Retorna um objeto estruturado em JSON com a data e hora atual do servidor
        // Isso ajuda a confirmar não só que está no ar, mas também quando foi acessado
        .json({ mensagem: "Aplicação online", timestamp: new Date() });
});

router.get('/categoria', CategoriaController.todos);
router.get('/categoria/:id', CategoriaController.categoria);
router.post('/categoria', CategoriaController.cadastrar);
router.put('/categoria/:id', CategoriaController.atualizar); 

router.get('/produto', ProdutoController.todos);
router.get('/produto/:id', ProdutoController.produto);
router.post('/produto', ProdutoController.cadastrar);
router.put('/produto/:id', ProdutoController.atualizar);
router.delete('/produto/:id', ProdutoController.remover);
router.get('/produto-valor-por-produto', ProdutoController.valorPorProduto);
router.get('/produto-valor-total-estoque', ProdutoController.valorTotalEstoque);
router.get('/produto-produtos-para-reposicao', ProdutoController.produtosParaReposicao);


// Exporta o router para que possa ser registrado no servidor principal da aplicação
// O uso de "export { router }" (exportação nomeada) ao invés de "export default" permite
// importar com um nome explícito: import { router } from "./routes.js"
export { router }