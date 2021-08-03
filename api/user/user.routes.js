const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { getUser, getUsers, updateUser } = require('./user.controller')
const router = express.Router()

router.get('/', getUsers)
router.get('/:id', getUser)

router.use(requireAuth)
router.put('/:id', requireAuth, updateUser)
// TODO: delete user
// router.delete('/:id', requireAuth, requireAdmin, deleteUser)

module.exports = router
