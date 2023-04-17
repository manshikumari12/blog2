const express=require("express")
const {blog, blog}= require("../models/blog")
const {auth}=require("../middleware/auth")
const {authorize}=require("../middleware/authorize")
const blogRouter=express.Router()
const jwt=require("jsonwebtoken")
//for creating blog
blogRouter.get("/get",async(req,res)=>{
    const{title}=req.body
    try {
        const blog= await blog.find({title:title})
        
    } catch (error) {
       res.send("no blog") 
    }
})


blogRouter.post("/add", auth,async (req,res)=>{
    const{ title,description}=req.body
 console.log(title,description)

 const postadd =new blog ({title,description})
 await postadd.save()
 res.send("blog post")
})

blogRouter.patch("/update/:id",async(req,res)=>{
    const{id}=req.params
    const payload =req.query
    const updatebl=await blog.findByIdAndUpdate({_id:id},payload)
    res.send("blog patch")
})

blogRouter.delete("/delete/:id",authorize(["moderator"]),async(req,res)=>{
    const {id}=req.params
    const deletebl =await blog.findByIdAndDelete({_id:id})
    res.send("blog delete") 
})
module.exports={
    blogRouter
}
