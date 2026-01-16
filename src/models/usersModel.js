const {db} = require('../firebase')
const multer = require('multer');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");


const usersModel = {

  
  async getAllDrafts(req, res) {
  
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

    let snapshot;
    snapshot = await db.collection("draft").orderBy('createdAt').get()
    
    
    const drafts = snapshot.docs.map(doc => ({ 
        id: doc.id,
        ...doc.data() 
    }));

    
    return drafts;

    
  },

  
   async validateLogin(req, res) {
      
      const { credential } = req.body; 
      if (!credential) {
        throw new Error("TOKEN_MISSING");
      }
    
      
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      
      const payload = ticket.getPayload();
    
      if (!payload?.email_verified) {
        throw new Error("EMAIL_NOT_VERIFIED");
      }

      console.log(4444)

      const email = payload.email;
      const snapshot = await db.collection("users").where("correo", "==", email).get();
     
      if (snapshot.empty) {
        throw new Error("USER_NOT_ALLOWED");
      }

      

      
      const userDoc = snapshot.docs[0].data();
      const role = userDoc.role || "user";

      console.log(555656)
      
      const sessionToken = jwt.sign(
        { email: payload.email, name: payload.name, role },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );

      
      res.cookie("session", sessionToken, {
        httpOnly: true,
        secure: true, 
        sameSite: "none", 
        path: "/",
        maxAge: 86400000,
      });

      return { name: payload.name, email: payload.email, role }
      

    
  },


  async checkSession(req, res) {
    
    const token = req.cookies.session;
     
    if (!token) {
      throw new Error("TOKEN_MISSING");
    }

    try {
      
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      
       res.status(200).json({ authenticated: true, user: { email: payload.email, name: payload.name, role: payload.role } });
      
    } catch {
      throw new Error("INVALID_TOKEN");
    }

   
  },


  async logout(req, res) {

    try {
      Object.keys(req.cookies).forEach(cookieName => {
        res.clearCookie(cookieName, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"
          });
        });


      
    return res.redirect("https://accounts.google.com/logout");

    } catch(err) {
      
      throw new Error("ERROR_LOGOUT_SESSION");
    }
  },

  
  async getRadicadoByIdDetails(req, res) {
    
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


      const data = req.body;

      if (!data.id_draft || typeof data.id_draft !== 'string' || data.id_draft.trim() === '') {
        throw new Error("INVALID_DRAFT_ID");
      }

      const snapshot = await db.collection('draft').doc(data.id_draft).get();
      const snapshot2 = await db.collection('history').where("id", "==", data.id_draft).get();

      if (!snapshot.exists) {
        throw new Error("DRAFT_NOT_FOUND");
      }

      const draftData = snapshot.data();
      const historyChangesData = snapshot2.docs.map(doc => doc.data());

      
      if (decoded.role === "Radicador") {
        if (draftData.correo !== decoded.email) {
          throw new Error("USER_NOT_ALLOWED");
        }
      }

      draftData["id"] = snapshot.id;

      return {
        id: snapshot.id,
        data: draftData,
        history: historyChangesData
      };

  }

};

module.exports = usersModel;
