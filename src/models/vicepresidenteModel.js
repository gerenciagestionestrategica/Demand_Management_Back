const jwt = require("jsonwebtoken");
const axios = require("axios")
const {db, bucket} = require('../firebase')
const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;

const vicepresidenteModel = {
    
    
    async updateStatusDraftAcept(req, res) {

      const token = req.cookies.session;

      if (!token) {
        throw new Error("TOKEN_MISSING");
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
      } catch (err) {
        if (
          err.name === "JsonWebTokenError" ||
          err.name === "TokenExpiredError"
        ) {
          throw new Error("INVALID_TOKEN");
        }
        throw err;
      }

      const { id_draft } = req.body;

      if (!id_draft) {
        throw new Error("INVALID_DRAFT_ID");
      }

      
          
      const draftRef = db.collection("draft").doc(id_draft);
      const draftSnapshot = await draftRef.get(); 

      if (!draftSnapshot.exists) {
        throw new Error("DRAFT_NOT_FOUND");
      }

      const dataDraft = await draftSnapshot.data();

      let allVicepresidentesAcept = "Aceptado por todos";

      const vicepresidentes = Array.isArray(dataDraft.aprobacionVices)
        ? [...dataDraft.aprobacionVices]
        : [];

          

      const indexGerente = vicepresidentes.findIndex(g => g.correo === decoded.email);
      
      if(indexGerente !== -1){
        vicepresidentes[indexGerente].estado = "Aprobado";
      }else{
        throw new Error("NO_FIND_VICEPRESIDENTE");
      }
      

      if (vicepresidentes.some((g) => g.estado === "En revisión")) {
        allVicepresidentesAcept = "Not Send messages";
      }else if ( vicepresidentes.some((g)=>g.estado === "Pendiente de ajustes")){
        allVicepresidentesAcept = "Pendiente de ajustes";
      }

      const updateData = {
        aprobacionVices: vicepresidentes
      };

      if (allVicepresidentesAcept === "Aceptado por todos"){
                
        updateData.estado = "Aprobado";
        await draftRef.update(updateData);

        
                
        const usersRef = await db.collection('users').where("role","in",["Metodos","Gerente"]).get();
        const users = usersRef.docs.map(doc => doc.data());
        const gmailRecipient =[...vicepresidentes,{correo: dataDraft.correo},...users]
        try{  

          const n8nWebhookUrl = process.env.API_KEY_N8N;
          await axios.post(
            n8nWebhookUrl,
              {recipients:gmailRecipient,
                info: dataDraft
              }
              ,
              {
                headers: {
                        "Content-Type": "application/json",
                        "API_KEY_N8N": process.env.SECRET_KEY_N8N,
                        "motivo": "Aceptacion Vicepresidentes",
                        "id_radicado":id_draft
                        },
                }
          );

        } catch (err) {
          if (err.code === "ECONNABORTED") throw new Error("N8N_TIMEOUT");
          if (err.response) throw new Error("N8N_ERROR");
          throw new Error("N8N_UNAVAILABLE");
        }

      }else if( allVicepresidentesAcept === "Pendiente de ajustes"){


          updateData.estado = "Pendiente de ajustes";
          updateData.estadoAjustesPendientes = "Vicepresidentes";

          await draftRef.update(updateData);

          const usersRef = await db.collection("users").where("role", "in", ["Metodos","Gerente"]).get();
          const users = usersRef.docs.map(doc => doc.data());

          const gmailRecipient =[... vicepresidentes,{correo: dataDraft.correo,  role:'Radicador'},...users]
          
          try{
            const n8nWebhookUrl = process.env.API_KEY_N8N;

            await axios.post(
              n8nWebhookUrl,
              {recipients:gmailRecipient,
              info: dataDraft
              }
              ,
              {
                headers: {
                      "Content-Type": "application/json",
                      "API_KEY_N8N": process.env.SECRET_KEY_N8N,
                      "motivo": "Ajustes Vicepresidentes",
                      "id_radicado": id_draft
                },
              }
            );

          } catch (err) {
            if (err.code === "ECONNABORTED") throw new Error("N8N_TIMEOUT");
            if (err.response) throw new Error("N8N_ERROR");
            throw new Error("N8N_UNAVAILABLE");
          }

      }else{
        await draftRef.update({
          aprobacionVices:vicepresidentes,
        });
      }

      return dataDraft;
    },


    async createRequestAdjustment(req, res) {
        
      const token = req.cookies.session;

      if (!token) {
        throw new Error("TOKEN_MISSING");
      }

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.SECRET_KEY);
      } catch (err) {
        if (
          err.name === "JsonWebTokenError" ||
          err.name === "TokenExpiredError"
        ) {
          throw new Error("INVALID_TOKEN");
        }
        throw err;
      }

      
      const { documentId, inf } = req.body;
      if (!documentId || !inf) {
        throw new Error("INVALID_DRAFT_ID");
      }

      
      const docRef = db.collection("draft").doc(documentId);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        throw new Error("DRAFT_NOT_FOUND");
      }

      const infoDraft = docSnap.data();

      
      const newComment = {
        userId: decoded.name,
        gmailSender: decoded.email,
        gmailRecipient: infoDraft.correo,
        tipoSolicitud: inf.tipoSolicitud,
        comentarioAjuste: inf.comentariosAjuste,
        fecha: new Date(),
      };


      let allVicepresidentesAcept = "Ajustes pendientes";

      const Vicepresidentes = Array.isArray(infoDraft.aprobacionVices)
              ? [...infoDraft.aprobacionVices]
              : [];
  
      const vicepresidenteIndex= Vicepresidentes.findIndex((g) => g.correo === decoded.email);

      if (vicepresidenteIndex !== -1) {
        Vicepresidentes[vicepresidenteIndex].estado = "Pendiente de ajustes";
      } else {
        throw new Error("NO_FIND_VICEPRESIDENTE");
      }

            
      if (Vicepresidentes.some((g) => g.estado === "En revisión")) {
        allVicepresidentesAcept = "Not Send messages";
      }

      const updateData = {
        comentarios: admin.firestore.FieldValue.arrayUnion(newComment),
        aprobacionVices: Vicepresidentes,
      };

            
      if (allVicepresidentesAcept === "Ajustes pendientes") {
        updateData.estado = "Pendiente de ajustes";
        updateData.estadoAjustesPendientes = "Vicepresidentes";
      }

       await docRef.update(updateData);

              
      if (allVicepresidentesAcept === "Ajustes pendientes") {
       
        const usersRef = await db.collection("users").where("role", "in", ["Metodos", "Gerente"]).get();
        const users = usersRef.docs.map(doc => doc.data());

        const gmailRecipient =[...Vicepresidentes,{correo: infoDraft.correo, role:'Radicador'},...users]

        try{

          const n8nWebhookUrl = process.env.API_KEY_N8N;
          await axios.post(
            n8nWebhookUrl,
            {recipients:gmailRecipient,
              info: infoDraft
            }
            ,

            {
              headers: {
                      "Content-Type": "application/json",
                      "API_KEY_N8N": process.env.SECRET_KEY_N8N,
                      "motivo": "Ajustes Vicepresidentes",
                      "id_radicado": documentId
              },
            }
          );

        } catch (err) {
          if (err.code === "ECONNABORTED") throw new Error("N8N_TIMEOUT");
          if (err.response) throw new Error("N8N_ERROR");
          throw new Error("N8N_UNAVAILABLE");
        }
      }

      return {id: documentId };

    }

}

module.exports = vicepresidenteModel;