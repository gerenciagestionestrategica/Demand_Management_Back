const jwt = require("jsonwebtoken");
const axios = require("axios")
const {db, bucket} = require('../firebase')
const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;

const gerenteModel = {
  

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
          throw new Error("INVALID_DRAFT_ID");
        }

        
        const docRef = db.collection("draft").doc(documentId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
          throw new Error("DRAFT_NOT_FOUND")
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

        
        let allGerentesAcept = "Ajustes pendientes";

        const gerentes = Array.isArray(infoDraft.aprobacionGerentes)
          ? [...infoDraft.aprobacionGerentes]
          : [];
  
        const gerenteIndex = gerentes.findIndex((g) => g.correo === decoded.email);

        if (gerenteIndex !== -1) {
          gerentes[gerenteIndex].estado = "Pendiente de ajustes";
        } 

              
        if (gerentes.some((g) => g.estado === "En revisión")) {
          allGerentesAcept = "Not Send messages";
        }

        const updateData = {
          comentarios: admin.firestore.FieldValue.arrayUnion(newComment),
          aprobacionGerentes: gerentes,
        };

              
        if (allGerentesAcept === "Ajustes pendientes") {
          updateData.estado = "Pendiente de ajustes";
          updateData.estadoAjustesPendientes = "Gerentes";
        }

        const dataUpdate = await docRef.update(updateData);

              
        if (allGerentesAcept === "Ajustes pendientes") {


          
          const n8nWebhookUrl = process.env.API_KEY_N8N;
          
          const userMetodosRef = await db.collection("users").where("role", "==", "Metodos").get();
          const userMetodos = userMetodosRef.docs.map(doc => doc.data());

          const gmailRecipient =[...gerentes,{correo: infoDraft.correo},...userMetodos]

          try{
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
                  "motivo": "Ajustes Gerentes",
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
        
        

      
    },


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
          throw new Error("DRAFT_NOT_FOUND");
      }

      const dataDraft = await draftSnapshot.data();

      let allGerentesAcept = "Aceptado por todos";

      const gerentes = Array.isArray(dataDraft.aprobacionGerentes)
      ? [...dataDraft.aprobacionGerentes]
      : [];

            

      const indexGerente = gerentes.findIndex(g => g.correo === decoded.email);    
      gerentes[indexGerente].estado = "Aprobado";

      if (gerentes.some((g) => g.estado === "En revisión")) {
        allGerentesAcept = "Not Send messages";
      }else if ( gerentes.some((g)=>g.estado === "Pendiente de ajustes")){
        allGerentesAcept = "Pendiente de ajustes";
      }

      const updateData = {
        aprobacionGerentes: gerentes
      };

        
      if (allGerentesAcept === "Aceptado por todos"){

        const salarySnap = await db.collection("salario").limit(1).get();
        const salary = salarySnap.docs[0].data();
        const countMin = salary.salario * salary.monto_corte;

        let textoLimpio = dataDraft.presupuesto.replaceAll(".", "");
        let presupuesto = Number(textoLimpio);
              

        if (presupuesto <= countMin) {

          updateData.estado = "Aprobado";
          
          await draftRef.update(updateData);

          const snapshotUsers = await db
            .collection("users")
            .where("role", "in", ["Gerente", "Metodos", "Vicepresidente"])
            .get();

          const users = snapshotUsers.docs.map(doc => doc.data());

          const gmailRecipient = [{ correo: dataDraft.correo }, ...users];

          try{
            await axios.post(
              process.env.API_KEY_N8N,
              { recipients: gmailRecipient, info: dataDraft },
              {
                headers: {
                  "Content-Type": "application/json",
                  "API_KEY_N8N": process.env.SECRET_KEY_N8N,
                  "motivo": "aprobacion completa",
                  "id_radicado": id_draft
                }
              }
            );
          } catch (err) {
            if (err.code === "ECONNABORTED") throw new Error("N8N_TIMEOUT");
            if (err.response) throw new Error("N8N_ERROR");
            throw new Error("N8N_UNAVAILABLE");
          }

        } else {

          
          const vicepresidentesAprobadoresSnap = await db
            .collection("vicepresidencia_respaldo")
            .get();

          const vicepresidentesAprobadores =
            vicepresidentesAprobadoresSnap.docs.map(doc => doc.data());

          
          const snapshotVice = await db
            .collection("users")
            .where("role", "==", "Vicepresidente")
            .get();

          const vicepresidentes = snapshotVice.docs.map(doc => doc.data());

          // Validar si la vicepresidencia sponsor es aprobadora
          const existeVicepresidenteAprobador = vicepresidentesAprobadores.some(
            vp => vp.vicepresidencia === dataDraft.vp_sponsor
          );

          let vicepresidentesDestino = [];

          // CASO 1: la vicepresidencia sponsor SÍ es aprobadora
          if (existeVicepresidenteAprobador) {

            vicepresidentesDestino = vicepresidentes
              .filter(vp => vp.vicepresidencia !== dataDraft.vp_sponsor)
              .map(vp => ({
                ...vp,
                estado: "En revisión"
              }));

          } 
          // CASO 2: NO es aprobadora → excluir vicepresidencia de respaldo
          else {

            const viceRespaldoSnap = await db
              .collection("vicepresidencia_respaldo")
              .limit(1)
              .get();

            const viceRespaldo = viceRespaldoSnap.docs[0].data();

            vicepresidentesDestino = vicepresidentes
              .filter(vp => vp.vicepresidencia !== viceRespaldo.vicepresidencia)
              .map(vp => ({
                ...vp,
                estado: "En revisión"
              }));
          }

          updateData.estado = "En revisión";
          updateData.aprobacionVices = vicepresidentesDestino;

          
          await draftRef.update(updateData);

        
          const snapshotUsers = await db
            .collection("users")
            .where("role", "in", ["Gerente", "Metodos"])
            .get();

          const users = snapshotUsers.docs.map(doc => doc.data());

          const infoGmailMessages = [
            { correo: dataDraft.correo, role: "Radicador" },
            ...users,
            ...vicepresidentesDestino
          ];

          try{
            await axios.post(
              process.env.API_KEY_N8N,
              {
                recipients: infoGmailMessages,
                info: dataDraft
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "API_KEY_N8N": process.env.SECRET_KEY_N8N,
                  "motivo": "Vicepresidentes",
                  "id_radicado": id_draft
                }
              }
            );

          } catch (err) {
            if (err.code === "ECONNABORTED") throw new Error("N8N_TIMEOUT");
            if (err.response) throw new Error("N8N_ERROR");
            throw new Error("N8N_UNAVAILABLE");
          }
        }

      }else if( allGerentesAcept === "Pendiente de ajustes"){


        updateData.estado = "Pendiente de ajustes";
        updateData.estadoAjustesPendientes = "Gerentes";

        const draft =await draftRef.update(updateData);

        const n8nWebhookUrl = process.env.API_KEY_N8N;

        

        const userMetodosRef = await db.collection("users").where("role", "==", "Metodos").get();
        const userMetodos = userMetodosRef.docs.map(doc => doc.data());

        const gmailRecipient =[...gerentes,{correo: dataDraft.correo},...userMetodos];

        try{

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
                "motivo": "Ajustes Gerentes",
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
        await draftRef.update(updateData);
      }
           
      return draftSnapshot.data();
         
    }

}

module.exports = gerenteModel;
