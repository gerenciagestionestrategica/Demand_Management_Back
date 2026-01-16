const jwt = require("jsonwebtoken");
const axios = require("axios")
const {db, bucket} = require('../firebase')
const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;

const administradorModel = {
    
    async getAllUsers(req, res) {
      
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

        
        const snapshot = await db.collection("users").where('role','in',['Radicador','Metodos','Gerente', 'Vicepresidente']).get();

        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));


        return users;
      
    },


    async updateUser(req, res) {

      const token = req.cookies.session;
      const infoUserUpdate = req.body;

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
      
      const id_radicado = infoUserUpdate.id;

      const newInfoUser ={
        name:infoUserUpdate.name,
        role:infoUserUpdate.role,
        correo:infoUserUpdate.correo,
        estado:infoUserUpdate.estado,
        vicepresidencia: infoUserUpdate.vicepresidencia
      }

      const userRef = db.collection("users").doc(id_radicado);

      await userRef.update(newInfoUser)

      return newInfoUser
      
    },


    async createUser(req, res) {

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

      const userData = req.body;

      const userRef = await db.collection('users');

      const newDocRef = await userRef.add(userData)

      try{

        const n8nWebhookUrl = process.env.API_KEY_N8N;
                        
        await axios.post(
          n8nWebhookUrl,
          userData
          ,

          {
            headers: {
                    "Content-Type": "application/json",
                    "API_KEY_N8N": process.env.SECRET_KEY_N8N,
                    "motivo": "Nuevo usuario"
            },
          }
        );

      } catch (err) {
        if (err.code === "ECONNABORTED") throw new Error("N8N_TIMEOUT");
        if (err.response) throw new Error("N8N_ERROR");
        throw new Error("N8N_UNAVAILABLE");
      }

      return newDocRef
      
    },

    
    async deleteUser(req, res) {

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

      const { id_user } = req.params;

      if (!id_user) {
        throw new Error("INVALID_DRAFT_ID");
      }

      const deleteUser=await db.collection('users').doc(id_user).delete();

      return deleteUser
      
    },


    async getInfoForm(req, res) {
    

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

      const tribusRef = await db.collection('tribu').get();
      const tribus = tribusRef.docs.map(doc => doc.data().name);

      const squadRef = await db.collection('squad').get();
      const squads = squadRef.docs.map(doc => doc.data().name);

      const vpSponsorRef = await db.collection('vp_sponsor').get(); 
      const vpSponsors = vpSponsorRef.docs.map(doc => doc.data().name);

      const salarioRef = await db.collection('salario').get();
      const salario = salarioRef.docs.map(doc => doc.data()); 

      const viceAproversRef = await db.collection('vicepresidencia_aprobadora').get();
      const viceAprovers = viceAproversRef.docs.map(doc =>  doc.data().vicepresidencia);

      const viceAproversBackupRef = await db.collection('vicepresidencia_respaldo').get();
      const viceAproversBackup = viceAproversBackupRef.docs.map(doc =>  doc.data().vicepresidencia);

       
      
      const OptionVicesAprovers = vpSponsors.filter(vp => !viceAprovers.includes(vp) && !viceAproversBackup.includes(vp));
      const OptionVicesAproversBackup = vpSponsors.filter(vp => (!viceAproversBackup.includes(vp) && !viceAprovers.includes(vp)));


      return {tribus, squads, vpSponsors, salario:salario[0].salario,  monto_corte: salario[0].monto_corte,viceAprovers, viceAproversBackup, OptionVicesAprovers, OptionVicesAproversBackup}
    
    },


    async createTribu(req, res) {

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

      const tribuData = req.body;

      const tribuRef = await db.collection('tribu');

      const newDocRef = await tribuRef.add(tribuData);

      return newDocRef

    },


    async deleteTribu(req, res) {
      
      const token = req.cookies.session;

      if (!token) {
        throw new Error("TOKEN_MISSING");
      }
      

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

      const { name } = req.body;

      if (!name) {
        throw new Error("INVALID_NAME_ID");
      }

      const snapshot = await db
        .collection('tribu')
        .where('name', '==', name)
        .get();

      if (snapshot.empty) {
        throw new Error("DATA_NOT_FOUND");
      }

      const batch = db.batch();

      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();

    },


    async createSquad(req, res) {

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

      const squadData = req.body;

      const squadRef = await db.collection('squad');

      const newDocRef = await squadRef.add(squadData)

      return newDocRef

    },


    async deleteSquad(req, res) {
       
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

      const { name } = req.body;

      

      if (!name) {
        throw new Error("INVALID_NAME_ID");
      }


      const snapshot = await db
        .collection('squad')
        .where('name', '==', name)
        .get();

      if (snapshot.empty) {
        throw new Error("DATA_NOT_FOUND");
      }

      const batch = db.batch();

      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    },


    async createSponsor(req, res) {

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

      const sponsorData = req.body;

      const sponsorRef = await db.collection('vp_sponsor');

      const newDocRef = await sponsorRef.add(sponsorData)

      return newDocRef
      
    },


    async deleteSponsor(req, res) {
       

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

      const { name } = req.body;

      

      if (!name) {
        throw new Error("INVALID_NAME_ID");
      }

     


      const snapshot = await db
        .collection('vp_sponsor')
        .where('name', '==', name)
        .get();

      if (snapshot.empty) {
        throw new Error("DATA_NOT_FOUND");
      }

      const batch = db.batch();

      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    },


    async updateSalary(req, res) {

      const token = req.cookies.session;
      const infoSalary = req.body;

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

    
      const salarioRef = await db.collection('salario').get();

      if (salarioRef.empty) {
        throw new Error("DATA_NOT_FOUND");
      }

       
      const salarios = salarioRef.docs.map(doc => ({
        id: doc.id,
        salario: doc.data().salario
      }));

      
      const salarioId = salarios[0].id;

      const docRef = db.collection('salario').doc(salarioId);

      
      await docRef.update(infoSalary);

    },


    async updateMinimumCuttingQuantity(req, res) {

      const token = req.cookies.session;
      const infoMinimumCutting = req.body;

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

    
      const salarioRef = await db.collection('salario').get();

      if (salarioRef.empty) {
        throw new Error("DATA_NOT_FOUND");
      }

      
      const salarios = salarioRef.docs.map(doc => ({
        id: doc.id,
        salario: doc.data().salario
      }));

      
      const salarioId = salarios[0].id;

      const docRef = db.collection('salario').doc(salarioId);

      
      await docRef.update(infoMinimumCutting);

    },
    

    async updateVicepresidentBackup(req, res) {

      const token = req.cookies.session;
      const infoViceBackup = req.body;

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

      const viceRef = await db.collection('vicepresidencia_respaldo').get();

      if (viceRef.empty) {
        throw new Error("DATA_NOT_FOUND");
      }

      const vicepresidencia_respaldo = viceRef.docs.map(doc => ({
        id: doc.id,
        vicepresidencia: doc.data().vicepresidencia
      }));

      
      const vicepresidenciaId = vicepresidencia_respaldo[0].id;

      const docRef = db.collection('vicepresidencia_respaldo').doc(vicepresidenciaId);

      await docRef.update(infoViceBackup);

    },


    async createVicepresidentAprover(req, res) {

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

      const vicepresidentAproverData = req.body;

      const vicepresidentAproverRef = await db.collection('vicepresidencia_aprobadora');

      const newDocRef = await vicepresidentAproverRef.add(vicepresidentAproverData)

      return newDocRef

    },


    async deleteVicepresidentAprover(req, res) {
       
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

      const { name } = req.body;

      

      if (!name) {
        throw new Error("INVALID_NAME_ID");
      }


      const snapshot = await db
        .collection('vicepresidencia_aprobadora')
        .where('vicepresidencia', '==', name)
        .get();

      if (snapshot.empty) {
        throw new Error("DATA_NOT_FOUND");
      }
      
      const batch = db.batch();

      snapshot.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    },


    async updateStatusDraft (req, res) {

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

      const { id_draft, statusUpdate } = req.body;
    

      if (!id_draft) {
        throw new Error("INVALID_ID");
      }

      const docRef = db.collection("draft").doc(id_draft);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
         throw new Error("DRAFT_NOT_FOUND");
      }

      const dataDraft = docSnap.data();

      if(statusUpdate == "En revisión"){

        const gerentesSnapshot = await db.collection("users").where("role", "==", "Gerente").get();
        const gerentesData = gerentesSnapshot.docs.map(doc => ({...doc.data(),"estado":"En revisión"}));
                            
        const gerentesyMetodosSnapshot = await db.collection("users").where("role", "in", ["Gerente", "Metodos"]).get();
        
        const correoSnapshot = await db.collection("users").where("correo", "==", dataDraft.correo).get();
        
        
        const infoGmailMessages = [...gerentesyMetodosSnapshot.docs.map(doc => doc.data()),
                                               ...correoSnapshot.docs.map(doc => doc.data())];
                    
        await docRef.update({
          estado:  statusUpdate,
          aprobacionGerentes:gerentesData,
          aprobacionVices:[],
          EstadoAjustesPendientes:"Desactivado"
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
        

      
      }else{

        await docRef.update({
          estado:  statusUpdate,
          aprobacionGD:[],
          aprobacionGerentes:[],
          aprobacionVices:[],
          EstadoAjustesPendientes:"Desactivado"
        });

      }  
    },


    async updateStatusGerentesDraft (req, res) {

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

      const { id_draft, correo, statusUpdate } = req.body;
     

      if (!id_draft) {
        throw new Error("INVALID_ID");
      }


      const draftRef = db.collection("draft").doc(id_draft);
      const docSnap = await draftRef.get();

      if (!docSnap.exists) {
         throw new Error("DRAFT_NOT_FOUND");
      }

      const draftData = docSnap.data();

   
      const gerentesAprovers = Array.isArray(draftData.aprobacionGerentes)
      ? [...draftData.aprobacionGerentes]
      : [];
      const indexGerente = gerentesAprovers.findIndex(g => g.correo === correo); 
      

      if ( indexGerente != 1){ 
        gerentesAprovers[indexGerente].estado = statusUpdate;
      }else{
         throw new Error("USER_NOT_FOUND");
      }
      
      let allGerentesAcept = "Aceptado por todos";

      if (gerentesAprovers.some((g) => g.estado === "En revisión")) {
          allGerentesAcept = "Not Send messages";
      }else if ( gerentesAprovers.some((g)=>g.estado === "Pendiente de ajustes")){
          allGerentesAcept = "Pendiente de ajustes";
      }

      const updateData = {
        aprobacionGerentes: gerentesAprovers
      };

      if (allGerentesAcept === "Aceptado por todos"){
      
        const salarySnap = await db.collection("salario").limit(1).get();
        const salary = salarySnap.docs[0].data();
        const countMin = salary.salario * salary.monto_corte;
      
        let textoLimpio = draftData.presupuesto.replaceAll(".", "");
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
        
            const vicepresidentAproversSnap = await db
            .collection("vicepresidencia_Aprobadora")
            .get();
      
            const vicepresidentAprovers = vicepresidentAproversSnap .docs.map(doc => doc.data());
      
                
            const snapshotVice = await db
                  .collection("users")
                  .where("role", "==", "Vicepresidente")
                  .get();
      
            const vicepresidents = snapshotVice.docs.map(doc => doc.data());
      
            // Validar si la vicepresidencia sponsor es aprobadora
            const existVicepresidentAprover =vicepresidentAprovers.some(
              vp => vp.vicepresidencia === draftData.vp_sponsor
            );
      
            let vicepresidentsRecipient = [];
      
            // CASO 1: la vicepresidencia sponsor SÍ es aprobadora
            if (existVicepresidentAprover) {
      
                  vicepresidentsRecipient = vicepresidents
                    .filter(vp => vp.vicepresidencia !== draftData.vp_sponsor)
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
      
                  vicepresidentsRecipient = vicepresidents
                    .filter(vp => vp.vicepresidencia !== viceRespaldo.vicepresidencia)
                    .map(vp => ({
                      ...vp,
                      estado: "En revisión"
                    }));
            }
      
            updateData.estado = "En revisión";
            updateData.aprobacionVices = vicepresidentsRecipient;
      
                
            await draftRef.update(updateData);
      
              
            const snapshotUsers = await db
              .collection("users")
              .where("role", "in", ["Gerente", "Metodos"])
              .get();
      
            const users = snapshotUsers.docs.map(doc => doc.data());
      
            const infoGmailMessages = [
              { correo: draftData.correo, role: "Radicador" },
              ...users,
              ...vicepresidentsRecipient
            ];
      
            try{
              await axios.post(
                process.env.API_KEY_N8N,
                {
                  recipients: infoGmailMessages,
                  info: draftData
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

        await draftRef.update(updateData);

        const n8nWebhookUrl = process.env.API_KEY_N8N;

    
        const userMetodosRef = await db.collection("users").where("role", "==", "Metodos").get();
        const userMetodos = userMetodosRef.docs.map(doc => doc.data());

        const gmailRecipient =[...gerentesAprovers,{correo: draftData.correo},...userMetodos];

        try{

          await axios.post(
          n8nWebhookUrl,
            {recipients:gmailRecipient,
              info: draftData
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

    

    },


    async deleteStatusGerentesDraft (req, res) {

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

      const { id_draft, correo } = req.body;
     

      if (!id_draft) {
        throw new Error("INVALID_ID");
      }


      const draftRef = db.collection("draft").doc(id_draft);
      const docSnap = await draftRef.get();

      if (!docSnap.exists) {
         throw new Error("DRAFT_NOT_FOUND");
      }

      const draftData = docSnap.data();

      
   
      const gerentesAprovers = Array.isArray(draftData.aprobacionGerentes)
      ? [...draftData.aprobacionGerentes]
      : [];
      const indexGerente = gerentesAprovers.findIndex(g => g.correo === correo); 
      
      if(gerentesAprovers.length == 1){
         throw new Error("NOT_ALLOWED_DELETE");
      }

      
      if ( indexGerente != -1){ 
        gerentesAprovers.splice(indexGerente,1);
      }else{
         throw new Error("USER_NOT_FOUND");
      }
      
      
      let allGerentesAcept = "Aceptado por todos";

      if (gerentesAprovers.some((g) => g.estado === "En revisión")) {
          allGerentesAcept = "Not Send messages";
      }else if ( gerentesAprovers.some((g)=>g.estado === "Pendiente de ajustes")){
          allGerentesAcept = "Pendiente de ajustes";
      }

     
      const updateData = {
        aprobacionGerentes: gerentesAprovers
      };

      if (allGerentesAcept === "Aceptado por todos"){
      
        const salarySnap = await db.collection("salario").limit(1).get();
        const salary = salarySnap.docs[0].data();
        const countMin = salary.salario * salary.monto_corte;
      
        let textoLimpio = draftData.presupuesto.replaceAll(".", "");
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
        
            const vicepresidentAproversSnap = await db
            .collection("vicepresidencia_Aprobadora")
            .get();
      
            const vicepresidentAprovers = vicepresidentAproversSnap .docs.map(doc => doc.data());
      
                
            const snapshotVice = await db
                  .collection("users")
                  .where("role", "==", "Vicepresidente")
                  .get();
      
            const vicepresidents = snapshotVice.docs.map(doc => doc.data());
      
            // Validar si la vicepresidencia sponsor es aprobadora
            const existVicepresidentAprover =vicepresidentAprovers.some(
              vp => vp.vicepresidencia === draftData.vp_sponsor
            );
      
            let vicepresidentsRecipient = [];
      
            // CASO 1: la vicepresidencia sponsor SÍ es aprobadora
            if (existVicepresidentAprover) {
      
                  vicepresidentsRecipient = vicepresidents
                    .filter(vp => vp.vicepresidencia !== draftData.vp_sponsor)
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
      
                  vicepresidentsRecipient = vicepresidents
                    .filter(vp => vp.vicepresidencia !== viceRespaldo.vicepresidencia)
                    .map(vp => ({
                      ...vp,
                      estado: "En revisión"
                    }));
            }
      
            updateData.estado = "En revisión";
            updateData.aprobacionVices = vicepresidentsRecipient;
      
                
            await draftRef.update(updateData);
      
              
            const snapshotUsers = await db
              .collection("users")
              .where("role", "in", ["Gerente", "Metodos"])
              .get();
      
            const users = snapshotUsers.docs.map(doc => doc.data());
      
            const infoGmailMessages = [
              { correo: draftData.correo, role: "Radicador" },
              ...users,
              ...vicepresidentsRecipient
            ];
      
            try{
              await axios.post(
                process.env.API_KEY_N8N,
                {
                  recipients: infoGmailMessages,
                  info: draftData
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

        await draftRef.update(updateData);

        const n8nWebhookUrl = process.env.API_KEY_N8N;

    
        const userMetodosRef = await db.collection("users").where("role", "==", "Metodos").get();
        const userMetodos = userMetodosRef.docs.map(doc => doc.data());

        const gmailRecipient =[...gerentesAprovers,{correo: draftData.correo},...userMetodos];

        try{

          await axios.post(
          n8nWebhookUrl,
            {recipients:gmailRecipient,
              info: draftData
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

    },


    async updateStatusVicepresidentDraft (req, res) {

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

      const { id_draft, correo, statusUpdate } = req.body;
     

      if (!id_draft) {
        throw new Error("INVALID_ID");
      }


      const draftRef = db.collection("draft").doc(id_draft);
      const docSnap = await draftRef.get();

      if (!docSnap.exists) {
         throw new Error("DRAFT_NOT_FOUND");
      }

      const dataDraft = docSnap.data();
      
      
      let allVicepresidentesAcept = "Aceptado por todos";
     
      const vicepresidentes = Array.isArray(dataDraft.aprobacionVices)
        ? [...dataDraft.aprobacionVices]
        : [];
     
      const indexGerente = vicepresidentes.findIndex(g => g.correo === correo);
           
      if(indexGerente !== -1){
        vicepresidentes[indexGerente].estado = statusUpdate;
      }else{
        throw new Error("USER_NOT_FOUND");
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
        await draftRef.update(updateData);
      }
     
      
    },


    async deleteStatusVicepresidentDraft (req, res) {

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

      const { id_draft, correo } = req.body;
     

      if (!id_draft) {
        throw new Error("INVALID_ID");
      }


      const draftRef = db.collection("draft").doc(id_draft);
      const docSnap = await draftRef.get();

      if (!docSnap.exists) {
         throw new Error("DRAFT_NOT_FOUND");
      }

      const draftData = docSnap.data();

      
   
      const vicepresidentAprovers = Array.isArray(draftData.aprobacionVices)
      ? [...draftData.aprobacionVices]
      : [];
      const indexVicepresident = vicepresidentAprovers.findIndex(g => g.correo === correo); 
      
      if(vicepresidentAprovers.length == 1){
         throw new Error("NOT_ALLOWED_DELETE");
      }

    
      if ( indexGerente != -1){ 
        vicepresidentAprovers.splice(indexVicepresident,1);
      }else{
         throw new Error("USER_NOT_FOUND");
      }
      
      let allVicepresidentesAcept = "Aceptado por todos";
      
      if (vicepresidentAprovers.some((g) => g.estado === "En revisión")) {
        allVicepresidentesAcept = "Not Send messages";
      }else if ( vicepresidentAprovers.some((g)=>g.estado === "Pendiente de ajustes")){
        allVicepresidentesAcept = "Pendiente de ajustes";
      }
     
      const updateData = {
        aprobacionVices: vicepresidentAprovers
      };
     
     
      if (allVicepresidentesAcept === "Aceptado por todos"){
                     
          updateData.estado = "Aprobado";
          await draftRef.update(updateData);
      
              
                      
          const usersRef = await db.collection('users').where("role","in",["Metodos","Gerente"]).get();
          const users = usersRef.docs.map(doc => doc.data());
          const gmailRecipient =[...vicepresidentAprovers,{correo: draftData.correo},...users]
          
          try{  
      
              const n8nWebhookUrl = process.env.API_KEY_N8N;
              await axios.post(
                n8nWebhookUrl,
                  {recipients:gmailRecipient,
                    info: draftData
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
     
            const gmailRecipient =[... vicepresidentAprovers,{correo: draftData.correo,  role:'Radicador'},...users]
               
            try{
                 const n8nWebhookUrl = process.env.API_KEY_N8N;
     
                 await axios.post(
                   n8nWebhookUrl,
                   {recipients:gmailRecipient,
                   info: draftData
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
        await draftRef.update(pdateData);
      }

    }

  }; 

module.exports = administradorModel;