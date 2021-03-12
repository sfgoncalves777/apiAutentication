import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { secret } from '../utils/token_user';
import knex from '../database/connection';

interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

async function authMiddleware( request: Request, response: Response, next: NextFunction ) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.json({ error: 'Token não encontrado' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return response.json({ error: 'Token inválido' })
  }

  const [ scheme, token ] = parts;

  if(!/^Bearer$/i.test(scheme)) {
    return response.json({ error: 'Token em formato inválido' })
  }

  /*
  const tokenLog = await knex('users_login')
  .select('*')
  .where('token_user', token)
  .first();

  if(!tokenLog){
    return response.json({ error: 'Token inválido' })
  }
  */

  jwt.verify(token, secret, async (err, decode) => {
    if( err ) {
      return response.json({ error: 'Por favor, faça o login novamente' });
    }

    const { id, exp } = decode as TokenPayload;    
    
    new Date;
    const present = Math.floor(Date.now() / 1000);

    if ( exp - present >= 1 ) {
      const token = jwt.sign({ id: id }, secret, { expiresIn: 300 });

      const dados = {
        token_user: token,
        id_user: id
      }
      
      response.header('authorization', token);

      //await knex('users_login').where('id_user', id).update(dados);
    }
    
    request.userId = id;

    return next();    
    
  });  

}

export default authMiddleware;