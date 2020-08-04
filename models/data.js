const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    name: String,
    userID: String,
    deltas: Number,
    deltas_awarded: Number,
})

module.exports=mongoose.model("Data",dataSchema);