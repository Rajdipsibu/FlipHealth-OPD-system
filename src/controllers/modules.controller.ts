import type { Request, Response } from "express";
import Module from "../models/Module.js";
import { Op } from 'sequelize';

export const getListModules = async (req: Request, res: Response) => {
  try {
    const module = await Module.findAll();
    res.status(200).json(module);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "internal server error !!!" });
  }
};

export const createModules = async (req: Request, res: Response) => {
  try{
    const {name, code, description} = req.body;
    if(!name || !code) return res.status(400).json({message:"name and code are required !!"});

    //check the module exist or not:
    const exist_module = await Module.findOne({where:{code:code}});
    if(exist_module)return res.status(400).json({message:"the same module is exist !!"});

    const newModule = await Module.create(req.body);
    if(!newModule)return res.status(401).json({message:"module not create successfully !!"});

    return res.status(200).json({message:"module created successfully ",newModule});
  }catch(err){
    console.error(err);
    res.status(400).json({message:"internal server error !!!"});
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  try{
    const id = Number(req.params.id);
    if(!id)return res.status(400).json({message:"id not givien !!"})
    //check the module exist or not
    const isExist = await Module.findByPk(id);
    if(!isExist)return res.status(400).json({message:"module is not exist !!"});

    //finaly delete the module:
    await Module.destroy({where:{id}});
    return res.status(200).json({message:"module is deleted successfully"});
  }catch(err){
    console.error(err);
    res.status(400).json({message:"internal server error !!!"});
  }
}

export const updateModule = async (req: Request, res: Response) => {
  try{
    const id = Number(req.params.id);
    const {name, code, description} = req.body;

    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID!" });

    if(!name || !code) return res.status(400).json({message:"name and code are required !!"});

      //check the module exist or not
    const moduleInstance  = await Module.findByPk(id);
    if(!moduleInstance )return res.status(404).json({message:"module is not exist !!"});

    //Check if the 'code' is already taken by ANOTHER module
    const codeOwner = await Module.findOne({where:{
      code:code,
      id:{[Op.ne]:id}
    }});

    if (codeOwner) {
      return res.status(400).json({ message: `The code '${code}' is already in use by another module!` });
    }

    const updateModule = await moduleInstance.update(req.body);
    if(!updateModule)return res.status(400).json({message:"module is not updated !!"});

    return res.status(200).json({message:"updated successfully !!!",updateModule});
  }catch(err){
    console.error(err);
    res.status(500).json({message:"internal server error !!!"});
  }
}