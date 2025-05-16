const mongoose = require("mongoose");

const MilkRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true }, // changed from String to Date
  morning: { type: Number, required: true },
  evening: { type: Number, required: true },
});

MilkRecordSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("MilkRecord", MilkRecordSchema);
