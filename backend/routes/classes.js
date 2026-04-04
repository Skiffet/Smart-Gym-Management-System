const express = require('express');
const router = express.Router();
const {
  getAllClasses, getClassById, createClass, updateClass, deleteClass, getTrainerClasses,
} = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/my-classes', authorize('trainer'), getTrainerClasses);

router.route('/')
  .get(getAllClasses)
  .post(authorize('admin'), createClass);

router.route('/:id')
  .get(getClassById)
  .put(authorize('admin', 'trainer'), updateClass)
  .delete(authorize('admin'), deleteClass);

module.exports = router;
