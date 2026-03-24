import type { Request, Response, NextFunction } from "express";

//Extend the request interface :
declare global {
  namespace Express {
    interface Request {
      pagging: {
        limit: number;
        offset: number;
      };
    }
  }
}

export const pagination = (req: Request, res: Response, next: NextFunction) => {
  //get value from the query or set it default:
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  //validation: ensure they are not negative or zero
  const validatedPage = page < 1 ? 1 : page;
  const validatedLimit = limit < 1 ? 10 : limit;

  //calculate offset = (page-1)*limit
  const offset = (validatedPage - 1) * validatedLimit ;

  //attach it to request:
  req.pagging = {
    limit:validatedLimit,
    offset:offset
  };

  next();
};
