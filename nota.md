1. hashing de contraseña: (encripotado) `npm i bcrypt`
2. APORTE
   Especificación de la Estructura CLEAN en nuestro Proyecto.
Enterprise Business Rules del curso
Modelos y schemas.
Products
Users
Orders
Customers
Categories
APP Business Rules Uses Cases del curso
Services
Validators / Middlewares
Interface Adapters
Routers
Frameworkds and Drivers
Docker
PostgreSQL
Sequelize

3. aporte
   Les dejo esta otra alternativa que utiliza el algoritmo Scrypt (incluido en node) para crear el hash de la contraseña, de forma que no necesitamos usar librerias externas para ello

Pero como indica este articulo la mejor protección son contraseñas largas y con distintos caracteres

```js
const { randomBytes, scryptSync } = require("crypto");

/**
 * Encrypts the user's password using the Scrypt algorithm
 * @param {string} password 
 * @returns {Promise<string>}
 */
async function hashPassword(password) {
   password = password.trim();
   const randomSalt = randomBytes(16).toString("hex");
   const hashedPassword = scryptSync(password, randomSalt, 16).toString("hex");

   const fullHash = `${randomSalt}:${hashedPassword}`;

   console.log(fullHash.length);
   return fullHash;
}

/**
 * Verifies if the password provided matches with the hash
 * @param {string} password
 * @param {string} passwordHash
 * @returns {Promise<string>}
 */
async function verifyPassword(password, passwordHash) {
   password = password.trim();
   const [salt, hashedPassword] = passwordHash.split(":");

   const compHash = scryptSync(password, salt, 16).toString("hex");

   return compHash === hashedPassword;
}

module.exports = {hashPassword, verifyPassword}

```

5. Authenticación con passport js. permite logearnos mediante diferentes estrategias o formas como Twitter, Google, Facebook, etc. Lo que se hace es teniendo nuestro código base, aplicamos con Passport la estrategia con la que queremos hacer login a través del endpoint /auth/login.  
   instalación de passport-local (login y password) `npm i passport passport-local`
