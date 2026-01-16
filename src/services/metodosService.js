const MetodosModel = require("../models/metodosModel");

const MetodosService = {
  createRequestAdjustment: (req,res) =>MetodosModel.createRequestAdjustment(req,res), 
  updateStatusDraftAcept:(req,res) => MetodosModel.updateStatusDraftAcept(req,res)
};

module.exports = MetodosService;