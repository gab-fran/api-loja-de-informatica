// imports
import jwt from 'jsonwebtoken';
import { type Request, type Response, type NextFunction } from 'express';
import { DatabaseModel } from '../model/DatabaseModel.js';

// palavra secreta
const SECRET = 'bananinha';
// pool de conexão ao banco de dados
const database = new DatabaseModel().pool;

/**
 * Interface para representar um Payload do JWT
 */
interface JwtPayload {
    id: number;
    nome: string;
    email: string;
    perfil: string;
    exp: number;
}

/**
 * Gera e trata um token de autenticação para o sistema
 */
export class Auth {

    /**
     * Valida as credenciais do usuário no banco de dados
     * @param req Requisição com as informações do usuário
     * @param res Resposta enviada a quem requisitou o login
     * @returns Token de autenticação caso o usuário seja válido, mensagem de login não autorizado caso negativo
     */
    static async validacaoUsuario(req: Request, res: Response): Promise<any> {
        // Verifica se o corpo da requisição existe
        if (!req.body) {
            return res.status(400).json({ message: 'Corpo da requisição é obrigatório' });
        }

        // recupera informações do corpo da requisição
        const { email, senha } = req.body;

        // Verifica se email e senha foram fornecidos
        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios' });
        }

        // query para validar email e senha informados utilizando a tabela usuario
        const querySelectUser = `
        SELECT
            id_usuario,
            nome,
            email,
            perfil
        FROM usuario
        WHERE email = $1 AND senha = $2 AND ativo = TRUE;`;

        try {
            // faz a requisição ao banco de dados
            const queryResult = await database.query(querySelectUser, [email, senha]);

            // verifica se a quantidade de linhas retornada foi diferente de 0
            if (queryResult.rowCount !== 0) {
                const usuario = {
                    id_usuario: queryResult.rows[0].id_usuario,
                    nome: queryResult.rows[0].nome,
                    email: queryResult.rows[0].email,
                    perfil: queryResult.rows[0].perfil
                };

                // Gera o token do usuário
                const tokenUsuario = Auth.generateToken(
                    usuario.id_usuario,
                    usuario.nome,
                    usuario.email,
                    usuario.perfil
                );

                // retorna ao cliente o status de autenticação, o token e o objeto usuario
                return res.status(200).json({ auth: true, token: tokenUsuario, usuario: usuario });
            } else {
                return res.status(401).json({ auth: false, token: null, message: "Usuário e/ou senha incorretos" });
            }
        } catch (error) {
            console.log(`Erro no modelo: ${error}`);
            return res.status(500).json({ message: "Erro interno do servidor" });
        }
    }

    /**
     * Gera token de validação do usuário
     */
    static generateToken(id: number, nome: string, email: string, perfil: string) {
        return jwt.sign({ id, nome, email, perfil }, SECRET, { expiresIn: '1h' });
    }

    /**
     * Verifica o token do usuário para saber se ele é válido
     */
    static verifyToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['x-access-token'] as string;

        if (!token) {
            console.log('Token não informado');
            return res.status(401).json({ message: "Token não informado", auth: false }).end();
        }

        jwt.verify(token, SECRET, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    console.log('Token expirado');
                    return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false }).end();
                } else {
                    console.log('Token inválido.');
                    return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
                }
            }

            if (!decoded) {
                console.log('Token não pôde ser decodificado');
                return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
            }

            const { exp, id } = decoded as JwtPayload;

            if (!exp || !id) {
                console.log('Data de expiração ou ID não encontrada no token');
                return res.status(401).json({ message: "Token inválido, faça o login", auth: false }).end();
            }

            const currentTime = Math.floor(Date.now() / 1000);
            if (currentTime > exp) {
                console.log('Token expirado');
                return res.status(401).json({ message: "Token expirado, faça o login novamente", auth: false }).end();
            }

            req.headers['userId'] = String(id);
            next();
        });
    }
}