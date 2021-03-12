import jwt from 'jsonwebtoken';

export const secret = '3bba648688760eb5876cab26f0596592';

export function createToken (userId: Number) {
  return jwt.sign({ id: userId }, secret, { expiresIn: 60 })
}