const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    userID: String,
    pieces: Number,
})

module.exports=mongoose.model("Pieces",dataSchema);