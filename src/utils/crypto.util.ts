import crypto from 'node:crypto';
import env from '../config/env.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;


const KEY = crypto
  .createHash('sha256')
  .update(String(env.ENCRYPTION_KEY))
  .digest();

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  // Specify the authTagLength in options for extra safety
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv, { authTagLength: AUTH_TAG_LENGTH });

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

export const decrypt = (hash: string): string => {
  const [ivHex, authTagHex, encryptedHex] = hash.split(':');
  
  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error('Invalid cipher text format.');
  }

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
