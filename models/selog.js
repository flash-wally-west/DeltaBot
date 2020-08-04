const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
    SE_ID: String,
    IL_ID: String,
    convodata: [],
    finished: Boolean,
    claim: String,
    server: String,
    channel: String,
    SE_consent:Boolean,
    IL_consent:Boolean,
})

module.exports=mongoose.model("SELog",dataSchema);