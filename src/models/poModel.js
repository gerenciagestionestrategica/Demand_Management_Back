// src/models/bookModel.js
const {db, bucket} = require('../firebase')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require("fs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const FormData = require("form-data");


const poModel = {

  
  async getRadicadosByUser(req, res) {

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
    

    const snapshot = await db
      .collection("draft")
      .where("correo", "==", decoded.email)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  
},


  async getAnswerIa(req, res) {

    let filePath = null;

     
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

    
    if (!req.file) {
      throw new Error("NOT_FILE");
    }

    filePath = req.file.path;
    const fileName = req.file.originalname;
    const n8nWebhookUrl = process.env.API_KEY_N8N_IA;



    if (!fs.existsSync(filePath)) {
      throw new Error("FILE_NOT FIND");
    }

    const businessField = req.body.business || "{}";

    
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), { filename: fileName });
    form.append("name", fileName);
    form.append("business", businessField);

    try{
      const response = await axios.post(n8nWebhookUrl, form, {
        headers: {
          ...form.getHeaders(),
          'API_KEY_N8N': process.env.SECRET_KEY_N8N 
        },
        timeout: 300000 
      });

      return  response.data ;
  


    } catch (err) {

      if (err.code === "ECONNABORTED") {
        throw new Error("N8N_TIMEOUT");
      }

      if (err.response) {
        throw new Error("N8N_ERROR");
      }

      throw new Error("N8N_UNAVAILABLE");

    } finally {

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

    }
    
  },


  async getRadicadoByIdAjustes(req, res) {
   
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

      if (decoded.role !== "Radicador") {
        throw new Error("USER_NOT_ALLOWED");
      }
       
      
      
      const { id_radicado } = req.params;

      

      if (!id_radicado || typeof id_radicado !== 'string' || id_radicado.trim() === '') {
        throw new Error("INVALID_DRAFT_ID");
      }

    
      const snapshot = await db.collection('draft').doc(id_radicado).get();

      if (!snapshot.exists) {
        throw new Error("DRAFT_NOT_FOUND");
        
      }

      const data = snapshot.data();

      if (data.correo !== decoded.email) {
        throw new Error("USER_NOT_ALLOWED");
      }

      const estadosPermitidos = ["GD", "Gerentes", "Vicepresidentes"];
      const estadoAjustesPendientes = data.estadoAjustesPendientes || "";
      
      const puedeEditar = 
        estadosPermitidos.includes(estadoAjustesPendientes) &&
        data.estado === "Pendiente de ajustes";

      if (!puedeEditar) {
        throw new Error("NOT_ALLOWED_EDIT");
      }

      return { id_radicado, data };

    
  },


  async createDraft(req, res) {
   
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

      const email = decoded.email;
      const formData = req.body;

      if(!formData){
        throw new Error("DATA_FORM_MISSING");
      }

      const filesData = req.files;

      let uploadedFiles = [];
      
      const draftRef = db.collection("draft");

      const initialDraftData = {
            nombre_proyecto: formData.step1.name_project,
            correo: email,
            po: formData.step1.po,
            pot: formData.step1.pot,
            vp_sponsor: formData.step1.vp_sponsor,
            lider_negocio: formData.step1.lider_negocio,
            tribu: formData.step1.tribu,
            squad: formData.step1.squad,
            aliados_q1: formData.step2.aliados_q1,
            aliados_q2: formData.step2.aliados_q2,
            aliados_q3: formData.step2.aliados_q3,
            actividades_q1: formData.step2.actividades_q1,
            actividades_q2: formData.step2.actividades_q2,
            propuesta_q1: formData.step2.propuesta_q1,
            propuesta_q2: formData.step2.propuesta_q2,
            propuesta_q3: formData.step2.propuesta_q3,
            relacion_q1: formData.step2.relacion_q1,
            relacion_q2: formData.step2.relacion_q2,
            recursos_q1: formData.step2.recursos_q1,
            canales_q1: formData.step2.canales_q1,
            canales_q2: formData.step2.canales_q2,
            segmentos_q1: formData.step2.segmentos_q1,
            segmentos_q2: formData.step2.segmentos_q2,
            segmentos_q3: formData.step2.segmentos_q3,
            gastos_q1: formData.step2.gastos_q1,
            gastos_q2: formData.step2.gastos_q2,
            gastos_q3: formData.step2.gastos_q3,
            ingreso_q1: formData.step2.ingreso_q1,
            ingreso_q2: formData.step2.ingreso_q2,
            ingreso_q3: formData.step2.ingreso_q3,
        estado: "Radicado",
        estadoAjustesPendientes: "Desactivado",
        archivosAdjuntos: [],
        aprobacionGD: [],
        aprobacionGerentes: [],
        aprobacionVices: [],
        comentarios: [],
        createdAt: new Date(),
        alcance: formData.step1.alcance,
        situacion_resolver: formData.step1.situacion_resolver,
        start_date: formData.step2.start_date,
        end_date: formData.step2.end_date,
        presupuesto: formData.step2.presupuesto,
        cantidad_dias: formData.step2.cantidad_dias
      };

      const newDocRef = await draftRef.add(initialDraftData);

      const id_radicado = newDocRef.id;

      const keys = filesData ? Object.keys(filesData) : [];

      if (keys.length > 0) {

        let uploadPromises = keys.map(async (key) => {
          const fileInfo = filesData[key][0]; 
          const destinationPath = `${id_radicado}/${fileInfo.fieldname}/${fileInfo.originalname}`;

          const [file] = await bucket.upload(fileInfo.path, {
            destination: destinationPath,
            metadata: {
              contentType: fileInfo.mimetype,
            },
          });

          const [fileUrl] = await file.getSignedUrl({ 
            action: 'read',
            expires: '03-09-2491', 
          });

          return {
            nombreOriginal: fileInfo.originalname,
            nombreCampo: fileInfo.fieldname,
            rutaBucket: file.name,
            urlDescarga: fileUrl
          };
        });

        uploadedFiles = await Promise.all(uploadPromises);
        await newDocRef.update({
          archivosAdjuntos: uploadedFiles
        });
      }

      
      await Promise.all(
        keys.map(async (key) => {
          const fileInfo = filesData[key][0];
          if (fs.existsSync(fileInfo.path)) {
            await fs.promises.unlink(fileInfo.path);
          }
        })
      );


      try {

        const docSnapshot = await newDocRef.get();
        const dataDraft = docSnapshot.data();

        const usersRef = await db.collection("users")
          .where("role", "==", "Metodos")
          .get();

        const whoSend = usersRef.docs.map(doc => ({ correo: doc.data().correo }));
        whoSend.push({ correo: email });

        const dataToSend = {
          id_radicado,
          whosend: whoSend,
          ...dataDraft,
          createdAt: dataDraft.createdAt.toDate?.().toISOString() ?? dataDraft.createdAt,
        };


        await axios.post(process.env.API_KEY_N8N, dataToSend, {
          headers: {
            "Content-Type": "application/json",
            "API_KEY_N8N": process.env.SECRET_KEY_N8N,
            motivo: "Creacion",
          },
          timeout: 30000,
        });

        
        return docSnapshot.id;

      } catch (err) {
        if (err.code === "ECONNABORTED") throw new Error("N8N_TIMEOUT");
        if (err.response) throw new Error("N8N_ERROR");
        throw new Error("N8N_UNAVAILABLE");
      }

  },


  async UpdateRadicadoById(req, res) {
    
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

      const { id_radicado } = req.params;

      if (!id_radicado || typeof id_radicado !== 'string' || id_radicado.trim() === '') {
        throw new Error("INVALID_DRAFT_ID");
      }

      const formData = req.body;
      const filesData = req.files || {};

      const docRef = db.collection("draft").doc(id_radicado);
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
         throw new Error("DRAFT_NOT_FOUND");
      }

      const infoDataCurrently = docSnap.data();
      const email = decoded.email;

      if (!formData || Object.keys(formData).length === 0) {
        throw new Error("DATA_FORM_MISSING");
      }


      if (infoDataCurrently.correo !== email) {
        throw new Error("USER_NOT_ALLOWED");
      }

      
      let cambios = [];
      const time = new Date();
      let updates = {};

      Object.keys(formData).forEach(key => {
        Object.keys(formData[key]).forEach( keySec => {
          if (infoDataCurrently.hasOwnProperty(keySec)) {
            if (infoDataCurrently[keySec] != formData[key][keySec]) {
              let paso = key === "step1" ? "Información general" : "Business Model Canvas";

              cambios.push({
                id: id_radicado,
                time,
                cambio: formData[key][keySec],
                antiguo: infoDataCurrently[keySec],
                paso
              });

              updates[keySec] = formData[key][keySec];
              
            }
          }
        });
      });

      updates.estadoAjustesPendientes = "Desactivado";
      

      if(Object.keys(updates).length > 0){

        if(infoDataCurrently.estadoAjustesPendientes == "Gerentes"){
          updates.estado = "En revisión";

          const gerentes = Array.isArray(infoDataCurrently.aprobacionGerentes)
          ? [... infoDataCurrently.aprobacionGerentes]
          : [];

          gerentes.forEach( gerente =>{
              
            if(gerente.estado === "Pendiente de ajustes")
              gerente.estado = "En revisión"
          });

          updates.aprobacionGerentes = gerentes;

        }else if ((infoDataCurrently.estadoAjustesPendientes == "Vicepresidentes")){
         
          updates.estado = "En revisión";

          const vicepresidentes = Array.isArray(infoDataCurrently.aprobacionVices)
          ? [... infoDataCurrently.aprobacionVices]
          : [];

          vicepresidentes.forEach( vicepresidente =>{
              
            if(vicepresidente.estado === "Pendiente de ajustes")
              vicepresidente.estado = "En revisión"
          });

          updates.aprobacionVices = vicepresidentes;

        }else{
          updates.estado = "Radicado";
        }
      
        await docRef.update(updates)
      }
      

      
      const keys = filesData ? Object.keys(filesData) : [];
      let uploadedFiles = [];

      if (keys.length > 0) {
        const uploadPromises = keys.map(async (key) => {
          const fileInfo = filesData[key][0];
          const destinationPath = `${id_radicado}/${fileInfo.fieldname}/${fileInfo.originalname}`;

          const [file] = await bucket.upload(fileInfo.path, {
            destination: destinationPath,
            metadata: { contentType: fileInfo.mimetype },
          });

          const fileUrl = await file.getSignedUrl({
            action: 'read',
            expires: '03-09-2491',
          });

          return {
            nombreOriginal: fileInfo.originalname,
            nombreCampo: fileInfo.fieldname,
            rutaBucket: file.name,
            urlDescarga: fileUrl[0]
          };
        });

        uploadedFiles = await Promise.all(uploadPromises);

        
        await Promise.all(
          keys.map(async (key) => {
            const fileInfo = filesData[key][0];
            if (fs.existsSync(fileInfo.path)) {
              await fs.promises.unlink(fileInfo.path);
            }
          })
        );
      }

      
      let archivosActuales = infoDataCurrently.archivosAdjuntos || [];

      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach(nuevo => {
          const index = archivosActuales.findIndex(a => a.nombreCampo === nuevo.nombreCampo);
          if (index !== -1) {
            cambios.push({
              id: id_radicado,
              time,
              cambio: nuevo.nombreOriginal,
              antiguo: archivosActuales[index].nombreOriginal,
              paso: valorPasoDocumentos(nuevo.nombreCampo)
            });

            archivosActuales[index] = nuevo;
          } else {
            archivosActuales.push(nuevo);
            cambios.push({
              id: id_radicado,
              time,
              cambio: nuevo.nombreOriginal,
              antiguo: "-",
              paso: valorPasoDocumentos(nuevo.nombreCampo)
            });
          }
        });
      }

    
      
      if (uploadedFiles.length > 0) {
        await docRef.update({
          archivosAdjuntos: archivosActuales
        });
      }

      const historyRef = db.collection("history");

     
      await Promise.all(
        cambios.map(cambio => historyRef.add(cambio))
      );

      const n8nWebhookUrl = process.env.API_KEY_N8N;
      
      let whoSend = []

       if(infoDataCurrently.estadoAjustesPendientes == "Gerentes"){
         whoSend = [{correo:decoded.email},{correo:infoDataCurrently.aprobacionGD[0].email},...infoDataCurrently.aprobacionGerentes]

       }else if (infoDataCurrently.estadoAjustesPendientes == "Vicepresidentes"){
        whoSend = [{correo:decoded.email},{correo:infoDataCurrently.aprobacionGD[0].email},...infoDataCurrently.aprobacionVices]

       }else{
         whoSend = [{correo:decoded.email},{correo:infoDataCurrently.aprobacionGD[0].email}]

       }

      try{
        const whoSendHeader = JSON.stringify(whoSend); 
      
        await axios.post(
          n8nWebhookUrl,
          cambios,
          {
            headers: {
              'Content-Type': 'application/json',
              'API_KEY_N8N': process.env.SECRET_KEY_N8N,
              'motivo':'Ajustes Completados',
              'whoSend':whoSendHeader,
              'id_radicado':id_radicado
            }
          }
        );

      } catch (err) {
        if (err.code === "ECONNABORTED") throw new Error("N8N_TIMEOUT");
        if (err.response) throw new Error("N8N_ERROR");
        throw new Error("N8N_UNAVAILABLE");
      }  

      return {
        id: id_radicado,
        updatedFields: Object.keys(updates)
      };
  }

};



function valorPasoDocumentos(nombreCampo) {
  return pasoDocumentos[nombreCampo] || "Documento";
}

const pasoDocumentos = {
  "step2[cumplimiento_normativo]": "Cumplimiento Normativo",
  "step2[finops]": "FinOps",
  "step2[juridica]": "Jurídica",
  "step2[seguridad_informacion]": "Seguridad información",
  "step2[riesgo]": "Riesgo",
  "step2[estimacion_detalle]": "Estimacion detalle",
  "step2[caso_negocio]": "Caso de negocio"
};



module.exports = poModel;
