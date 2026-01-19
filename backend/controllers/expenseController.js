const Expense = require("../models/expense");

exports.createExpense = async (req, res) => {
  try {
    const { description, amount, participants, paidBy, groupId, splitType, splitDetails } = req.body;

    // 1. Input Validation
    if (!description || amount <= 0 || !participants || participants.length === 0) {
      return res.status(400).json({ message: "Invalid expense data" });
    }

    // 2. Logical Validation: paidBy must be in participants
    // Note: paidBy and participants are now User IDs (strings in JSON)
    if (!participants.includes(paidBy)) {
      return res.status(400).json({ message: "PaidBy must be in participants" });
    }

    // 3. Advanced Split Validation
    if (splitType === "unequal") {
        const totalSplit = splitDetails.reduce((sum, item) => sum + item.amount, 0);
        if (Math.abs(totalSplit - amount) > 0.01) { // Allow tiny float error
            return res.status(400).json({ message: `Total split amount (${totalSplit}) must match expense amount (${amount})` });
        }
    } else if (splitType === "percentage") {
        const totalPercent = splitDetails.reduce((sum, item) => sum + item.percentage, 0);
        if (Math.abs(totalPercent - 100) > 0.1) {
             return res.status(400).json({ message: "Total percentage must be 100%" });
        }
    }

    const expense = await Expense.create({
      description,
      amount,
      paidBy,
      participants,
      groupId,
      splitType,
      splitDetails,
    });
    
    // Populate for response
    const populatedExpense = await Expense.findById(expense._id)
        .populate("paidBy", "name")
        .populate("participants", "name");

    res.json(populatedExpense);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("paidBy", "name")
      .populate("participants", "name");
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getBalance = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("paidBy", "name")
      .populate("participants", "name")
      .populate({ path: "splitDetails.userId", select: "name" }); // Populate split details users
      
    const balance = {};

    expenses.forEach((exp) => {
      exp.participants.forEach((person) => {
        const name = person.name; 
        if (!balance[name]) balance[name] = 0;
      });

      // Calculate how much each person OWES for this expense
      const getOwedAmount = (personId) => {
        if (exp.splitType === "equal") {
             return Number((exp.amount / exp.participants.length).toFixed(2));
        } else if (exp.splitType === "unequal") {
            const detail = exp.splitDetails.find(d => d.userId._id.toString() === personId.toString());
            return detail ? detail.amount : 0;
        } else if (exp.splitType === "percentage") {
            const detail = exp.splitDetails.find(d => d.userId._id.toString() === personId.toString());
            return detail ? Number(((detail.percentage / 100) * exp.amount).toFixed(2)) : 0;
        }
        return 0;
      };

      exp.participants.forEach((person) => {
        const name = person.name; 
        const owed = getOwedAmount(person._id);
        
        // If this person PAID, they get back (Amount - Owed)
        if (person._id.toString() === exp.paidBy._id.toString()) {
           balance[name] = Number((balance[name] + exp.amount - owed).toFixed(2));
        } else {
           // If they didn't pay, they owe the calculated amount
           balance[name] = Number((balance[name] - owed).toFixed(2));
        }
      });
    });
    res.json(balance);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
