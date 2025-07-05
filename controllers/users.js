const User = require("../models/user.js");


// Sign Up
//get
module.exports.renderSignupForm = (req,res)=>{
    res.render("./users/signupForm.ejs");
}

//post
module.exports.signupUser =async (req,res,next)=>{
  try{
     let {username,email,password} = req.body;
   let newUser = new User({
    username:username,
    email:email,
   });
   
   let user =  await User.register(newUser,password);
   console.log(user);
   req.login(user,(err)=>{
    if(err){
      return next(err);
    }
   req.flash("success","successfully, Signup To Wanderlust");   
   res.redirect("/listings");
   })


  }catch(err){
   req.flash("error","a user with the given username is already exist");   
   res.redirect("/signup");
  }
}


//Login 
module.exports.renderLoginForm = (req,res) =>{
    res.render("./users/loginForm.ejs")
}


//Login 
module.exports.loginUser = async (req,res) =>{
        req.flash("success","Welcome Back To  Wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
}


//logout
module.exports.logoutUser = (req,res,next)=>{
  req.logOut((err)=>{
    if(err){
    return next(err);
    }
  })
  req.flash("success","You are Logged out");
  res.redirect("/listings");
}