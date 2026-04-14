import type { Request, Response, NextFunction } from 'express';
import { verifyHmacSignature } from '../utils/crypto.util.js';
import redisClient from '../config/redis.js'; // Ensure redis is configured
import env from '../config/env.js';

export const iamSecurityMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const clientId = req.headers['x-client-id'] as string;
  const nonce = req.headers['x-nonce'] as string;
  const signature = req.headers['x-signature'] as string;
  const timestamp = req.headers['x-timestamp'] as string;

  if (!clientId || !nonce || !signature || !timestamp) {
    return res.status(401).json({ message: "Missing security headers" });
  }

  // 1. Timestamp Validation (Section 8: must be within 60 seconds)
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - Number(timestamp)) > 60) {
    return res.status(401).json({ message: "Request expired (timestamp out of sync)" });
  }

  // 2. Replay Protection (Section 7: Nonce check via Redis)
  const nonceKey = `nonce:${clientId}:${nonce}`;
  // SET with EX 60 and NX true ensures it only works once per 60s
  const isUnique = await redisClient.set(nonceKey, '1', { EX: 60, NX: true });
  
  if (!isUnique) {
    return res.status(401).json({ message: "Replay attack detected (Nonce already used)" });
  }

  // 3. HMAC Signature Validation (Section 6)
  const isValid = verifyHmacSignature(
    clientId,
    nonce,
    timestamp,
    req.body,
    signature,
    env.IAM_CLIENT_SECRET
  );

  if (!isValid) {
    return res.status(401).json({ message: "Invalid HMAC signature" });
  }

  next();
};