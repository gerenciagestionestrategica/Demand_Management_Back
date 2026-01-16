const checkSession = async (req, res) => {

  try{

     return res.status(200).json({ success: true, message: "Oke" });

  }catch(error){
     res.status(500).json({ error: "Error" });
  }
  
};

module.exports = { checkSession};