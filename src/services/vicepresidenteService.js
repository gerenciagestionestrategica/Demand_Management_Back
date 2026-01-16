const vicepresidenteModel = require("../models/vicepresidenteModel");

const vicepresidenteService = {
  
  createRequestAdjustment: (req,res) =>vicepresidenteModel.createRequestAdjustment(req,res), 
  updateStatusDraftAcept:(req,res) => vicepresidenteModel.updateStatusDraftAcept(req,res)
  
};

module.exports = vicepresidenteService;
