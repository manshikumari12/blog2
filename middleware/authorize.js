const authorize = ([permitedRole])=>{
    return (req,res,next)=>{
        let role = req.role
        console.log(role)
       if(role==permitedRole){
        next()
       }else{
        res.send("unauthorize")
       }
    }
}

module.exports = {authorize}