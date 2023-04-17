const mongoose=require("mongoose")

const BlacklistSchema = mongoose.Schema({
    token:{type:String,required:true}
})

const blacklist =mongoose.model("blacklist",BlacklistSchema)

module.exports={blacklist}