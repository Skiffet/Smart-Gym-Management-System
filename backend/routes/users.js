const express = require('express');
const router = express.Router();
const {
  getAllUsers, getUserById, createUser, updateUser, deleteUser, getTrainers, getMembers,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/trainers', authorize('admin', 'trainer'), getTrainers);
router.get('/members', authorize('admin', 'trainer'), getMembers);

router.route('/')
  .get(authorize('admin'), getAllUsers)
  .post(authorize('admin'), createUser);

router.route('/:id')
  .get(authorize('admin'), getUserById)
  .put(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

module.exports = router;
