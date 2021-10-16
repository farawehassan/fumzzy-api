const express = require("express");
const controller = require("../controllers/productCategories");
const isAuth = require("../middleware/is-auth");
const router = express.Router();

router.post("/create", isAuth, controller.create);

router.put("/edit", isAuth, controller.edit);

router.get("/getAll", isAuth, controller.getCategories);

router.delete("/delete/:id", isAuth, controller.delete);

module.exports = router;
