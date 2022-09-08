const express = require("express");
const Posts = require("./posts");
const Reviews = require("./comments");
const Users = require("./users");
const Likes = require("./likes");
const router = express.Router();
router.use("/", [Users]);

router.use("/comment", Reviews);

router.use("/", [Posts]);

router.use("/", [Likes]);
router.use("/", [Users]);

module.exports = router;
