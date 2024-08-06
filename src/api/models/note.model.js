const mongoose = require("mongoose");
const { Schema: { Types: { ObjectId } } } = mongoose;

/**
 * Note Model
 * @private
 */
const Note = new mongoose.Schema(
  {
    title: { type: String, required: true },
    userId: { type: ObjectId, ref: "User", required: true },
    description: { type: String }
  },
  { timestamps: true }
);

/**
 * @typedef Note
 */

module.exports = mongoose.model("Note", Note);
