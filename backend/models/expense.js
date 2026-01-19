const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
  },
  splitType: {
    type: String,
    enum: ["equal", "unequal", "percentage"],
    default: "equal",
  },
  splitDetails: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      amount: Number,
      percentage: Number,
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);
