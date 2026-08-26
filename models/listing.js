const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        filename: String,

        url: {
            type: String,

            default: "https://plus.unsplash.com/premium_photo-1733760125031-62a1611f02db?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

            set: (v) => v === "" ? "https://plus.unsplash.com/premium_photo-1733760125031-62a1611f02db?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
        },

    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        },
    ],

});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;