const mongoose = require("mongoose");

const SearchSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  term: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Search", SearchSchema);
