const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,loggedInUser,isReviewAuthor} = require("../middlewares.js");
const reviewController = require("../controllers/reviews.js");




//Review
//post Review Route
router.post("/",loggedInUser,validateReview,wrapAsync(reviewController.createReview));


//Delete Review Route
router.delete("/:reviewId",loggedInUser,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;