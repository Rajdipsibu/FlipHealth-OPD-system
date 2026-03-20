import type{ Request, Response, NextFunction } from "express";

export const userAccess = (moduleName:string,actionName:string) => {
  return (req:Request,res:Response,next:NextFunction)=>{
    try{
      const policies = req.token.policies;
      if(!policies)return res.status(403).json({ message: "No permissions found" });

      //fetch the role :
      
      //super admin bypass
      if(req.token?.role === "super_admin"){
        return next();
      }

      //check permission:
      const allowed = policies.some((policy:any)=>{
        return (
          policy.module === moduleName &&
          policy.actions.includes(actionName)
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