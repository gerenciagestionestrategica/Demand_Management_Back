const express = require("express");

const { deleteStatusVicepresidentDraft, updateStatusVicepresidentDraft, deleteStatusGerentesDraft,updateStatusGerentesDraft, createVicepresidentAprover ,deleteVicepresidentAprover,
    updateSalary,createSponsor,deleteSponsor,createSquad,deleteSquad,createTribu,deleteTribu,getInfoForm,deleteUser,
   updateStatusDraft, createUser, updateUser, getAllUsers, updateMinimumCuttingQuantity, 
    updateVicepresidentBackup} = require("../controllers/administradorController")

const router = express.Router();

router.get("/getAllUsers_Admin", getAllUsers);
router.post("/updateUser_Admin", updateUser);
router.post("/createUser_Admin", createUser );
router.delete("/deleteUser_Admin:id_user", deleteUser );
router.get("/getInfoForm_Admin", getInfoForm);
router.delete("/eliminateTribu_Admin", deleteTribu );
router.post("/createTribu_Admin", createTribu );
router.delete("/eliminateSquad_Admin", deleteSquad);
router.post("/createSquad_Admin", createSquad );
router.delete("/eliminateVpSponsor_Admin", deleteSponsor);
router.post("/createVpSponsor_Admin", createSponsor );
router.post("/updateSalary_Admin", updateSalary );
router.post("/updateMinimumCuttingQuantity_Admin", updateMinimumCuttingQuantity );
router.post("/updateVicepresidentBackup_Admin", updateVicepresidentBackup );
router.delete("/eliminateVicepresidentAprover_Admin", deleteVicepresidentAprover);4
router.post("/createVicepresidentAprover_Admin", createVicepresidentAprover );
router.post("/updateStatusDraft_Admin", updateStatusDraft);
router.post("/updateStatusGerentesDraft_Admin", updateStatusGerentesDraft);
router.post("/eliminateStatusGerentesDraft_Admin", deleteStatusGerentesDraft);
router.post("/updateStatusVicepresidentDraft_Admin", updateStatusVicepresidentDraft);//FALTYA
router.post("/eliminateStatusVicepresidentDraft_Admin", deleteStatusVicepresidentDraft);//FALTYA



module.exports = router;