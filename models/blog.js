const mongoose = require("mongoose")

const BlogSchema= mongoose.Schema({
    title: String,
  description: String,
  userid: String
})
const blog = mongoose.model("blog",BlogSchema)

module.exports={
    blog
}
  