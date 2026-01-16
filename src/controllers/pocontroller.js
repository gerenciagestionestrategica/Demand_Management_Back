const poService = require('../services/poService');

const map = {
    TOKEN_MISSING: 400,
    DATA_FORM_MISSING:400,
    INVALID_TOKEN:401,
    NOT_FILE:400,
    FILE_NOT_FIND:400,
    N8N_TIMEOUT:504,
    N8N_ERROR:502,
    N8N_UNAVAILABLE:503,
    USER_NOT_ALLOWED: 403,
    INVALID_DRAFT_ID:400,
    DRAFT_NOT_FOUND:404,
    NOT_ALLOWED_EDIT:403
  };

const getRadicadosByUser = async (req, res) => {

  try {
    const data = await poService.getRadicadosByUser(req,res);

    return res.status(200).json({
          success: true,
          message:"Get Drafts was successful",
          data: data
      });

  } catch (error) {
    res.status(map[error.message] || 500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAnswerIa = async (req, res) => {

  try{
    const data = await poService.getAnswerIa(req,res);

    return res.status(200).json({ 
        success: true,
        message: 'File send to n8n to be proccess fot the IA successful', 
        data: data 
      });

  }catch(error){
     res.status(map[error.message] || 500).json({
      success: false,
      message: error.message,
    });
  }
  
};


const getRadicadoByIdAjustes = async (req, res) => {
  
  try{
    const result = await poService.getRadicadoByIdAjustes(req, res);

    return res.status(200).json({ 
        success: true,
        message: 'Get draft was succesful', 
        ...result
      });

  }catch(error){
    res.status(map[error.message] || 500).json({
      success: false,
      message: error.message
    });
  }

  
};


const createDraft = async (req, res) => {
  try {
    const id = await poService.createDraft(req,res);

    return res.status(200).json({ 
        success: true,
        message: 'Draft was create successfully', 
        docId: id
      });
  } catch (error) {
    res.status(map[error.message] || 500).json({
      success: false,
      message: error.message
    });
  }
}


const UpdateRadicadoById= async (req, res) => {

  try {
    const result = await poService.UpdateRadicadoById(req,res);

    return res.status(200).json({
        success: true,
        message: "Draft updated successfully",
        ...result
      });
  } catch (error) {
    res.status(map[error.message] || 500).json({
      success: false,
      message: error.message
    });
  }
  
};

module.exports = { getRadicadoByIdAjustes, getRadicadosByUser, UpdateRadicadoById,createDraft, getAnswerIa };
