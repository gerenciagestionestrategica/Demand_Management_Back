// src/models/bookModel.js
const {db, bucket} = require('../firebase')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require("fs/promises");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require("jsonwebtoken");

const {model, fileManager } = require('../ia_model')



const login = {

  async verificateRol(req, res) {
     
    const token = req.cookies.session;
    

  
    if (!token) {
      
      return res.status(401).json({
        authenticated: false,
        message: "No session token provided."
      });
    }

    let decoded; 

    try {
      
      decoded = jwt.verify(token, process.env.SECRET_KEY);

    } catch (error) {

      return res.status(401).json({
        success: false,
        message: "Invalid or expired token."
      });
    }

    if (decoded.role === 'Radicador') {
      
      return res.json({
        rol: true
      });
    } else {
      
      return res.status(403).json({
        rol: false,
        message: `Access denied. Required a specific role , but  no found .`
      });
    }
  },

  async logout(req, res) {
    try {
    Object.keys(req.cookies).forEach(cookieName => {
      res.clearCookie(cookieName, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/"
        });
      });


      
    return res.json({ success: true, message: "Sesión cerrada" });
    } catch(err) {
      console.error('Error cerrando sesión:', err);
      return res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    }
  },

  async checkSession(req, res) {
    
    const token = req.cookies.session;
     
   
    if (!token) return res.status(401).json({ authenticated: false });
    
    try {
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      
      
      res.json({ authenticated: true, user: { email: payload.email, name: payload.name, role: payload.role } });
    } catch(err) {
      res.status(401).json({ authenticated: false });
    }
  },

  async validateLogin(req, res) {
    try {
      const { credential } = req.body; // token de Google
      if (!credential) {
        return res.status(400).json({ success: false, message: "Token no proporcionado" });
      }
    
      
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
    
      if (!payload?.email_verified) {
        return res.status(401).json({ success: false, message: "Correo no verificado" });
      }

      const email = payload.email;

      
      const snapshot = await db.collection("users").where("correo", "==", email).get();
      if (snapshot.empty) {
        return res.status(403).json({
          success: false,
          message: "Usuario no autorizado o no registrado en Firestore"
        });
      }

      
      const userDoc = snapshot.docs[0].data();

    
      const role = userDoc.role || "user";

      // Generación del JWT
      const sessionToken = jwt.sign(
        { email: payload.email, name: payload.name, role },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );

      // Guardar cookie
      res.cookie("session", sessionToken, {
        httpOnly: true,
        secure: true, // true in production, false in development
        sameSite: "none", // use "none" for cross-domain, "lax" for same-domain
        path: "/",
        maxAge: 86400000, // 24h
      });

      return res.json({
        success: true,
        message: "Login exitoso",
        user: { name: payload.name, email: payload.email, role },
      });

    } catch (err) {
      console.error("Error validando token de Google:", err);
      return res.status(401).json({
        success: false,
        message: "Token inválido o expirado",
      });
    }
  }


};

module.exports = login;
