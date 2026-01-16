const usersModel = require("../models/usersModel");

const usersService = {

  getAllDrafts: (req,res) => usersModel.getAllDrafts(req,res),
  validateLogin: (token,res) => usersModel.validateLogin(token,res),
  checkSession: (token,res) => usersModel.checkSession(token,res),
  logout: (req,res) => usersModel.logout(req,res),
  getRadicadoByIdDetails: (req,res) => usersModel.getRadicadoByIdDetails(req,res),
  
};

module.exports = usersService;
