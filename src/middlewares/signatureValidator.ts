import type { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis.js";
import { sendResponse } from "../utils/response.js";
import { HTTP_STATUS } from "../utils/httpStatus.js";
import { generateSignature } from "../utils/crypto.util.js";
import env from "../config/env.js";

export const validateIAMRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { 'x-client-id': clientId, 'x-nonce': nonce, 'x-signature': signature, 'x-timestamp': timestamp } = req.headers;

  // 1. Timestamp Validation
  const diff = Math.abs(Date.now() - Number(timestamp));
  if(diff > 60000) return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Request expired");

  // 2. Replay Protection
  const nonceKey = `nonce:${clientId}:${nonce}`;
  const isNew = await redisClient.set(nonceKey, '1', {EX: 60, NX: true});
  if(!isNew) return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, "Replay attack detected");

  // 3. Signature Verification
  const expectedSignature = generateSignature( clientId as string, nonce as string, timestamp as string, req.body, env.IAM_CLIENT_SECRET );
  if(signature !== expectedSignature) return sendResponse(res,HTTP_STATUS.UNAUTHORIZED,"Invalid signature");

  next();
};
