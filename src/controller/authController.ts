import knex from '../database/connection';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/pageConfig';
import { createToken } from '../utils/token_user';

class User {
  async create (request: Request, response: Response) {
    const users = await knex('users')
      .where('email', request.body.email)
      .select('email')
      .first();

    if(users) {
      return response.json({ error: 'Existe usuário com esse e-mail' })
    }

    const user = await knex('users').insert(request.body);

    return response.json({ user });
  }

  async login (request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await knex('users')
      .where('email', email)
      .select('*')
      .first();
    
    if(!user) {
      return response.json({ error: 'Usuário não encontrado' });
    }

    if ( password !== user.password ) {
      return response.json({ error: 'Senha inválida' })
    }

    const token = createToken(user.id);

    const dados = {
      token_user: token,
      id_user: user.id
    }
    
    response.header('authorization', token);
    //await knex('users_login').insert(dados);

    return response.json({ user, token });
  }

  async logout (request: Request, response: Response) {
    const authHeader = request.headers.authorization as string;
    const parts = authHeader.split(' ');
    const [ scheme, token ] = parts;

    await knex('users_login').where('token_user', token).delete();

    return response.send().status(200);
  }

  async show ( request: Request, response: Response ) {
    return response.json({ user: request.userId });
  }
}

export default User;