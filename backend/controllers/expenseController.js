const Expense = require("../models/expense");

exports.createExpense = async (req, res) => {
  const expense = await Expense.create(req.body);
  res.json(expense);
};

exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
};

exports.deleteExpense = async (req, res) => {
  const expense = await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: "Expense deleted successfully" });
};

exports.getBalance = async (req, res) => {
  const expenses = await Expense.find();
  const balance = {};

  expenses.forEach((exp) => {
    const split = exp.amount / exp.participants.length;
    exp.participants.forEach((person) => {
      if (!balance[person]) {
        balance[person] = 0;
      }
      if (person === exp.paidBy) {
        balance[person] += exp.amount - split;
      } else {
        balance[person] -= split;
      }
    });
  });
  res.json(balance);
};
