// // routes/milk.js
// const express = require("express");
// const router = express.Router();
// const {
//   createOrUpdateMilk,
//   getMonthlyMilk,
//   getMilkByDate,
//   updateMilkEntry,
//   deleteMilkEntry,
// } = require("../controllers/milkController");

// // Routes
// router.post("/", createOrUpdateMilk); // Create or update for a specific date
// router.get("/monthly", getMonthlyMilk); // Get monthly records
// router.get("/:date", getMilkByDate); // Get milk for a specific date
// router.put("/:date", updateMilkEntry); // Update
// router.delete("/:date", deleteMilkEntry); // Delete

// module.exports = router;
// routes/milkRoutes.js
const express = require("express");
const router = express.Router();
const {
  createOrUpdateMilk,
  getMilkByDate,
  getMonthlyMilk,
  updateMilkEntry,
  deleteMilkEntry,
  getMilkInRange,
} = require("../controllers/milkController");

const { authenticate } = require("../middleware/auth");

router.post("/", authenticate, createOrUpdateMilk);
router.get("/date/:date", authenticate, getMilkByDate);
router.get("/monthly", authenticate, getMonthlyMilk);
router.put("/:id", authenticate, updateMilkEntry);
router.delete("/:id", authenticate, deleteMilkEntry);
router.get("/range", authenticate, getMilkInRange);

module.exports = router;

