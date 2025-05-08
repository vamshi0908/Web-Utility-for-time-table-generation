const express = require("express");
const router = express.Router();
const TimeTable = require("../../models/TimeTable"); // Make sure this is correct

// POST /api/timetable/save
router.post("/save", async (req, res) => {
  try {
    const { timeTable } = req.body;
    if (!timeTable || !Array.isArray(timeTable)) {
      return res.status(400).json({ error: "Invalid timetable data." });
    }

    let existing = await TimeTable.findOne({});
    if (existing) {
      existing.data = timeTable;
      await existing.save();
      return res.json({ message: "Timetable updated." });
    }

    const newTimetable = new TimeTable({ data: timeTable });
    await newTimetable.save();
    res.json({ message: "Timetable saved." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
