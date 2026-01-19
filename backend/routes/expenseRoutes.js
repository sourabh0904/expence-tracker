const express = require("express");

const router = express.Router();
const {
    createExpense,
    getExpenses,
    deleteExpense,
    getBalance,
} = require("../controllers/expenseController");

router.post("/", createExpense);
router.get("/", getExpenses);
router.get("/balance/all", getBalance);
router.delete("/:id", deleteExpense);

module.exports = router;    