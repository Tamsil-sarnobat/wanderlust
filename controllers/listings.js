const Listing = require("../models/listing.js");
const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxgeocoding({ accessToken: mapToken });

//Index(All Listings)
module.exports.index = async (req,res)=>{
   let allListings = await Listing.find({});
   res.render("./listings/index.ejs",{allListings});
}

//NEW ROUTE
module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
}

//CREATE ROUTE
module.exports.createNewlisting = async (req,res)=>{
    let response = await geocodingClient.forwardGeocode({
    query: req.body.listings.location,
    limit: 2
    })
      .send();

    let url = req.file.path;
    let filename = req.file.filename;   
    let listings = new Listing(req.body.listings);
    listings.owner = req.user._id;
    listings.image = {url,filename};
    listings.geometry = response.body.features[0].geometry;
    let savedListing = await listings.save(); 
    console.log(savedListing);
    req.flash("success","New Listing Created Successfully");
    res.redirect("/listings");
}

//SHOW ROUTE
module.exports.showListing = async (req,res)=>{
    let {id}= req.params;
    let  list = await Listing.findById(id).populate({path:"review",populate:{path:"author"}}).populate("owner");
    if(!list){
        req.flash("error","The listing you are search for does not exist!");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{list});
}

//EDIT ROUTE
module.exports.renderEditForm = async (req,res)=>{
    let {id}= req.params;
    let  list = await Listing.findById(id);  
    if(!list){
        req.flash("error","The listing you are search for does not exist!");
        return res.redirect("/listings");
    }    

    let originalUrl = list.image.url;

    originalUrl = originalUrl.replace("/upload","/upload/w_250");
    res.render("./listings/edit.ejs",{list, originalUrl});
}

//Update Route
module.exports.updateListing = async (req,res)=>{
    let {id}= req.params;
    let newListing = await Listing.findByIdAndUpdate(id,{...req.body.listings});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;    
    newListing.image = {url,filename}; 
    await newListing.save();         
    }

    req.flash("success","Listing Edited Successfully");    
    res.redirect(`/listings/${id}`);
}

//Delete Route
module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}