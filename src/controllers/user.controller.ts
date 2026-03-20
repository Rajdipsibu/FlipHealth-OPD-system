import type { Request, Response } from "express";

export const updateUser = async(req:Request,res:Response)=>{
  try{
    
  }
  catch(err){
    console.error(err);
    res.status(400).json({message:"internal server error !!"});
  }
}