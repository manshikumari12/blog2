const express= require("express")
const jwt =require("jsonwebtoken")
const {user}= require("../models/user.model")
const bcrypt = require("bcrypt")
const {blacklist}=require("../models/blacklist.model")
const {authorize}=require("../middleware/authorize")
const {auth}=require("../middleware/auth")

const userRouter =express.Router();

/// register ,login,logout,refresh token



//register
userRouter.post("/register",async(req,res)=>{
    try {
        const {name,email,password,role}=req.body
        const userpresent = await user.findOne({email})
   
        if(userpresent){
          return  res.status(400).send({msg:"already a user,please login"})
        }
    

        const hashedpassword = bcrypt.hashSync(password,8)
        const newuser = new user({...req.body,password:hashedpassword});
        await newuser.save()
        return res.send({msg:"register sucessfully",user:newuser})

    } catch (error) {
        return res.status(500).send({msg:error.message})  

    }

})



//login
userRouter.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body
        const userpresent = await user.findOne({email})

        if(!userpresent){
          return  res.status(400).send({msg:"not a user,please login"})
        }
        const ispasswordcorrect =bcrypt.compareSync(password,userpresent.password)
        if(!ispasswordcorrect) 
        return res.status(400).send({msg:"wrong person,please login"})

        //generate token
        const accesstoken= jwt.sign({email,role:userpresent.role},"secret",{expiresIn:"1m"})

        //refreshtoken
        const refreshtoken =jwt.sign({email,role:userpresent.role},"refresh",{expiresIn:"5m"})

       

        res.cookie("access",accesstoken)
        res.cookie("refresh",refreshtoken)
        res.send({msg:"login success"})

        
    } catch (error) {
        return res.status(400).send({msg:error.message})   
    }
})

//logout
userRouter.get("/logout",async(req,res)=>{
    try {
    

     const{access,refresh}=req.cookies
     const blacklistaccesstoken=new blacklist({token:access}) // {token: access}
     const blacklisrefreshttoken=new blacklist({token: refresh})
     await blacklistaccesstoken.save()
    await blacklisrefreshttoken.save()
    return  res.send({msg:"logout  sucessfull"})

        
    } catch (error) {
        return res.status(400).send({msg:error.message})
    }
})


//refreshtoken
userRouter.get("/refreshtoken",async(req,res)=>{
    try {
         
        const refreshtoken=req.cookies.refreshtoken||req?.headers?.authorization
        const tokenblacklist =await blacklist.find({token:refreshtoken})
        if(tokenblacklist)  return res.status(400).send({msg:"please login again"}) 
        const tokenvalid=jwt.verify(refreshtoken,"refresh")    
        if(!tokenvalid)
        return res.status(400).send({msg:"please login again"}) 

        const nweaccess=jwt.sign({email:tokenvalid.email,role:tokenvalid.role},"refresh",{expireIn:"7d"})
       
        res.cookie(accesstoken,nweaccess,{httpOnly:true,path:"/api/user/blog"})
        return res.send({msg:"token generated"})
    } catch (error) {
        return res.status(400).send({msg:error.message}) 
    }
})







userRouter.use(auth)

userRouter.post("/createUser",authorize(["User"]),async(req,res)=>{
  const {name,email,password,role} = req.body
  try{
  const isUserPresent = await user.findOne({email})
  if(!isUserPresent){
  const hashed = bcrypt.hashSync(password,5)
  if(hashed){
    const newUser = new user({name,email,password:hashed,role})
    await newUser.save()
    res.status(200).send({msg:"User Successfully Registered"})
  }
  }else{
   res.status(400).send({msg:"User Is Already exists,please login"})
  }
  }
  catch(err){
  res.status(400).send({msg:err.message})
  }
})

userRouter.delete("/deleteUser/:id",authorize(["Moderator"]),async (req,res)=>{
const id = req.params.id
try{
  let deleteUser = await user.findByIdAndDelete({_id:id})
  res.send("User data has been Deleted")
}
catch(err){
  res.send({msg:err.message})
}
})
module.exports={userRouter}