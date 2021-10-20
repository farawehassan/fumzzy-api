const express = require("express")
const controller = require("../controllers/expenses")
const isAuth = require("../middleware/is-auth")
const router = express.Router()

router.post("/create", isAuth, controller.create)

router.get("/getAll", isAuth, controller.getExpenses)

router.delete("/delete/:id", isAuth, controller.delete)

module.exports = router
