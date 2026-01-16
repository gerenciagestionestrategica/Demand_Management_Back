const administradorService = require("../services/administradorService")


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
    NOT_ALLOWED_DELETE: 403,
    INVALID_NAME_ID:400,
    INVALID_ID:400,
    DATA_NOT_FOUND:404,
    USER_NOT_FOUND:404,
    NOT_ALLOWED_EDIT:403
  };

const getAllUsers = async (req, res) =>{

    try{

        const users = await administradorService.getAllUsers(req,res);

        return res.status(200).json({
          success: true,
          messages: "Get all users was successful",
          data: users
        });

       
    }catch(error){
        res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const updateUser = async (req,res)=>{
    try{
         const data = await administradorService.updateUser(req,res);
         
        return res.status(200).json({
            success: true,
            message: "user updated successfully",
            data:data
        });

    }catch(error){

        res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const createUser = async (req, res) =>{

    try{

        const newDocRef = await administradorService.createUser(req,res);

        return res.status(200).json({
            success: true,
            message: "User craeted successfully",
            data: newDocRef
        });
       
    }catch(error){
       
        res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const deleteUser = async (req, res) =>{

    try{

        const userDelete = await administradorService.deleteUser(req,res);


        return res.status(200).json({
            success: true,
            message: "Usuario eliminado",
            data: userDelete
        });
       
    }catch(error){

        res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const getInfoForm = async (req,res) =>{

  try {
   
    const data = await administradorService.getInfoForm(req,res);

    return res.status(200).json({ 
        success: true,
        message: `Get information was successfully`,
        ...data
      });


  } catch (error) {
    res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });
  }
  ;
};


const deleteTribu = async (req, res) =>{

    try{

       await administradorService.deleteTribu(req,res);

        return res.status(200).json({
            success: true,
            message: "Tribu eliminated"
        });
       
    }catch(error){
        res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });
    }

};


const createTribu = async (req, res) =>{

    try{

        const newDocRef = await administradorService.createTribu(req,res);

        return res.status(200).json({
            success: true,
            message: "Tribu created successfully",
            data: newDocRef
        });
       
    }catch(error){
        res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const deleteSquad = async (req, res) =>{

    try{

        await administradorService.deleteSquad(req,res);

        return res.status(200).json({
            success: true,
            message: "Aquad eliminated"
        });
       
    }catch(error){
       res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });
    }

};


const createSquad= async (req, res) =>{

    try{

        const newDocRef = await administradorService.createSquad(req,res);

        return res.status(200).json({
            success: true,
            message: "Squad created succesfully",
            data: newDocRef
        });
       
    }catch(error){
        res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const deleteSponsor = async (req, res) =>{

    try{

        await administradorService.deleteSponsor(req,res);

        return res.status(200).json({
            success: true,
            message: "Vp Sponsor eliminated"
        });
       
    }catch(error){
       res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const createSponsor= async (req, res) =>{

    try{

        const newDocRef = await administradorService.createSponsor(req,res);

        return res.status(200).json({
            success: true,
            message: "Vp Sponsor created successfully",
            data: newDocRef
        });
       
    }catch(error){
       res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const updateSalary= async (req, res) =>{

    try{

        await administradorService.updateSalary(req,res);

        return res.status(200).json({
          success: true,
          message: "Wage updated successfully"
        });
       
    }catch(error){
        res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const updateMinimumCuttingQuantity= async (req, res) =>{

    try{

        await administradorService.updateMinimumCuttingQuantity(req,res);

        return res.status(200).json({
          success: true,
          message: "Minimum Cutting Quantity updated successfully"
        });
       
    }catch(error){
        res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const updateVicepresidentBackup= async (req, res) =>{

    try{

        await administradorService.updateVicepresidentBackup(req,res);

        return res.status(200).json({
          success: true,
          message: "Vice backup updated successfully"
        });
       
    }catch(error){
        res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const createVicepresidentAprover = async (req, res) =>{

    try{

        const newDocRef = await administradorService.createVicepresidentAprover(req,res);

        return res.status(200).json({
            success: true,
            message: "Vicepresident aprover created successfully",
            data: newDocRef
        });
       
    }catch(error){
       
        res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const deleteVicepresidentAprover = async (req, res) =>{

    try{

        const vicepresidentAproverDelete = await administradorService.deleteVicepresidentAprover(req,res);


        return res.status(200).json({
            success: true,
            message: "Vicepresident aprover eliminated successfully",
            data: vicepresidentAproverDelete
        });
       
    }catch(error){

        res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const updateStatusDraft = async (req,res)=>{

    try{
        await administradorService.updateStatusDraft(req,res);

        return res.status(200).json({
            success: true,
            message: "Borrador aceptado y estado actualizado."
        });
         

    }catch(error){
       res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const updateStatusGerentesDraft = async (req,res)=>{
    try{
        await administradorService.updateStatusGerentesDraft(req,res);

        return res.status(200).json({
            success: true,
            message: "Draft was updated successfully"
        });
        
    }catch(error){
       res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const deleteStatusGerentesDraft = async (req,res)=>{
    try{
        await administradorService.deleteStatusGerentesDraft(req,res);

        return res.status(200).json({
            success: true,
            message: "Draft was updated successfully"
        });
        
    }catch(error){
       res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const updateStatusVicepresidentDraft = async (req,res)=>{
    try{
        await administradorService.updateStatusVicepresidentDraft(req,res);

        return res.status(200).json({
            success: true,
            message: "Draft was updated successfully"
        });
        
    }catch(error){
       res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};


const deleteStatusVicepresidentDraft = async (req,res)=>{
    try{
        await administradorService.deleteStatusVicepresidentDraft(req,res);

        return res.status(200).json({
            success: true,
            message: "Draft was updated successfully"
        });
        
    }catch(error){
       res.status(map[error.message] || 500).json({
          success: false,
          message: error.message,
        });

    }

};
 


module.exports = { deleteStatusVicepresidentDraft,updateStatusVicepresidentDraft,deleteStatusGerentesDraft,updateStatusGerentesDraft,
    deleteVicepresidentAprover,createVicepresidentAprover,updateSalary,createSponsor,deleteSponsor,
    createSquad,deleteSquad,deleteTribu,createTribu,getInfoForm,deleteUser, 
     updateStatusDraft, createUser, updateUser, getAllUsers, updateMinimumCuttingQuantity, 
     updateVicepresidentBackup}