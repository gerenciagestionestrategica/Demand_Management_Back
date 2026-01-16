// src/routes/poRoutes.js
const express = require("express");

const router = express.Router();
const { checkSession } = require('../controllers/check');

router.get("/health-check", checkSession);



module.exports = router;