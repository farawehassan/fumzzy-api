const express = require("express");
const { check, body } = require("express-validator");
const controller = require("../controllers/user");
const isAdmin = require("../middleware/is-admin");
const isAuth = require("../middleware/is-auth");
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

router.put("/edit", isAuth, controller.editUser);

router.put(
  "/changePin",
  isAuth,
  [
    body("currentPin", "Please enter a 4 digit valid pin")
      .isNumeric()
      .trim()
      .isLength(4),

    body("newPin", "Please enter a 4 digit valid pin")
      .isNumeric()
      .trim()
      .isLength(4),
  ],
  controller.changePin
);

router.put("/resetPin/:id", isAdmin, controller.resetPin);

router.get("/getAll", isAdmin, controller.getUsers);

router.put("/action/:id/:status", isAdmin, controller.staffAction);

module.exports = router;
