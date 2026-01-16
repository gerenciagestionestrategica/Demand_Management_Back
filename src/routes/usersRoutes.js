const express = require("express");
const { validateLogin, checkSession, logout, getRadicadoByIdDetails, getAllDrafts } = require('../controllers/usersController');

const router = express.Router();

router.get("/getAllDrafts", getAllDrafts)
router.post("/validateLogin", validateLogin);
router.get("/checkSession", checkSession);
router.post("/logout", logout);
router.post("/getDraftDetails",getRadicadoByIdDetails );



module.exports = router;

