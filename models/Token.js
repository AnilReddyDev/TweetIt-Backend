const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const tokenSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 6000, //10 mintues
  },
});
module.exports = mongoose.model("Token",tokenSchema)