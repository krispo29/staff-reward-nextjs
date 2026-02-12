import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'default-secret-key-change-it';
const key = new TextEncoder().encode(SECRET_KEY);

export async function signJWT(payload: any, expiresIn: string = '8h') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(key);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}
