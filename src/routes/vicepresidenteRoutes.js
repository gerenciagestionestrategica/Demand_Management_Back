const express = require("express");

const {updateStatusDraftAcept, createRequestAdjustments} = require("../controllers/vicepresidenteController")

const router = express.Router();

router.post("/aceptDraftsVicepresidente", updateStatusDraftAcept);
router.post("/createRequestAdjustmentsVicepresidente",createRequestAdjustments);


module.exports = router;