const administradorModel = require("../models/administradorModel");

const administradorService = {
  getAllUsers: (req,res) => administradorModel.getAllUsers(req,res),
  updateUser:(req,res) => administradorModel.updateUser(req,res),
  createUser: (req,res) => administradorModel.createUser(req,res),
  deleteUser: (req,res) => administradorModel.deleteUser(req,res),
  getInfoForm: (req,res) => administradorModel.getInfoForm(req,res),
  deleteTribu: (req,res) => administradorModel.deleteTribu(req,res),
  createTribu: (req,res) => administradorModel.createTribu(req,res),
  deleteSquad: (req,res) => administradorModel.deleteSquad(req,res),
  createSquad: (req,res) => administradorModel.createSquad(req,res),
  deleteSponsor: (req,res) => administradorModel.deleteSponsor(req,res),
  createSponsor: (req,res) => administradorModel.createSponsor(req,res),
  updateSalary: (req,res) => administradorModel.updateSalary(req,res),
  updateMinimumCuttingQuantity: (req,res) => administradorModel.updateMinimumCuttingQuantity(req,res),
  updateVicepresidentBackup: (req,res) => administradorModel.updateVicepresidentBackup(req,res),
  deleteVicepresidentAprover: (req,res) => administradorModel.deleteVicepresidentAprover(req,res),
  createVicepresidentAprover: (req,res) => administradorModel.createVicepresidentAprover(req,res),
  updateStatusDraft :(req,res) => administradorModel.updateStatusDraft(req,res),
  updateStatusGerentesDraft: (req,res) => administradorModel.updateStatusGerentesDraft(req,res),
  deleteStatusGerentesDraft: (req,res) => administradorModel. deleteStatusGerentesDraft(req,res),
  updateStatusVicepresidentDraft: (req,res) => administradorModel.updateStatusVicepresidentDraft(req,res),
  deleteStatusVicepresidentDraft: (req,res) => administradorModel. deleteStatusVicepresidentDraft(req,res)
  
};


module.exports = administradorService;