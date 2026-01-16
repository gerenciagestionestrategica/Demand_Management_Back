const jwt = require("jsonwebtoken");
const axios = require("axios")
const {db, bucket} = require('../firebase')
const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;

const MetodosModel = {
    
    async updateStatusDraftAcept(req, res) {

      const token = req.cookies.session;

      if (!token) {
           throw new Error("TOKEN_MISSING")
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
        throw new Error("DRAFT_NOT_FOUND")
      }

      const dataDraft = await draftSnapshot.data();

         

      const gerentesSnapshot = await db.collection("users").where("role", "==", "Gerente").get();
      const gerentesData = gerentesSnapshot.docs.map(doc => ({...doc.data(),"estado":"En revisión"}));
          
            
      const gerentesyMetodosSnapshot = await db.collection("users").where("role", "in", ["Gerente", "Metodos"]).get();

      const correoSnapshot = await db.collection("users").where("correo", "==", dataDraft.correo).get();


      const infoGmailMessages = [...gerentesyMetodosSnapshot.docs.map(doc => doc.data()),
                                       ...correoSnapshot.docs.map(doc => doc.data())];
            

      await draftRef.update({
          estado: "En revisión", 
          aprobacionGD:[{name:decoded.name, email: decoded.email, estado:"Aprobado"}],
          aprobacionGerentes:gerentesData,
      });

      try{

        const n8nWebhookUrl = process.env.API_KEY_N8N;

        await axios.post(
              n8nWebhookUrl,
              {'recipients':infoGmailMessages,
              'infoDraft': dataDraft
              },
              {
              headers: {
                  'Content-Type': 'application/json',
                  'API_KEY_N8N': process.env.SECRET_KEY_N8N,
                  'motivo':'aprobacionGD',
                  'id_draft':id_draft
              }
              }
          );
          

      } catch (err) {
        if (err.code === "ECONNABORTED") throw new Error("N8N_TIMEOUT");
        if (err.response) throw new Error("N8N_ERROR");
        throw new Error("N8N_UNAVAILABLE");
      }
 
      return  draftSnapshot.data();

    },
 

    async createRequestAdjustment(req, res) {

        const token = req.cookies.session;

        if (!token) {
           throw new Error("TOKEN_MISSING")
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
          throw new Error("DATA_FORM_MISSING");
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

        
        await docRef.update({
            comentarios: admin.firestore.FieldValue.arrayUnion(newComment),
            estado: "Pendiente de ajustes",
            estadoAjustesPendientes: "GD",
            aprobacionGD: [{ name: decoded.name, email: decoded.email, estado: "En revisión" }],
        });


        try{
          const n8nWebhookUrl = process.env.API_KEY_N8N;
          const payload = { ...newComment, id: documentId };

          await axios.post(
            n8nWebhookUrl,
            payload,
            {
                headers: {
                "Content-Type": "application/json",
                "API_KEY_N8N": process.env.SECRET_KEY_N8N,
                "motivo": "Ajustes",
                },
            }
          );

        } catch (err) {
          if (err.code === "ECONNABORTED") throw new Error("N8N_TIMEOUT");
          if (err.response) throw new Error("N8N_ERROR");
          throw new Error("N8N_UNAVAILABLE");
        }
        
        return { ...newComment, id: documentId };

   
    }
}

module.exports = MetodosModel;