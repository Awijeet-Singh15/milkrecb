const MilkRecord = require('../models/MilkRecord');
const dayjs = require('dayjs');

// Normalize date to start of day (e.g., 2024-05-14T00:00:00.000Z)
const normalizeDate = (date) => dayjs(date).startOf('day').toDate();

// Create or update milk record
exports.createOrUpdateMilk = async (req, res) => {
  try {
    const { date, morning, evening } = req.body;
    const userId = req.user._id;

    const normalizedDate = normalizeDate(date);

    let record = await MilkRecord.findOne({ user: userId, date: normalizedDate });

    if (record) {
      record.morning = morning;
      record.evening = evening;
      await record.save();
      return res.json({ message: "Record updated", record });
    }

    const newRecord = new MilkRecord({
      user: userId,
      date: normalizedDate,
      morning,
      evening,
    });

    await newRecord.save();
    res.status(201).json({ message: "Record saved", record: newRecord });
  } catch (err) {
    console.error("Error in createOrUpdateMilk:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get monthly records
exports.getMonthlyMilk = async (req, res) => {
  try {
    const { year, month } = req.query;
    const userId = req.user._id;

    const start = dayjs(`${year}-${month}-01`).startOf("month").toDate();
    const end = dayjs(start).endOf("month").toDate();

    const records = await MilkRecord.find({
      user: userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    res.json(records);
  } catch (err) {
    console.error("Error in getMonthlyMilk:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// Get specific record by date
exports.getMilkByDate = async (req, res) => {
  try {
    const userId = req.user._id;
    const normDate = normalizeDate(req.params.date);

    const record = await MilkRecord.findOne({ user: userId, date: normDate });
    if (!record) return res.status(404).json({ message: 'Record not found' });

    res.json(record);
  } catch (err) {
    console.error("getMilkByDate error:", err.message);
    res.status(500).json({ message: 'Failed to fetch record' });
  }
};

// Update record by date
exports.updateMilkEntry = async (req, res) => {
  try {
    const userId = req.user._id;
    const recordId = req.params.id;
    const { morning, evening } = req.body;

    const record = await MilkRecord.findOneAndUpdate(
      { _id: recordId, user: userId },
      { morning, evening },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Milk entry updated', record });
  } catch (err) {
    console.error("updateMilkEntry error:", err.message);
    res.status(500).json({ message: 'Update failed' });
  }
};


// Delete record by date
exports.deleteMilkEntry = async (req, res) => {
  try {
    const userId = req.user._id;
    const recordId = req.params.id;

    // Only allow deletion if the record belongs to the current user
    const deleted = await MilkRecord.findOneAndDelete({
      _id: recordId,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json({ message: "Milk record deleted" });
  } catch (err) {
    console.error("deleteMilkEntry error:", err.message);
    res.status(500).json({ message: "Deletion failed" });
  }
};


// In controllers/milkController.js
exports.getMilkInRange = async (req, res) => {
  try {
    const { start, end } = req.query;
    const userId = req.user._id;

    const records = await MilkRecord.find({
      user: userId,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    res.json(records);
  } catch (err) {
    console.error("Error in getMilkInRange:", err);
    res.status(500).json({ error: "Failed to get records" });
  }
};

