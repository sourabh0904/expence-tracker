const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { createGroup, getGroups, getGroupDetails } = require("../controllers/groupController");

router.post("/", protect, createGroup);
router.get("/", protect, getGroups);
router.get("/:id", protect, getGroupDetails);

module.exports = router;
