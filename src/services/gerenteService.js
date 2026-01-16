const gerenteModel = require("../models/gerenteModel");

const gerenteService = {

  createRequestAdjustment: (req,res) =>gerenteModel.createRequestAdjustment(req,res), 
  updateStatusDraftAcept:(req,res) => gerenteModel.updateStatusDraftAcept(req,res)

};

module.exports = gerenteService;
