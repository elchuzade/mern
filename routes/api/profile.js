const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ msg: "Profile works fine" });
});

module.exports = router;
