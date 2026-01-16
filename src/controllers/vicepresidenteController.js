const vicepresidenteService = require("../services/vicepresidenteService.js")

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
    NO_FIND_VICEPRESIDENTE:404
  };


const updateStatusDraftAcept = async (req,res) =>{

  try {
  
    const dataDraft = await vicepresidenteService.updateStatusDraftAcept(req,res);

    return res.status(200).json({ 
          success: true, 
          message: `Draft accepted and status updated.`,
          data: dataDraft
      });
   
  } catch (error) {
    res.status(map[error.message] || 500).json({
      success: false,
      message: error.message,
    });
  };
};

const createRequestAdjustments = async (req,res)=>{

    try{
      
      const result= await vicepresidenteService.createRequestAdjustment(req,res);
         
      return res.status(200).json({
        success: true,
        message: "Comment add and Request Adjustments created successfully",
        ...result
      });

    }catch(err){
      res.status(map[error.message] || 500).json({
        success: false,
        message: error.message,
      });

    }

};


module.exports = {createRequestAdjustments, updateStatusDraftAcept}