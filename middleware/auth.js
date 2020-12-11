const {User} = require("../modals/User");

let auth = (req,res,next) =>{
    
    let token =req.cookies.x_auth;

    User.findByToken(token,(err,user) => {
            if(err){ 
                console.log("에러 라면")
                return res.json({error : true }) 
            }
            if(!user){ return res.json({ isAuth: false, error: true})}

            req.token =token;
            req.user =user;

            next();

    })
    
}


module.exports ={auth};