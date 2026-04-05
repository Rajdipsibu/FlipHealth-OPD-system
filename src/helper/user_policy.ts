import Action from "../models/Action.js";
import Module from "../models/Module.js";
import ModuleAction from "../models/ModuleAction.js";
import PermissionRole from "../models/PermissionRole.js";
import UserRole from "../models/UserRole.js";
import { Op } from "sequelize";

export const getUserPolicies = async(userId:number)=>{
  try{    
    //fetch the all role of that particular user:
    const userRoles = await UserRole.findAll({
      where:{user_id:userId}
    });
    //fetch roleIds:
    const roleIds = userRoles.map((user_role)=>user_role.dataValues.role_id);
    
    //fetch the permission according to roleIds:
    const permissionRoles = await PermissionRole.findAll({
      where:{
        role_id:{[Op.in]:roleIds}
      },
      include:[
        {
          model:ModuleAction,
          include:[
            {model:Module},
            {model:Action}
          ]
        }
      ]
    });
    //Create Flat Dot Notation Array
    const policies:string[] = [];

    const permissionData = permissionRoles.map(p => p.toJSON());

    permissionData.forEach(pd => {
      const module_action = pd.ModuleAction;
      const module_code = module_action?.Module?.code;
      const action_code = module_action?.Action?.code;

      if (module_code && action_code) {
        const policyString = `${module_code}.${action_code}`;
        
        // Ensure no duplicates
        if (!policies.includes(policyString)) {
          policies.push(policyString);
        }
      }
    })
    
    return policies.sort();
  }catch(err){
    console.error("Policy Flattening Error:", err);
    return [];
  }
}