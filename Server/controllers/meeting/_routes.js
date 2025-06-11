const express = require("express");
const meeting = require("./meeting");

const router = express.Router();

router.post("/add", meeting.add);
router.get("/", meeting.index);
router.get("/view/:id", meeting.view);
router.delete("/delete/:id", meeting.deleteData);
router.post("/deleteMany", meeting.deleteMany);

module.exports = router;
