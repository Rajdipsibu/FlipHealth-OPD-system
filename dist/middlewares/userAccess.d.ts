import type { Request, Response, NextFunction } from "express";
export declare const userAccess: (moduleName: string, actionName: string) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=userAccess.d.ts.map