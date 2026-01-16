const express = require("express");

const {createRequestAdjustments, updateStatusDraftAcept} = require("../controllers/gerenteController")

const router = express.Router();

router.post("/createRequestAdjustments_gerente", createRequestAdjustments)
router.post("/aceptDrafts_gerente",updateStatusDraftAcept );




module.exports = router;