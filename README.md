# Demand Management Backend

Sistema de gestión de demanda para la administración y aprobación de proyectos mediante un flujo de trabajo multi-nivel con roles de usuario.

**Autor:** Mateo Cante

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Roles y Permisos](#roles-y-permisos)
- [Flujo de Aprobación](#flujo-de-aprobación)
- [API Endpoints](#api-endpoints)
- [Ejecución](#ejecución)
- [Docker](#docker)
- [Variables de Entorno](#variables-de-entorno)
- [Base de Datos](#base-de-datos)
- [Autenticación](#autenticación)
- [Integraciones](#integraciones)

## 📝 Descripción

Backend para un sistema de gestión de demanda que permite a los usuarios crear y gestionar solicitudes de proyectos (radicados/borradores) a través de un proceso de aprobación estructurado. El sistema incluye análisis de documentos con IA, gestión de archivos, notificaciones y un flujo de trabajo que involucra múltiples niveles de aprobación según el rol del usuario.

El sistema está construido con Node.js y Express.js, utilizando Firebase (Firestore y Storage) como base de datos y almacenamiento, e integra Google Gemini AI para análisis de documentos y n8n para notificaciones por correo electrónico.

## ✨ Características

- 🔐 **Autenticación y Autorización**: Sistema de autenticación basado en JWT con gestión de sesiones mediante cookies HTTP-only
- 👥 **Múltiples Roles**: Soporte para diferentes roles de usuario (Product Owner/Radicador, Métodos, Gerente, Vicepresidente, Administrador)
- 📄 **Gestión de Borradores**: Creación, edición y seguimiento de radicados/borradores con estados de aprobación
- 🤖 **Análisis con IA**: Integración con Google Gemini para análisis automático de documentos
- 📎 **Gestión de Archivos**: Subida y almacenamiento de archivos adjuntos usando Firebase Storage
- 📊 **Flujo de Aprobación**: Sistema de aprobación multi-nivel con estados y transiciones controladas
- 🔔 **Notificaciones**: Integración con n8n para envío de notificaciones por correo electrónico
- 🏢 **Gestión Organizacional**: Administración de tribus, squads, sponsors y usuarios
- 💰 **Gestión Financiera**: Registro de presupuestos, estimaciones y análisis FinOps
- 🐳 **Containerización**: Soporte completo para Docker y Docker Compose

## 🛠 Tecnologías

### Core
- **Node.js 25+**: Entorno de ejecución JavaScript
- **Express.js 5.1.0**: Framework web para Node.js
- **Firebase Admin SDK 13.5.0**: Para Firestore y Storage
- **Firebase 12.2.1**: Cliente Firebase

### Base de Datos y Almacenamiento
- **Firebase Firestore**: Base de datos NoSQL en tiempo real
- **Firebase Storage**: Almacenamiento de archivos en la nube

### Autenticación y Seguridad
- **JWT (jsonwebtoken)**: Tokens de autenticación firmados
- **Cookie Parser**: Manejo de cookies HTTP-only para sesiones
- **CORS**: Control de acceso entre orígenes
- **Google OAuth2**: Autenticación con Google Sign-In



### Utilidades
- **Multer 2.0.2**: Middleware para manejo de carga de archivos multipart/form-data
- **Morgan 1.10.1**: Logger HTTP para desarrollo
- **Axios 1.12.2**: Cliente HTTP para integraciones externas
- **Dotenv 17.2.2**: Gestión de variables de entorno
- **UUID 13.0.0**: Generación de identificadores únicos
- **Form-data 4.0.4**: Manejo de formularios multipart
- **Body-parser 2.2.0**: Parser de cuerpo de peticiones HTTP

## 📦 Requisitos Previos

- **Node.js**: Versión 18 o superior (recomendado 25+)
- **npm**: Gestor de paquetes de Node.js
- **Cuenta de Firebase**: Con proyecto configurado y habilitado:
  - Firestore Database
  - Firebase Storage
  - Cuenta de servicio con credenciales JSON
- **Google Cloud**: 
  - API Key de Google Gemini AI
  - OAuth2 Client ID para Google Sign-In
- **n8n**: Para notificaciones por correo electrónico
- **Docker**: Para ejecución en contenedores

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Demand-management--Back
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp example.env .env
```

Edita el archivo `.env` con tus credenciales (ver sección [Variables de Entorno](#variables-de-entorno)).

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración del Servidor
PORT_BACK=3000
PORT_ACEPT=http://localhost

# Configuración de Auth02
GOOGLE_CLIENT_ID=id_cliengte aqui


# Firebase Configuration (desde archivo JSON de cuenta de servicio)
TYPE=service_account
PROJECT_ID=tu-project-id
PRIVATE_KEY_ID=tu-private-key-id
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
CLIENT_EMAIL=tu-client-email@project-id.iam.gserviceaccount.com
CLIENT_ID=tu-client-id
AUTH_URI=https://accounts.google.com/o/oauth2/auth
TOKEN_URI=https://oauth2.googleapis.com/token
AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
AUTH_X509_CERT_URL=tu-cert-url
UNIVERSE_DOMAIN=googleapis.com

# Firebase Storage
FIREBASE_BUCKET=tu-bucket-name.appspot.com


# JWT Secret Key (genera una clave segura y única)
SECRET_KEY=tu-secret-key-jwt-super-segura

# n8n Integration (opcional)
API_KEY_N8N=https://tu-n8n-webhook-url
SECRET_KEY_N8N=tu-n8n-secret-key
API_KEY_N8N_IA=https://tu-n8n-webhook-ia-url
```

**Nota importante**: 
- El `PRIVATE_KEY` debe mantener los caracteres `\n` literales en el archivo `.env`, ya que el código los reemplaza automáticamente
- Para producción, asegúrate de usar valores seguros y únicos
- Nunca commitees el archivo `.env` al repositorio

### Configuración de Firebase

1. **Crear proyecto en Firebase Console**
   - Ve a [Firebase Console](https://console.firebase.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente

2. **Configurar Firestore Database**
   - Habilita Firestore Database
   - Configura reglas de seguridad apropiadas
   - Crea las colecciones necesarias (se crearán automáticamente al usar la API)

3. **Configurar Firebase Storage**
   - Habilita Firebase Storage
   - Configura reglas de almacenamiento
   - Anota el nombre del bucket (formato: `tu-proyecto.appspot.com`)

4. **Generar cuenta de servicio**
   - Ve a Configuración del proyecto > Cuentas de servicio
   - Haz clic en "Generar nueva clave privada"
   - Descarga el archivo JSON
   - Copia los valores del JSON a las variables de entorno correspondientes



### Configuración de Google OAuth2

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea credenciales OAuth 2.0 Client ID
3. Configura las URLs de redirección autorizadas (Las URL que pueden acceder)
4. Copia el Client ID al archivo `.env` como `GOOGLE_CLIENT_ID`


## 📁 Estructura del Proyecto

```
Demand-management--Back/
├── src/
│   ├── app.js                    # Punto de entrada principal (inicia el servidor)
│   ├── Index.js                  # Configuración de Express (middlewares, rutas)
│   ├── config.js                 # Configuración general del proyecto
│   ├── firebase.js               # Configuración e inicialización de Firebase Admin
│   │
│   ├── controllers/              # Controladores (lógica de negocio y respuestas HTTP)
│   │   ├── administradorController.js
│   │   ├── gerenteController.js
│   │   ├── loginController.js
│   │   ├── metodosController.js
│   │   ├── pocontroller.js
│   │   ├── userscontroller.js
│   │   └── vicepresidenteController.js             
│   │
│   ├── models/                   # Modelos (acceso a datos y lógica de Firebase)
│   │   ├── administradorModel.js
│   │   ├── gerenteModel.js
│   │   ├── loginModel.js         # Autenticación, sesiones, verificación de roles
│   │   ├── metodosModel.js
│   │   ├── poModel.js            # Modelos para Product Owner/Radicador
│   │   ├── usersModel.js 
│   │   └── vicepresidenteModel.js
│   │
│   ├── routes/                   # Rutas (definición de endpoints y middlewares)
│   │   ├── administradorRoutes.js
│   │   ├── gerenteRoutes.js
│   │   ├── loginRoutes.js        # Rutas de autenticación
│   │   ├── metodosRoutes.js
│   │   ├── poRoutes.js    
│   │   ├── usersService.js        
│   │   └── vicepresidenteRoutes.js             
│   │
│   └── services/                 # Servicios (capa intermedia de lógica de negocio)
│       ├── administradorService.js
│       ├── gerenteService.js
│       ├── loginService.js
│       ├── metodosService.js
│       ├── poService.js
│       ├── usersService.js
│       └── vicepresidenteService.js
│
├── uploads/                      # Directorio temporal para archivos subidos (antes de Firebase)
├── node_modules/                 # Dependencias instaladas (no se commitea)
├── Dockerfile                    # Configuración para construcción de imagen Docker
├── package.json                  # Dependencias y scripts del proyecto
├── package-lock.json             # Lock file de dependencias
└── README.md                     # Este archivo
```

## 🏗 Arquitectura

El proyecto sigue una **arquitectura en capas (Layered Architecture)** con separación clara de responsabilidades:

### Flujo de una Petición HTTP

```
Cliente HTTP
    ↓
Routes (routes/)
    ↓ (middleware: multer, validación, etc.)
Controllers (controllers/)
    ↓
Services (services/) [opcional, capa intermedia]
    ↓
Models (models/)
    ↓
Firebase (Firestore/Storage)
    ↓
Respuesta HTTP
```

### Capas

1. **Routes Layer** (`src/routes/`)
   - Define los endpoints HTTP (GET, POST, PUT, DELETE)
   - Configura middlewares (multer para archivos, validaciones)
   - Delega a los controladores

2. **Controllers Layer** (`src/controllers/`)
   - Maneja la lógica de control de flujo
   - Procesa las peticiones HTTP (req, res)
   - Valida datos de entrada
   - Llama a servicios o modelos
   - Formatea respuestas HTTP (JSON, códigos de estado)

3. **Services Layer** (`src/services/`)
   - Contiene lógica de negocio compleja
   - Puede orquestar múltiples modelos
   - Transforma datos entre capas
   - (Opcional: algunos flujos pueden saltarse esta capa)

4. **Models Layer** (`src/models/`)
   - Acceso directo a Firebase (Firestore y Storage)
   - Operaciones CRUD
   - Queries y filtros
   - Gestión de archivos

### Configuración

- **`src/app.js`**: Punto de entrada, inicia el servidor Express
- **`src/Index.js`**: Configura Express (middlewares globales, CORS, rutas)
- **`src/firebase.js`**: Inicializa Firebase Admin SDK


### Convenciones de Nomenclatura

- **Rutas**: Incluyen el rol cuando aplica (ej: `_Admin`, `_gerente`, `_vicepresidente`)
- **Controladores**: Nombres descriptivos del recurso + `Controller` (ej: `pocontroller.js`)
- **Modelos**: Nombres descriptivos + `Model` (ej: `loginModel.js`)
- **Servicios**: Nombres descriptivos + `Service` (ej: `poService.js`)

## 👥 Roles y Permisos

El sistema maneja los siguientes roles de usuario, cada uno con permisos específicos:

### 1. **Radicador (Product Owner - PO)**
- ✅ Crear nuevos radicados/borradores
- ✅ Ver sus propios borradores
- ✅ Editar borradores pendientes de ajustes
- ✅ Analizar documentos con IA (Google Gemini)
- ✅ Subir archivos adjuntos (documentos de revisión)
- ❌ No puede aprobar borradores
- ❌ No puede ver borradores de otros usuarios (excepto si está asignado)

### 2. **Métodos (Gestión de Desarrollo)**
- ✅ Ver todos los borradores del sistema
- ✅ Aprobar borradores (pasar a nivel de Gerentes)
- ✅ Rechazar borradores y solicitar ajustes
- ✅ Gestionar flujo de aprobación inicial
- ✅ Aprobar borradores completamente (en casos especiales)
- ❌ No puede crear borradores

### 3. **Gerente**
- ✅ Revisar y aprobar borradores asignados 
- ✅ Crear solicitudes de ajustes
- ✅ Aprobar borradores para pasar a nivel de Vicepresidentes
- ✅ Ver borradores en su área de responsabilidad
- ❌ No puede crear borradores

### 4. **Vicepresidente**
- ✅ Revisar y aprobar borradores finales
- ✅ Crear solicitudes de ajustes
- ✅ Aprobar proyectos completos (aprobación final)
- ✅ Ver borradores de alto nivel
- ❌ No puede crear borradores
- ❌ Permisos limitados a nivel estratégico

### 5. **Administrador**
- ✅ Gestión completa de usuarios (crear, editar, eliminar)
- ✅ Gestión de estructura organizacional:
  - Crear/eliminar Tribus
  - Crear/eliminar Squads
  - Crear/eliminar Sponsors VP
- ✅ Ver todos los borradores del sistema
- ✅ Actualizar información de borradores
- ✅ Gestionar salarios y configuraciones
- ✅ Obtener información de formularios y configuraciones
- ✅ Acceso completo al sistema

**Nota**: Los roles se almacenan en Firestore en la colección `users` y se verifican mediante JWT en cada petición.

## 🔄 Flujo de Aprobación

El flujo de aprobación de un radicado/borrador sigue estos estados y transiciones:

```
┌─────────────────┐
│   Radicado      │ ← Estado inicial (creado por PO/Radicador)
│   (Estado 1)    │
└────────┬────────┘
         │
         │ Aprobado por Métodos/GD
         ↓
┌─────────────────┐
│  En revisión    │ ← Pendiente de aprobación de Gerentes
│  (Estado 2)     │
└────────┬────────┘
         │
         │ Todos los Gerentes aprueban
         ↓
┌─────────────────┐
│ En revisión VP  │ ← Pendiente de aprobación de Vicepresidentes
│  (Estado 3)     │
└────────┬────────┘
         │
         │ Todos los Vicepresidentes aprueban
         ↓
┌─────────────────┐
│    Aprobado     │ ← Estado final (proyecto completo)
│  (Estado 4)     │
└─────────────────┘

┌─────────────────┐
│Pendiente ajustes│ ← Cualquier nivel puede solicitar ajustes
│  (Estado 5)     │   (retorna al Radicador)
└────────┬────────┘
         │
         │ Radicador actualiza
         ↓
    [Vuelve al inicio según nivel]
```

### Estados Posibles

- **`Radicado`**: Estado inicial cuando se crea el borrador
- **`En revisión`**: En proceso de revisión por los diferentes niveles (Métodos/Gerentes/VPs)
- **`Pendiente de ajustes`**: Requiere modificaciones por parte del radicador
- **`Aprobado`**: Aprobado completamente y listo para ejecución

### Transiciones

- **Métodos → Gerentes**: Cuando Métodos aprueba, el borrador pasa a revisión de Gerentes
- **Gerentes → Vicepresidentes o Aprobado**: Cuando todos los Gerentes aprueban, pasa a Vicepresidentes
- **Vicepresidentes → Aprobado**: Cuando todos los Vicepresidentes aprueban, se marca como Aprobado
- **Cualquier nivel → Ajustes**: Cualquier nivel puede solicitar ajustes, retornando el borrador al radicador

### Campos de Aprobación

Cada borrador mantiene arrays de aprobaciones:
- `aprobacionGD[]`: Aprobaciones de Métodos/Gestión de Desarrollo
- `aprobacionGerentes[]`: Aprobaciones de Gerentes
- `aprobacionVices[]`: Aprobaciones de Vicepresidentes

## 🌐 API Endpoints

Todas las rutas están bajo el prefijo `/api`.

### 🔐 Autenticación (`/api`)

#### users Routes

- **`GET /api/getAllDrafts`**
  - Descripción: Obtiene todos los anteproyectos radicados
  - Cookie: Requiere cookie `session`
  - Respuesta: `{ success: true, data: drafts }`

- **`POST /api/validateLogin`**
  - Descripción: Valida credenciales de Google OAuth y crea sesión JWT
  - Body: `{ credential: string }` (token de Google)
  - Cookie: Se establece cookie `session` con JWT
  - Respuesta: `{ success: boolean, user: { name, email, role } }`

- **`GET /api/checkSession`**
  - Descripción: Verifica si hay una sesión activa
  - Cookie: Requiere cookie `session`
  - Respuesta: `{ authenticated: boolean, user?: { email, name, role } }`

- **`POST /api/logout`**
  - Descripción: Cierra la sesión y limpia cookies
  - Respuesta: Redirección a Google logout

  - **`POST /api/getDraftDetails`**
  - Descripción: Obtiene detalles completos de un borrador dado su id.
  - Body: `{ id_radicado: string }`
  - Cookie: Requiere cookie `session`
  - Respuesta: `{ success: true, message: 'Get draft was succesful',id: snapshot.id, data: draftData, history:history}`



### 👤 Product Owner / Radicador (`/api`)

- **`POST /api/analyzeIa`**
  - Descripción: Analiza un documento con Google Gemini AI. Se envia la información del Bussiness Model Canvas junto con el documento de estimacion de costos, a travez de un flujo de n8n junto a Webhook, y finalmente entregando su analisis.
  - Content-Type: `multipart/form-data`
  - Body: `{ data: File }`
  - Respuesta: Resultado del análisis de IA

- **`GET /api/getDrafts`**
  - Descripción: Obtiene todos los borradores del usuario actual. Unicamente aquellos radicados por el usuario.
  - Cookie: Requiere cookie `session` con el rol de Radicador
  - Respuesta: `{success: true, message: "", data: drafts}`

- **`POST /api/getDraft/:id_radicado`**
  - Descripción: Obtiene un borrador dado su id específico para realizar ajustes. Se usa unicamente cuando el usuario necesita ajustar alguno de sus proyectos y este mismo le corresponde.
  - Params: `id_radicado` (ID del borrador)
  - Cookie: Requiere cookie `session` con el rol de Radicador
  - Respuesta: `{ success: true, message: "", id: id, data: draft}`

- **`POST /api/radicados`**
  - Descripción: Crea un nuevo radicado/borrador
  - Content-Type: `multipart/form-data`
  - Body: Datos del formulario + archivos (documentos de revisión)
  - Cookie: Requiere cookie `session` con el rol de Radicador
  - Respuesta: `{ success: true, message: "", docId: id }`

- **`PUT /api/radicadoUpdate/:id_radicado`**
  - Descripción: Actualiza un borrador existente con la nueva informacion entregada.
  - Content-Type: `multipart/form-data`
  - Params: `id_radicado` (ID del borrador)
  - Body: Datos actualizados + archivos (opcionales)
  - Cookie: Requiere cookie `session` con el rol de Radicador
  - Respuesta: `{ success: true, message: "Radicado actualizado correctamente", id:id , updatedFields:updatedFields}`


### 📋 Métodos (`/api`)


- **`POST /api/createRequestAdjustments`**
  - Descripción: Crea una solicitud de ajustes para un borrador
  - Body: `{ id_radicado: string, comentarios: string }`
  - Cookie: Requiere cookie `session` con rol Métodos
  - Respuesta: `{success: true, message: "", newComment: comment, id: documentId }`

- **`POST /api/aceptDrafts`**
  - Descripción: Aprueba un borrador (pasa a nivel de Gerentes)
  - Body: `{ id_radicado: string }`
  - Cookie: Requiere cookie `session` con rol Métodos
  - Respuesta: `{success: true, message: "", data: drafts}`



### 👔 Gerente (`/api`)

- **`POST /api/createRequestAdjustments_gerente`**
  - Descripción: Crea una solicitud de ajustes desde el nivel de Gerente. En este caso, el campo "estado" en la base de datos cambia a "Pendiente de ajustes". Asimismo, dentro del campo "aprobacionGerentes" que es una lista de los gerentes aprobadores, se actualiza el estado a "Pendiente de ajustes" únicamente para el gerente que realizó la solicitud, permitiendo identificar quién requiere los cambios en el flujo de aprobación.

  - Nota: El cambio del campo "estado" se hara unicamente dependiendo de lo siguiente:
  - 1. Si todos los gerentes ya dieron respuesta a su solicitud (No importa cual sea).
  - 2. Por lo menos hay un solo gerente que haya pedido solicitud de ajustes por lo que cambia a "Pendiente de ajustes".
  - Body: `{ id_radicado: string, comentarios: string }`
  - Cookie: Requiere cookie `session` con rol Gerente
  - Respuesta: `{success: true, message: "", id:idDraft }`

- **`POST /api/aceptDrafts_gerente`**
  - Descripción: Aprueba un borrador y gestiona su transición al nivel de Vicepresidencia. En la base de datos, el campo "estado" cambia a "Aceptado", "Pendiente de ajustes" o "En revisión", según corresponda. Asimismo, dentro de la lista del campo "aprobacionGerentes", se actualiza el estado a "Aprobado" únicamente para el gerente que procesó la solicitud.

  - Nota: El cambio del campo "estado" se hara unicamente dependiendo de lo siguiente y variando tambien acorde a:
  - 1. Si todos los gerentes ya dieron respuesta a su solicitud.
  - 2. Si lo menos hay un solo gerente que haya pedido solicitud de ajustes, el estado cambia a "Pendiente de ajustes"
  - 3. Si todos los gerentes aprobaron el proyecto y el presupuesto del proyecto es menor a la cantidad minima permitida, el estado cambia a "Aceptado". (Se tiene en cuenta salario minimo, cantidad minima SMMLV y el presupuesto)
  - 4. Si todos los gerentes aprueban el proyecto y el presupuesto supera la cantidad mínima permitida, el estado cambia a "En revisión" y el flujo escala a supervisión de los vicepresidentes. En este caso, se asignará en el campo "aprobacionVices" la lista de vicepresidentes aprobadores (incluyendo evaluadores). Si el vp_sponsor del proyecto coincide con un vicepresidente aprobador, este será reemplazado automáticamente por un vicepresidente de respaldo para asegurar la imparcialidad.
  - Body: `{ id_radicado: string }`
  - Cookie: Requiere cookie `session` con rol Gerente
  - Respuesta: `{success: true, message: "", data:dataDraft }`


### 🎩 Vicepresidente (`/api`)

- **`POST /api/aceptDraftsVicepresidente`**
  - Descripción: Aprueba un borrador y gestiona su transición al nivel de Vicepresidencia. En la base de datos, el campo "estado" cambia a "Aceptado" o "Pendiente de ajustes", según corresponda. Asimismo, dentro de la lista del campo "aprobacionVices", se actualiza el estado a "Aprobado" únicamente para el gerente que procesó la solicitud.

  - Nota: El cambio del campo "estado" se hara unicamente dependiendo de lo siguiente:
  - 1. Si todos los vicepresidentes ya dieron respuesta a su solicitud (No importa cual sea).
  - 2. Por lo menos hay un solo vicepresidente que haya pedido solicitud de ajustes por lo que cambia a "Pendiente de ajustes".
  - Body: `{ id_radicado: string }`
  - Cookie: Requiere cookie `session` con rol Vicepresidente
  - Respuesta: `{success: true, message: "", data:dataDraft }`

- **`POST /api/createRequestAdjustmentsVicepresidente`**
  - Descripción: Crea una solicitud de ajustes desde el nivel de Vicepresidente. En este caso, el campo "estado" en la base de datos cambia a "Pendiente de ajustes". Asimismo, dentro del campo "aprobacionVices" qeu es una lista de los vicepresidentes aprobadores, se actualiza el estado a "Pendiente de ajustes" únicamente para el vicepresidente que realizó la solicitud, permitiendo identificar quién requiere los cambios en el flujo de aprobación.

  - Nota: El cambio del campo "estado" se hara unicamente dependiendo de lo siguiente:
  - 1. Si todos los vicepresidentes ya dieron respuesta a su solicitud (No importa cual sea).
  - 2. Por lo menos hay un solo vicepresidente que haya pedido solicitud de ajustes por lo qeu cambia a "Pendiente de ajustes".

  - Body: `{ id_radicado: string, comentarios: string }`
  - Cookie: Requiere cookie `session` con rol Vicepresidente
  - Respuesta: `{success: true, message: "", id: documentId }`

### 🔧 Administrador (`/api`)

#### Gestión de Usuarios
- **`GET /api/getAllUsers_Admin`**
  - Descripción: Obtiene todos los usuarios del sistema a excepción de los usuarios con roles de Administrador
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{success: true, messages: "...", data: users }`

- **`POST /api/createUser_Admin`**
  - Descripción: Crea un nuevo usuario
  - Body: Datos del usuario (correo, nombre, rol, etc.)
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{success: true,message: "...",data: user}`

- **`POST /api/updateUser_Admin`**
  - Descripción: Actualiza un usuario existente
  - Body: Datos actualizados del usuario
  - Cookie: Requiere cookie `session` con rol Administrador
 - Respuesta: `{success: true, messages: "...", data: datausers }`
  

- **`DELETE /api/deleteUser_Admin/:id_user`**
  - Descripción: Elimina un usuario
  - Params: `id_user` (ID del usuario)
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{success: true, messages: "...", data: userDelete }`


  - **`GET /api/getUser_Admin`**
  - Descripción: Obtiene un usuario específico
  - Query: `?email=usuario@example.com`
  - Cookie: Requiere cookie `session` con rol Administrador

  #### Configuración
- **`GET /api/getInfoForm_Admin`**
  - Descripción: Centraliza la configuración de los formularios y del proceso de radicación para el panel administrativo. Provee datos clave sobre tribus, squads y VP sponsors, además de valores normativos como el Salario Mínimo Mensual Legal Vigente (SMMLV). Asimismo, gestiona los montos mínimos de aprobación de proyectos y el catálogo de vicepresidencias (aprobadoras y de respaldo), permitiendo la visualización y edición de las opciones de cambio para estas dependencias.

  - Nota: La lista de ocpiones con las opciones validas para poder cambiar o agregar vicepresidencias sea ya aprobadoras o la de respaldo.
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "...", tribus: tribus, squads: squads, vpSponsors: vpSponsors, salario:salario,  monto_corte: monto_corte,viceAprovers, viceAproversBackup, OptionVicesAprovers, OptionVicesAproversBackup}`

#### Gestión de Borradores
- **`GET /api/getAllDrafs_Admin`**
  - Descripción: Obtiene todos los borradores del sistema
  - Cookie: Requiere cookie `session` con rol Administrador

#### Gestión Organizacional

- **`POST /api/createTribu_Admin`**
  - Descripción: Crea una nueva tribu
  - Body: `{ nombre: string, ... }`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "...", data: tribu }`
  

- **`DELETE /api/eliminateTribu_Admin`**
  - Descripción: Elimina una tribu
  - Body: `{ name_tribu: string }`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "..."}`

- **`POST /api/createSquad_Admin`**
  - Descripción: Crea un nuevo squad
  - Body: `{ nombre: string, tribu: string, ... }`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "...", data: squad }`

- **`DELETE /api/eliminateSquad_Admin`**
  - Descripción: Elimina un squad
  - Body: `{ name_squad: string }`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "..."}`


- **`POST /api/createVpSponsor_Admin`**
  - Descripción: Crea un nuevo sponsor VP
  - Body: `{ nombre: string, ... }`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "...", data: vp_sponsor }`

- **`DELETE /api/eliminateVpSponsor_Admin`**
  - Descripción: Elimina un sponsor VP
  - Body: `{ name_vp_sponsor: string }`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "..."}`


- **`POST /api/updateSalary_Admin`**
  - Descripción: Actualiza información de salario minimo mensual legal vigente
  - Body: `{ salario: salary }`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "..."}`


- **`POST /api/updateMinimumCuttingQuantity_Admin`**
  - Descripción: Actualiza información de la cantidad minima de aprobacion de los poryectos. El punto de decision de si un proyecto para a los vicerpesidentes o no si pasa este monto.
  - Body: `{ monto_corte: minimumCuttingQuantity }`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "..."}`


- **`POST /api/updateVicepresidentBackup_Admin`**
  - Descripción: Actualiza información de la vicepresidente de respaldo
  - Body: `{ vicepresidencia: vicepresidenciaBackup }`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "..."}`

- **`DELETE /api/eliminateVicepresidentAprover_Admin`**
  - Descripción: Elimina la vicepresidencia aprobadora teniendo en cuenta el nombre de este.
  - Body: `{ name: nameVicepresident }`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "..."}`

- **`POST /api/createVicepresidentAprover_Admin`**
  - Descripción: Agrega una nueva vicepresidencia aprobadora de la lista de los vp_sponsor
  - Body: `{ vicepresidencia: newVicepresident }`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "...", data: vicepresidencia}`

- **`POST /api/updateStatusDraft_Admin`**
  - Descripción: Actualiza el estado de los proyectos. Los estado de actulaizacion desponible son :Radicado, En revisión, Rechazado y Pendiente de ajustes.

  - Existe una convencio para cada uno de los estados qeu son:
  - Radicado: Quedara en el punto de espera a la supervision por Gestion de la Demanda.
  - En revisión: Quedara en el punto de espera a la supervision de los Gerentes.
  - Rechazado: Se rechaza el proyecto definitivamente.
  - Aprobado: Se Aprueba  el proyecto definitivamente.
               
  - Body: `{id_draft : id, statusUpdate: statusUpdate};`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "..."}`

- **`POST /api/updateStatusGerentesDraft_Admin`**
  - Descripción: Actualiza de forma selectiva la información y el estado de un aprobador específico dentro del arreglo "aprobacionGerentes". El sistema utiliza el correo electrónico como identificador único para localizar al usuario y modificar su estado (ej. "En revisión" o "Aprobado") sin alterar los registros de los demás gerentes.

  - Nota: El cambio en el estado individual de un gerente puede disparar una actualización automática en el estado general del proyecto bajo las siguientes condiciones:

  - 1. Si el estado del gerente cambia a "Aprobado" y, tras esta actualización, la totalidad de los gerentes en la lista alcanzan el estado de aprobación, el proyecto progresa automáticamente a la siguiente etapa del flujo.
  - 2. Al asignar el estado "En revisión", el sistema mantiene el proyecto en espera de una decisión final por parte del gerente asignado.

  -Ademas, una vez un gerente realizo la aprobacion o el administrador cambia el estado del proyecto a aprobado, ya no se pueden hacer más cambios.
               
  - Body: `{id_draft : id, statusUpdate: statusUpdate};`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "..."}`

- **`POST /api/eliminateStatusGerentesDraft_Admin`**
  - Descripción: Ejecuta la remoción de un aprobador específico dentro del arreglo "aprobacionGerentes". Aunque el objetivo es eliminar un perfil de la lista de gerentes, el procedimiento se realiza mediante una actualización (PATCH/PUT) y no un borrado físico (DELETE), ya que modifica el contenido del documento del proyecto sin eliminar el registro completo de la base de datos. La identificación del aprobador a remover se realiza exclusivamente a través de su correo electrónico.

  - Nota: La eliminación de un gerente puede recalcular automáticamente el estado global del proyecto según las siguientes condiciones::

  - 1. Si tras la eliminación, todos los gerentes restantes poseen el estado "Aprobado", el proyecto progresa automáticamente a la siguiente fase.
  - 2. Si tras la eliminación, el resto de los gerentes han aprobado, pero existe al menos uno con el estado "Pendiente de ajustes", el estado general del proyecto se actualizará a "Pendiente de ajustes".
  - 3. Si dentro de la lista restante persiste al menos un gerente con el estado "En revisión", el proyecto conservará su estado actual hasta que se completen las revisiones pendientes
               
  - Body: `{id_draft : id, correo:correo}`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "..."}`


- **`POST /api/updateStatusVicepresidentDraft_Admin`**
  - Descripción: Actualiza de forma selectiva la información y el estado de un aprobador específico dentro del arreglo "aprobacionVices". El sistema utiliza el correo electrónico como identificador único para localizar al usuario y modificar su estado (ej. "En revisión" o "Aprobado") sin alterar los registros de los demás Vicepresidentes.

  - Nota: El cambio en el estado individual de un Vicepresidente puede disparar una actualización automática en el estado general del proyecto bajo las siguientes condiciones:

  - 1. Si el estado del vicepresidente cambia a "Aprobado" y, tras esta actualización, la totalidad de los vicepresidentes en la lista alcanzan el estado de aprobación, el proyecto progresa automáticamente a la siguiente etapa del flujo que es la aprobación total.
  - 2. Al asignar el estado "En revisión", el sistema mantiene el proyecto en espera de una decisión final por parte del los vicepresidentes asignados.

  -Ademas, una vez un vicepresidente realiza la aprobación o el administrador cambia el estado del proyecto a aprobado, ya no se pueden hacer más cambios.
               
  - Body: `{id_draft : id, statusUpdate: statusUpdate};`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "..."}`

- **`POST /api/eliminateStatusVicepresidentDraft_Admin`**
  - Descripción: Ejecuta la remoción de un aprobador específico dentro del arreglo "aprobacionVices". Aunque el objetivo es eliminar un perfil de la lista de vicepresidentes, el procedimiento se realiza mediante una actualización (PATCH/PUT) y no un borrado físico (DELETE), ya que modifica el contenido del documento del proyecto sin eliminar el registro completo de la base de datos. La identificación del aprobador a remover se realiza exclusivamente a través de su correo electrónico.

  - Nota: La eliminación de un vicepresidente puede recalcular automáticamente el estado global del proyecto según las siguientes condiciones::

  - 1. Si tras la eliminación, todos los vicepresidentes restantes poseen el estado "Aprobado", el proyecto progresa automáticamente a la siguiente fase.
  - 2. Si tras la eliminación, el resto de los vicepresientes han aprobado, pero existe al menos uno con el estado "Pendiente de ajustes", el estado general del proyecto se actualizará a "Pendiente de ajustes".
  - 3. Si dentro de la lista restante persiste al menos un vicepresidente con el estado "En revisión", el proyecto conservará su estado actual hasta que se completen las revisiones pendientes
               
  - Body: `{id_draft : id, correo:correo}`
  - Cookie: Requiere cookie `session` con rol Administrador
  - Respuesta: `{ success: true, message: "..."}`

## 🏃 Ejecución

### Modo Producción

```bash
npm start
```

Esto ejecutará el servidor usando `node src/app.js`.

**Nota**: Asegúrate de tener todas las variables de entorno configuradas correctamente antes de ejecutar en producción.

## 🐳 Docker

El proyecto incluye soporte completo para Docker y Docker Compose.

### Construir la Imagen

```bash
cd Demand-management--Back
docker build -t demand-management-backend .
```

### Ejecutar el Contenedor

```bash
docker run -p 3000:3000 --env-file .env demand-management-backend
```

**Nota**: 
- Asegúrate de tener un archivo `.env` configurado antes de ejecutar los contenedores.
- El archivo `.env` debe estar en la raíz donde se ejecuta `Dockerfile` del backend (Solo incluye backend)


### Docker Compose

Si tienes un archivo `docker-compose.yml` en la raíz del proyecto (que incluye frontend y backend):

```bash
# Desde la raíz del proyecto (donde está docker-compose.yml)
docker-compose up --build
```

Esto construirá y ejecutará tanto el backend como el frontend en contenedores separados.

**Nota**: 
- Asegúrate de tener un archivo `.env` configurado antes de ejecutar los contenedores
- El archivo `.env` debe estar en la raíz donde se ejecuta `docker-compose`
- Las variables de entorno se pasan al contenedor según la configuración en `docker-compose.yml`

### Dockerfile

El `Dockerfile` incluido:
- Usa Node.js 25 Alpine (imagen ligera)
- Copia todo el código al contenedor
- Instala dependencias con `npm install`
- Expone el puerto 3000
- Ejecuta `npm start` como comando por defecto

## 🔐 Autenticación

El sistema utiliza autenticación basada en **JWT (JSON Web Tokens)** con las siguientes características:

### Flujo de Autenticación

1. **Login Inicial**
   - El usuario se autentica mediante Google Sign-In en el frontend
   - El frontend envía el token de Google a `POST /api/validateLogin`
   - El backend valida el token con Google OAuth2
   - Verifica que el usuario exista en Firestore (`users` collection)
   - Genera un JWT token firmado con `SECRET_KEY`

2. **Almacenamiento de Sesión**
   - El JWT se almacena en una cookie HTTP-only llamada `session`
   - Configuración de cookie:
     - `httpOnly: true` (no accesible desde JavaScript)
     - `secure: false` (en desarrollo, `true` en producción con HTTPS)
     - `sameSite: "lax"` (en desarrollo, puede ser "none" en producción con CORS)
     - `maxAge: 86400000` (24 horas)
     - `path: "/"`

3. **Verificación en Peticiones**
   - Las rutas protegidas extraen el token de la cookie `session`
   - Verifican el token usando `jwt.verify()` con `SECRET_KEY`
   - Extraen información del usuario (email, nombre, rol) del payload del token
   - Si el token es inválido o expirado, retornan error 401

4. **Logout**
   - El endpoint `POST /api/logout` limpia todas las cookies
   - Redirige al usuario a Google logout

### Ejemplo de Uso del Token

```javascript
// En las rutas protegidas (ejemplo simplificado)
const token = req.cookies.session;

if (!token) {
  return res.status(401).json({ authenticated: false });
}

try {
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  // decoded contiene: { email, name, role, iat, exp }
  req.user = decoded; // Se puede pasar al siguiente middleware
} catch (error) {
  return res.status(401).json({ authenticated: false });
}
```

### Seguridad

- ✅ Tokens firmados con clave secreta fuerte
- ✅ Cookies HTTP-only (protección contra XSS)
- ✅ Expiración de tokens (24 horas por defecto)
- ✅ Verificación de roles en cada petición
- ⚠️ En producción, usar `secure: true` para cookies (requiere HTTPS)
- ⚠️ En producción, usar `sameSite: "none"` si el frontend está en otro dominio

## 💾 Base de Datos

El sistema utiliza **Firebase Firestore** como base de datos principal y **Firebase Storage** para archivos.

### Colecciones Principales

#### `users`
Almacena información de usuarios del sistema.

**Campos principales:**
- `correo` (string): Email del usuario (único, usado para login)
- `name` (string): Nombre del usuario
- `role` (string): Rol del usuario (Radicador, Métodos, Gerente, Vicepresidente, Administrador)
- `estado` (string): Indica el esatdo de actividad del usuario
- `vicepresidencia` (string): Indica la vicepresidencia a la qeu pertenece en caso dado de qeue el rol del usuario sea "Vicepresidente"


#### `draft`
Almacena los borradores/radicados de proyectos.

**Campos principales:**
- `id_radicado` (string): ID único del borrador (UUID)
- `nombre_proyecto` (string): Nombre del proyecto
- `correo` (string): Email del radicador (creador)
- `estado` (string): Estado actual (Radicado, En revisión, Pendiente de ajustes, Aprobado)
- `estadoAjustesPendientes` (boolean): Indica si hay ajustes pendientes
- `createdAt` (timestamp): Fecha de creación
- `start_date` (timestamp): Fecha de inicio del proyecto
- `end_date` (timestamp): Fecha de fin del proyecto
- `cantidad_dias` (number): Duración en días
- `presupuesto` (number): Presupuesto total
- `alcance` (string): Descripción del alcance
- `situacion_resolver` (string): Situación que resuelve el proyecto
- `aprobacionGD[]` (array): Array de aprobaciones de Métodos
- `aprobacionGerentes[]` (array): Array de aprobaciones de Gerentes
- `aprobacionVices[]` (array): Array de aprobaciones de Vicepresidentes
- `archivosAdjuntos[]` (array): URLs de archivos en Firebase Storage
- `comentarios[]` (array): Historial de comentarios y solicitudes de ajustes

**Documentos de revisión** (almacenados como objetos o referencias):
- `cumplimiento_normativo`
- `finops`
- `juridica`
- `seguridad_informacion`
- `riesgo`
- `estimacion_detalle`
- `caso_negocio`

**Campos Bussiness Model Canvas:**
- `gastos_q1`, `gastos_q2`, `gastos_q3` 
-`aliados_q1` , `aliados_q2` ,` aliados_q3`
-`actividades_q1`, `actividades_q2`
-`propuesta_q1`, `propuesta_q2`, `propuesta_q3`
-`relacion_q1`, `relacion_q2`
-`recursos_q1`
-`canales_q1`,  `canales_q2`
-`segmentos_q1`, `segmentos_q2`, `segmentos_q3`
-`gastos_q1`, `gastos_q2`,`gastos_q3`
-`ingreso_q1`,`ingreso_q2`,`ingreso_q3`

#### `history`

**Campos principales:**
- `antoguo` (string): Anterior información antes del cambio
- `cambio` (string): Cambio realizado
- `id` (string): ID del radicado qeu fue cambiado
- `paso` (string): Indica el paso qeu fue modificado dentro de los radicados
- `time` (timestamp): Indica el tiempo en el qeu se creo el documento 

#### Otras Colecciones
- **Tribus**: Estructura organizacional de tribus
- **Squads**: Estructura de squads dentro de tribus
- **vp_ponsors**: Información de sponsors VP
- **salario**: Información de dalario minimo y el monto de corte de los proyectos.
- **vicepresidencia_aprobadora**: Contiene la infromacion de las vicepresidencias aprobadoras para los proyecto
- **vicepresidencia_respaldo**: Contienen la información del vicepresidente aprobador de respaldo



### Firebase Storage

Los archivos adjuntos se almacenan en **Firebase Storage** en el bucket configurado en `FIREBASE_BUCKET`.

**Estructura típica:**
```
bucket/
  ├── uploads/
  │   ├── {uuid}/
  │   │   ├── cumplimiento_normativo.pdf
  │   │   ├── finops.xlsx
  │   │   └── ...
  │   └── ...
```

**Flujo de almacenamiento:**
1. El archivo se sube temporalmente a `uploads/` (local)
2. Se sube a Firebase Storage usando Multer
3. Se obtiene la URL pública del archivo
4. Se almacena la URL en el documento de Firestore
5. Se elimina el archivo temporal local


## 🔗 Integraciones


El sistema integra **Google Gemini AI** para análisis automático de documentos.

**Configuración:**
- Modelo utilizado: `gemini-2.5-flash`
- Modo de uso : `webhook para procesamiento de IA (Flujo de n8n)`

**Uso:**
- Los usuarios pueden subir documentos para análisis mediante `POST /api/analyzeIa`
- Los documentos se procesan y se obtienen análisis estructurados
- Los resultados se pueden almacenar en los borradores

**Ejemplo de flujo:**
1. Usuario sube un documento PDF/Word
2. El documento se procesa con Gemini AI a travez de un flujo de n8n
3. Se extrae información relevante (presupuesto, alcance, etc.)
4. Los resultados se retornan al frontend para prellenar formularios

### n8n (Notificaciones)

El sistema se integra con **n8n** para envío de notificaciones por correo electrónico.

**Configuración:**
- Variable de entorno: `API_KEY_N8N` (URL del webhook para las notificaciones )
- Variable opcional: `API_KEY_N8N_IA` (webhook para procesamiento de IA)

**Eventos que disparan notificaciones:**
- Creación de nuevo borrador
- Aprobación de borrador (en cualquier nivel)
- Solicitud de ajustes
- Cambio de estado importante



**Implementación:**
- Se utiliza `axios` para enviar peticiones HTTP POST al webhook de n8n
- Se incluye `SECRET_KEY_N8N` en las peticiones para autenticación

## ⚠️ Consideraciones de Seguridad

1. **Variables de Entorno**
   - ⚠️ Nunca commitees el archivo `.env` al repositorio
   - ✅ Usa `.gitignore` para excluir `.env`
   - ✅ Usa `example.env` como plantilla

2. **JWT Secret Key**
   - ⚠️ Utiliza una clave secreta fuerte y única en producción
   - ✅ Genera claves aleatorias de al menos 32 caracteres
   - ✅ No reutilices la misma clave en diferentes ambientes

3. **Firebase Rules**
   - ⚠️ Configura reglas apropiadas en Firestore y Storage
   - ✅ Limita acceso según roles de usuario
   - ✅ Valida datos en el servidor, no solo en las reglas

4. **CORS**
   - ⚠️ Configura `PORT_ACEPT` correctamente según el ambiente
   - ✅ En producción, especifica dominios exactos (no uses `*`)
   - ✅ Usa `credentials: true` solo cuando sea necesario


6. **Autenticación**
   - ✅ Todas las rutas protegidas verifican el token JWT
   - ✅ Verifica roles antes de permitir operaciones sensibles
   - ✅ Usa cookies HTTP-only para evitar XSS

7. **Archivos Temporales**
   - ⚠️ Limpia archivos temporales después de subirlos a Firebase Storage
   - ✅ Considera usar un proceso de limpieza periódico

8. **Logs y Errores**
   - ⚠️ No expongas información sensible en mensajes de error
   - ✅ Usa logging apropiado )
   - ✅ Maneja errores de forma consistente

## 📝 Scripts Disponibles

### `npm start`
Inicia el servidor en modo producción usando `node src/app.js`.

### `npm run dev`
Inicia el servidor en modo desarrollo con `node --watch src/index.js` para recarga automática.

## 🔧 Desarrollo

### Estructura de Código

- **Modularidad**: Cada rol tiene sus propios archivos (routes, controllers, services, models)
- **Separación de responsabilidades**: Rutas → Controladores → Servicios → Modelos
- **Reutilización**: Servicios y modelos pueden ser compartidos cuando tiene sentido



## 👤 Autor

**Mateo Cante Garzón - Practicante universitario**

---

## 🆘 Soporte

Para problemas o preguntas:
- Abre un issue en el repositorio del proyecto
- Revisa la documentación de Firebase: https://firebase.google.com/docs
- Revisa la documentación de Express: https://expressjs.com/
- Revisa la documentación de Google Gemini: https://ai.google.dev/docs

---

**Última actualización**: 2025
