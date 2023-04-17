const jwt = require('jsonwebtoken');
const {blacklist}=require("../models/blacklist.model");
const { application } = require("express");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const auth = async(req,res,next)=>{
    try {
        ///verify accesstoken 

        const{access}=req.cookies
        console.log(access)
     const tokenblacklist =await blacklist.findOne({token:access})
    
        if(tokenblacklist)  return res.status(400).send({msg:"please login again"}) 
        console.log(tokenblacklist)
        const tokenvalid=jwt.verify(access,"secret")
      console.log(tokenvalid)
        if(!tokenvalid) {
           const nweaccess =await fetch("http://localhost:1111/auth/refresh_token",{
            Headers:{
                "content_Type":"application/json",
                "Authorization":req.cookies.refreshtoken
            }
           }) .then((res)=>res.json())
           res.cookies("access",nweaccess)
        //    next()
           return 
        }
        //call using fetch -refresh-token
        req.body.email=tokenvalid.email
        req.body.role=tokenvalid.role
        next()

        next()
        
    } catch (error) {
        console.log(error);
        res.send({msg:"error"})
    }

}
module.exports={auth}