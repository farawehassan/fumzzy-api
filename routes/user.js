const express = require("express");
const { check, body } = require("express-validator");
const controller = require("../controllers/user");
const isAdmin = require("../middleware/is-admin");
const router = express.Router();

router.post(
  "/login",
  [
    body("pin", "Please enter a 4 digit valid pin")
      .isNumeric()
      .trim()
      .isLength(4),
  ],
  controller.login
);

router.post(
  "/signup",
  [
    body("pin", "Please enter a 4 digit valid pin")
      .isNumeric()
      .trim()
      .isLength(4),
  ],
  controller.signup
);

router.get("/getAll", isAdmin, controller.getUsers);

router.put("/action/:id/:status", isAdmin, controller.staffAction);

module.exports = router;
