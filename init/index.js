const mongoose = require("mongoose");
const Listing = require('../models/listing.js');
const initData = require("./data.js");


const mongoLink = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=>{
   console.log("Connected to database");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongoLink);
}

let initDB = async ()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj,owner:"685d80ed9e46041aaad01756", geometry: {
      type: "Point",
      coordinates: [77.5946, 12.9716], // Longitude, Latitude (Bangalore as dummy)
    },}));    
    await Listing.insertMany(initData.data);
    console.log("Data was Initialized");
}

initDB();
