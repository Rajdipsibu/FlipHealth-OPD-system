import env from "../config/env.js";
import jwt from "jsonwebtoken";
import Session from "../models/Session.js";

export const user_token = async(userData:{id: number, user_type: string, policies: string[]})
:Promise<{accessToken:string,refreshToken:string}>=>{
    //token:
    const accessToken  = jwt.sign(userData,env.JWT_SECRET,{expiresIn: "1h"});
    const refreshToken  = jwt.sign({ id:userData.id }, env.REFRESH_SECRET, { expiresIn: "7d" });

    //Store in Sessions Table
    try{

      // Delete old sessions first if you only want 1 active login
      await Session.destroy({ where: { user_id: userData.id, type: ['access_token', 'refresh_token']  }});
      
      await Session.bulkCreate([
        { 
          user_id: userData.id, 
          type: "access_token",
          token: accessToken, 
          expires_at: new Date(Date.now() + 60 * 60 * 1000) 
        },
        { 
          user_id: userData.id, 
          type: "refresh_token", 
          token: refreshToken, 
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
        }
      ])

      return {
        accessToken,
        refreshToken
      };

    }catch(error){
      console.log(error);
      throw error;
    }
    
}