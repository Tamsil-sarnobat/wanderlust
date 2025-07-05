const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const {loggedInUser,isOwner,validateListing} = require("../middlewares.js");
const listingControllers = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});
const Listing = require("../models/listing.js");

//ALL lists ROUTE  |  //CREATE ROUTE
router.route("/")
.get(wrapAsync(listingControllers.index))
.post(loggedInUser,upload.single('listings[image]'),validateListing,wrapAsync (listingControllers.createNewlisting));



//Search Get 
router.get("/search",async (req,res)=>{
    let {location} = req.query;
    let response = await Listing.find({location:location});
    console.log(response);
    if(response.length === 0 ){
        return res.render("./listings/error.ejs",{message: "The listing destination you searched for was not found!"});    
    }
    res.render("./listings/index.ejs",{allListings:response });
})

//NEW ROUTE
router.get("/new",loggedInUser,listingControllers.renderNewForm)


//SHOW ROUTE  ||  //Update Route  ||  //Delete Route
router.route("/:id")
.get(wrapAsync(listingControllers.showListing))
.put(loggedInUser,isOwner,upload.single('listings[image]'),validateListing,wrapAsync(listingControllers.updateListing))
.delete(loggedInUser,isOwner,wrapAsync(listingControllers.destroyListing));



//EDIT ROUTE
router.get("/:id/edit",loggedInUser,isOwner,wrapAsync(listingControllers.renderEditForm))






module.exports = router;