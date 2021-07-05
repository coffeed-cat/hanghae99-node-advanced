const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ comments });
});

module.exports = router;
