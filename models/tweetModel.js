const mongoose = require("mongoose");

const tweetSchema = mongoose.Schema(
  {
    // user_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "user",
    // },
    ownerid: {
      type: String,
      required: [true, "Please enter the contact name"],
    },
    tweetpost: {
      type: String,
    },
    tweetimg:{
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tweet", tweetSchema);
