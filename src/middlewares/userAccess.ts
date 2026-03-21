import type{ Request, Response, NextFunction } from "express";

export const userAccess = (moduleName:string,actionName:string) => {
  return (req:Request,res:Response,next:NextFunction)=>{
    try{
      const policies = req.token.policies;
      if(!policies)return res.status(403).json({ message: "No permissions found" });

      //super admin bypass
      if(req.token?.type === "super_admin"){
        return next();
      }

      //check permission:
      const allowed = policies.some((p:any)=>{
        return (
          p.module === moduleName &&
          p.actions.includes(actionName)
        );
      });
      if(!allowed){
        return res.status(403).json({
          message: "Forbidden: Access denied"
        });
      }
      next();
    }catch(error){
      return res.status(500).json({
        message: "Authorization error",
      });
    }
  }
}