const gerenteService = require("../services/gerenteService")

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

const updateStatusDraftAcept = async (req,res) =>{
  try {

    const data = await gerenteService.updateStatusDraftAcept(req,res);
   
    return res.status(200).json({ 
              success: true, 
              message: `Draft acepted and status updated`,
              data: data 
          });
   
  } catch (error) {
    res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });
  }
  ;
}


const createRequestAdjustments = async (req,res)=>{
  
    try{

      const data = await gerenteService.createRequestAdjustment(req,res);
         
      return res.status(200).json({
          success: true,
          message: "Comment added and adjusment request created successfully",
          ...data
        });
         

    }catch(err){
         res.status(500).json({ error: "Error al obtener los radicados" });

    }

};



module.exports = {createRequestAdjustments, updateStatusDraftAcept}
