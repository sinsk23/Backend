const express = require("express");
const Posts = require("./posts");
const Reviews = require("./comments");
const Social = require("./socials");
const Users = require("./users");
const Likes = require("./likes");
const router = express.Router();
router.use("/", Users);

router.use("/comment", Reviews);

router.use("/", [Social]);

router.use("/", [Posts]);

router.use("/", [Likes]);

module.exports = router;
