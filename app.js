const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require('./schema.js');
const Review = require("./models/review.js");

const listings = require("./routes/listing.js");

let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hi, I am root");
});



const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


// app.post("/listings", wrapAsync(async (req, res) => {
//     console.log("Request Body:", req.body);

//     const result = listingSchema.validate(req.body);
//     console.log("Validation Result:", result);

//     if (result.error) {
//         console.log(result.error);
//         throw new ExpressError(400, result.error.details[0].message);
//     }

//     const newListing = new Listing(req.body.listing);
//     console.log("New Listing:", newListing);

//     await newListing.save();

//     res.redirect("/listings");
// }));


// The OG one
// app.post("/listings", wrapAsync(async (req, res, next) => {

//     const result = listingSchema.validate(req.body);

//     if (result.error) {
//         throw new ExpressError(400, result.error.details[0].message);
//     }

//     console.log(result);

//     const newListing = new Listing(req.body.listing);
//     await newListing.save()
//     res.redirect("/listings");
// }));

app.use("/listings", listings);

//Reviews
//Post Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
app.delete(
    "/listings/:id/reviews/:reviewId",
    wrapAsync(async (req, res) => {
        let{id, reviewId} = req.params;

        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
    }));

// app.get("/testListing", async (req, res)=>{
//     let sampleListing = new  Listing({
//         title: "My New villa",
//         description: "by the beach",
//         price: 1299,
//         location: "Calangute, Goa",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went worng!" } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server is listening to 8080");
});