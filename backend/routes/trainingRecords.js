const express = require('express');
const router = express.Router();
const {
  createRecord, getTrainerRecords, getMemberRecords,
  updateRecord, deleteRecord, getAllRecords,
} = require('../controllers/trainingRecordController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('trainer'), createRecord);
router.get('/trainer', authorize('trainer'), getTrainerRecords);
router.get('/member', authorize('member'), getMemberRecords);
router.get('/all', authorize('admin'), getAllRecords);

router.route('/:id')
  .put(authorize('trainer'), updateRecord)
  .delete(authorize('admin', 'trainer'), deleteRecord);

module.exports = router;
