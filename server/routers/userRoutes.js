const express = require('express');
const { getAllUsers, updateUserRole } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// All user routes require authentication and superadmin role
router.use(protect);
router.use(authorize('superadmin'));

router.route('/')
  .get(getAllUsers);

router.route('/:id/role')
  .patch(updateUserRole);

module.exports = router;
