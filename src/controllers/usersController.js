const usersService = require('../services/usersService');

const map = {
    TOKEN_MISSING: 400,
    EMAIL_NOT_VERIFIED: 401,
    USER_NOT_ALLOWED: 403,
    INVALID_TOKEN:401
  };

const getAllDrafts = async (req, res) =>{

    try{

        const drafts = await usersService.getAllDrafts(req,res);

        return res.status(200).json({ 
              success: true,
              message: "get drafts was successfully",
              data: drafts 
          });
       
    }catch(error){
       res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};

const validateLogin = async (req, res) => {

  try{

    const data = await usersService.validateLogin(req,res);

    return res.json({
        success: true,
        message: "Login Successful",
        user: data
      });
    
  }catch(error){
    res.status(map[error.message] || 500).json({
      success: false,
      message: error.message,
    });
  
  }
  
};


const logout = async (req, res) => {

  try{

    await usersService.logout(req,res);

  }catch(error){

    res.status(map[error.message] || 500).json({
      success: false,
      message: error.message,
    });

  }
  
};


const checkSession = async (req, res) => {

  try{

    await usersService.checkSession(req,res);

  }catch(error){

     res.status(map[error.message] || 500).json({
      success: false,
      message: error.message,
    });

  }
  
};


const getRadicadoByIdDetails = async (req, res) => {

  try {
    
    const result = await usersService.getRadicadoByIdDetails(req,res);

    return res.status(200).json({ 
        success: true,
        message: 'Get draft was succesful', 
        ...result
      });
  } catch (error) {
    res.status(map[error.message] || 500).json({
      success: false,
      message: error.message
    });
  }
};


module.exports = { validateLogin, checkSession, logout, getRadicadoByIdDetails, getAllDrafts};
