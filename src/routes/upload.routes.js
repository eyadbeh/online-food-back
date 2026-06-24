const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth');
const { ROLES } = require('../constants');
const { uploadSingle, uploadToCloudinary } = require('../middlewares/upload');
const catchAsync = require('../utils/catchAsync');
const { sendSuccess } = require('../utils/apiResponse');

router.post('/', authenticate, authorize(ROLES.ADMIN), uploadSingle, catchAsync(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  const url = await uploadToCloudinary(req.file.buffer);
  sendSuccess(res, { url }, 'File uploaded successfully', 201);
}));

module.exports = router;
