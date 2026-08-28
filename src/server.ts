// Importa o framework Express — é ele quem cria e gerencia o servidor web da aplicação
// Adicionamos as tipagens do Request, Response e NextFunction do express para o tratamento de erros
import express, { type Request, type Response, type NextFunction } from "express";
// Importa o middleware CORS (Cross-Origin Resource Sharing)
// O CORS controla quais origens (domínios) têm permissão para acessar a API
import cors from "cors";
// Importa as bibliotecas do Swagger para geração e exibição automática da documentação
import swaggerAutogen from "swagger-autogen";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// Importa o router criado no arquivo routes.ts — contém todos os endpoints da aplicação
import { router } from "./routes.js";

// Configura o caminho absoluto (__dirname) para suporte a módulos ES (ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Cria servidor express
 */
// Cria a instância do servidor Express e armazena na variável "server"
const server = express();

/**
 * Configurações do servidor
 */
// Registra o middleware que permite ao servidor ler e interpretar corpos de requisição em formato JSON
server.use(express.json());

// Registra o middleware CORS com as configurações padrão
server.use(cors());

/**
 * Configuração Automática do Swagger
 */
const outputFile = path.resolve(__dirname, "./swagger.json");

// Identifica se o arquivo de rotas está em .ts (desenvolvimento) ou .js (compilado)
const routesPath = fs.existsSync(path.resolve(__dirname, "./routes.ts"))
  ? path.resolve(__dirname, "./routes.ts")
  : path.resolve(__dirname, "./routes.js");

const endpointsFiles = [routesPath];

const doc = {
  info: {
    title: "Minha API",
    description: "Documentação e endpoints gerados automaticamente",
  },
  host: "localhost:3000",
};

// Gera o arquivo swagger.json no momento em que o servidor inicia
await swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);

// Se o arquivo foi gerado com sucesso, disponibiliza a UI do Swagger e o JSON
if (fs.existsSync(outputFile)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(outputFile, "utf-8"));

  // Serve a interface gráfica do Swagger no navegador (ex: http://localhost:3000/api-docs)
  server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Serve o arquivo JSON diretamente para importação no Postman (ex: http://localhost:3000/swagger.json)
  server.get("/swagger.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.sendFile(outputFile);
  });
}

// Registra o router com todos os endpoints da aplicação
// A partir daqui, toda requisição que chegar ao servidor será direcionada para a rota correspondente
server.use(router);

// Middleware de fallback para rotas não encontradas (404 Not Found)
server.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

// Middleware Tratador de Erros Global (Global Error Handler)
server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERRO GLOBAL]: ${err.message}`);
  // Retorna 500 para não vazar stacktrace de erros
  res.status(500).json({ erro: "Erro interno do servidor" });
});

// Exporta o servidor para que possa ser importado e iniciado em outro arquivo (geralmente o index.ts ou server.ts)
export { server };