if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
//Routes
const listingRoute = require("./routes/listings.js");
const reviewRoute = require("./routes/reviews.js");
const userRoute = require("./routes/user.js");

// const mongoLink = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl = process.env.ATLASDB_URL;

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


main()
.then(()=>{
   console.log("Connected to database");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine("ejs",ejsMate);


const sessionOption = {
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expire:Date.now()+ 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

const store =  MongoStore.create({
    mongoUrl:dbUrl,
    crypto: {
       secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error",()=>{
    console.log("Error in Mongo-Session-Store ",err);
});


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.get("/demouser",async (req,res)=>{
    const fakeUser = new User({
        email:"studel@gmail.com",
        username:"sigma-student",
    });

    let newUser = await User.register(fakeUser,"iampassword");
    res.send(newUser);
})
//listing Routes Use
app.use("/listings",listingRoute);

//review Routes use
app.use("/listings/:id/review",reviewRoute);

//user Routes use
app.use("/",userRoute);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let {status = 500, message = "something Went Wrong"} = err;
    res.status(status).render("./listings/error.ejs",{message});
})


app.get("/",(req,res)=>{
    res.send("Working On The Root!");
})

app.listen(8080,()=>{
    console.log("listening on the port 8080");
});