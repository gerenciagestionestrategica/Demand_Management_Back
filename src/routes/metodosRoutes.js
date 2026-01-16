const express = require("express");

const {createRequestAdjustments, updateStatusDraftAcept} = require("../controllers/metodosController")

const router = express.Router();


router.post("/createRequestAdjustments", createRequestAdjustments)
router.post("/aceptDrafts",updateStatusDraftAcept );



module.exports = router;