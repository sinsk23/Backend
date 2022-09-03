const express = require("express");
const Posts = require("./posts");
const Reviews = require("./comments");
const Users = require("./users");

const router = express.Router();

router.use("/comment", Reviews);

module.exports = router;
