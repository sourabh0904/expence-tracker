const Group = require("../models/group");
const Expense = require("../models/expense");

exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || !members || members.length === 0) {
      return res.status(400).json({ message: "Please provide name and members" });
    }

    if (!members.includes(req.user.id)) {
      members.push(req.user.id);
    }

    const group = await Group.create({
      name,
      members,
      createdBy: req.user.id,
    });

    const populatedGroup = await Group.findById(group._id).populate("members", "name email");

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id })
      .populate("members", "name")
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getGroupDetails = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate("members", "name email");

    if (!group) {
        return res.status(404).json({ message: "Group not found" });
    }

    if (!group.members.some(member => member._id.toString() === req.user.id)) {
        return res.status(403).json({ message: "Not authorized to view this group" });
    }
    const expenses = await Expense.find({ groupId: req.params.id })
        .populate("paidBy", "name")
        .populate("participants", "name");

    res.json({ group, expenses });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
