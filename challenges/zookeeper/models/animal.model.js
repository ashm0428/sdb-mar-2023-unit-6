const mongoose = require("mongoose");

const AnimalSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
},
legNumber: {
    type: Number,
    required: true,
},
predator: {
    type: Boolean,
    required: true,
},
user_id: {
    type: mongoose.Types.ObjectId, 
    ref: "User",
}
});


module.exports = mongoose.model("Animal", AnimalSchema)