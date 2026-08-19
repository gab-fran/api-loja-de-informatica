// Importa o Router do Express — é ele quem permite criar e organizar as rotas da aplicação
// Request e Response são os tipos que representam a requisição e a resposta HTTP
import { Router, type Request, type Response } from "express";

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

// Exporta o router para que possa ser registrado no servidor principal da aplicação
// O uso de "export { router }" (exportação nomeada) ao invés de "export default" permite
// importar com um nome explícito: import { router } from "./routes.js"
export { router }