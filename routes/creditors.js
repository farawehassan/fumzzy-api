const express = require('express')
const controller = require('../controllers/creditor')
const isAuth = require('../middleware/is-auth')
const router = express.Router()

router.post('/create', isAuth, controller.create)

router.post('/addCredit', isAuth, controller.addCreditToCreditor)

router.put('/updateCreditor', isAuth, controller.updateCreditor)

router.get('/getAll', isAuth, controller.getCreditors)

router.get('/fetchAll', isAuth, controller.getPaginatedCreditors)

router.put('/deleteCredit', isAuth, controller.removeCredit)

router.delete('/delete/:id', isAuth, controller.delete)

module.exports = router
