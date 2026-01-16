const poModel = require("../models/poModel");

const poService = {

  getRadicadosByUser: (req,res) => poModel.getRadicadosByUser(req,res),
  getAnswerIa:(req,res) => poModel.getAnswerIa(req,res),
  getRadicadoByIdAjustes: (req,res) => poModel. getRadicadoByIdAjustes(req,res),
  createDraft: (req,res) => poModel.createDraft(req,res),
  UpdateRadicadoById: (req,res) => poModel.UpdateRadicadoById(req,res)

};

module.exports = poService;
