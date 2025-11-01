const mongoose = require("mongoose");
mongoose.connect(`mongodb://127.0.0.1:27017/beta_06`)
const workshopSchema = new mongoose.Schema({
    orgName: String,
    workshopTitle: String,
    url: String,
    description: String,
    skills: [String],
    tfidfVector: { type: [Number], default: [] },
    embedding: { type: [Number], default: [] },
    participationType: String,
    mode: String,
    venue: String,
    location: String,
    minSize: Number,
    maxSize: Number,
    logo: String,  
    registrationDate : Date,
    commenceDate : Date,
    organiserName : String,
    organiserDesignation : String,
    organiserEmail : String,
    organiserNumber : String
});

module.exports = mongoose.model("Workshop", workshopSchema);
