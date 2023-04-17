const express =require("express")
const cookieparser = require("cookie-parser")
const { connection } = require("./config/db")
const {userRouter}=require("./routes/user.routers")
const {blogRouter}=require("./routes/blog.router")

const {auth}=require("./middleware/auth")
const app=express()
app.use(express.json())
app.use(cookieparser())



  

//jjkds fcds ds

app.get("/",(req,res)=>{
    res.send("welcome")
})



app.use("/auth",userRouter)
app.use("/use",blogRouter)

app.listen(1111,async()=>{
    try {
        await connection
      console.log("connected to db");
    } catch (error) {
        console.log(error)
      
    }        
    console.log("server is running 1111"); 
})
