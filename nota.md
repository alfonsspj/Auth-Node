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

6. JWT json web token: `npm i jsonwebtoken`
   tiempo de expiración:
   Para los refresh tokens hay que definir un tiempo de expiración, eso se puede lograr pasando un tercer argumento de configuración a la función sign.

Para hacer que expire el token después de un cierto tiempo sería:


const jwt = require('jsonwebtoken')

const jwtConfig = {
  expiresIn: '7d',
};
const payload = {
  sub: user.id,
  role: "customer"
}

const token = jwt.sign(payload, process.env.JWTSECRET, jwtConfig)
Observaciones:

user es la instancia del usuario obtenido del modelo que tenga la propiedad Id del usuario.
Se utiliza sub por conveniencia porque así lo maneja el standar de JWT pero puede usarse el nombre que uno quiera mas info sobre los claims disponibles aquí
si en expiresIn se pone sólo número entonces lo considera en segundo, pero si es un string entonces deberá llevar la unidad para definir el tiempo de expiración, ejemplo:

60 * 60 === '1h’ 60 * 60 * 24 === ‘1d’

pero si por accidente se pone un string sin unidad de tiempo entonces lo tomará como milisegundos: “60” === “60ms”



Leyendo un poquito me encontré con este documento sobre las vulnerabilidades de los JWT, creo que es bueno hecharle un ojo

https://auth0.com/blog/critical-vulnerabilities-in-json-web-token-libraries/
 

7. Generar aleatoriamente passwords: https://keygen.io/#fakeLink o https://acte.ltd/utils/randomkeygen
Al implementar JWT ya no es necesario enviar los datos del usuario en la petición, ya que por medio del payload del token podemos enviarla, ademas recordar que por ningún motivo se debe enviar informacion sensible del usuario.

8. instalación de passport-jwt `npm i passport-jwt`
