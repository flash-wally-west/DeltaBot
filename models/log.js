const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    donorID: String,
    recID: String,
    time: Number,
})

module.exports=mongoose.model("Log",dataSchema);