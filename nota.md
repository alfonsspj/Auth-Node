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
9. Gestión de roles: 
10. libreria access control `npm i accesscontrol` para gestionar permisos de forma explicita. Mas avanzado
11. Obteniendo ordenes del perfil ( manejar el sub del jwt) a partir de la sesion del token: 
12. expiración de token (15 a 20 min de expiración)
13. artículo súper práctico para la implementación de los refresh token [refresh token jwt](https://www.geeksforgeeks.org/jwt-authentication-with-refresh-tokens/)
14. Consideraciones a tener en cuenta:

Al hacer un login en la API nos da la información del usuario, pero también envían el token. Lo más importante es guardar el token porque debe enviarse en todas las peticiones.

En el cliente deberíamos tener un estado de login, es decir, una vez hecho un login exitoso se debería guardar un estado de sesión iniciada en el frontend.
Deberíamos guardar el estado (el token) en algún lugar, se recomienda una cookie. También se puede en LocalStorage, pero no es la mejor practica.
Cada vez que se envíe una petición (request) se debería enviar el token. Si se manejan librerías para hacer requests (ej. axios), hay formas de interceptar la petición y poner el token en el header.
El token debería tener una expiración, se recomienda que expire en 15-20 minutos, se puede implementar una técnica de refresh token. La API nos puede dar un access token y otro token aparte (refresh token) que nos servirá para generar un nuevo token cuando el access token ya expiró. Se recomienda estar haciendo requests continuamente para no salir de la sesión.
Se pueden validar permisos, con el token se puede preguntar al backend qué tipo de perfil es, aunque para más seguridad sería mejor hacer un request para obtener el perfil del usuario para no guardar nada en algún lugar.

14. Acá un ejemplo de cómo se podría implementar el refresh-token desde el cliente, (no es del proyecto que estamos haciendo en este curso pero puede ser útil para entender la lógica):

Función para refrescar el token: En este caso solo se hace un get al endpoint /api/session/refresh, el refresh-token es enviado automáticamente como una cookie al servidor gracias al withCredentials: true utilizando axios.

```javascript
export const RefreshTokenService = async (): Promise<boolean> => {
  try {
    await axios.get(`${GLOBALS.API_HOST}/api/session/refresh`, {
      withCredentials: true,
    });

    return true;
  } catch (err) {
    return false;
  }
};

```
En las funciones que utilizan el access-token, validar si la petición retorna un código de estado 403, o el que se haya definido cuando el access-token está vencido o no es válido:

// En este caso es una función para añadir un producto a los favoritos a partir de su id. 
// El parametro it es un contador de los intentos que sirve para intentar refrescar el 
// access token una sola vez.

```javascript
export const AddToFavoritesService = async (it: number, id: string): Promise<boolean> => {
  // Si luego de intentar refrescar el access-token sigue fallando, retorna false como 
  // indicador de que no se pudo realizar.
  if (it > 2) return false;

  try {
  // Intenta añadir a favoritos
    const payload = { id };
    const response = await axios.post(`${GLOBALS.API_HOST}/api/user/favorites`, payload, {
      withCredentials: true,
    });

    return response.status === 200 ? true : false;
  } catch (err) {
  // Si el servidor response algo diferente a 200 (OK) axios lo tomará como error
  // Por lo que entrará a este catch
    if (axios.isAxiosError(err)) {
     // El código de estado 403 es el que nos indica en este caso que el access-token
     // está vencido o no es válido
      if (err.response?.status === 403) {
       // Ejecutamos la función para refrescar el token
        await RefreshTokenService();
       // Hacemos una llamada recursiva a la función de añadir a favoritos para intentar
       // de nuevo, pero aumentamos en uno el contador de iteraciones para poner el límite.
        return await AddToFavoritesService(++it, id);
      }
      return false;
    }
    return false;
  }
};
```
15. cookies vs localstorage
    Tu puedes acceder a través de JavaScript al LocalStorage, por lo que un atacante podría acceder a esa información, por otro lado, no se puede acceder a las cookies, por eso LocalStorage no se utiliza para almacenar información sensible. Otra razón es porque las cookies sólo almacenan hasta 5Kb y LocalStorage hasta 5Mb y las cookies expiran, LocalStorage no.


16. 🗝 Clase #14: Manejo de la autenticación desde el cliente 14/20 🗝
  Con un token empezamos a manejar la capa de autenticación y de autorización desde el lado del backen, pero del lado de los clientes es diferente, lo hacen a través de una interfaz creada por Angular, React o Vue que se conectan a la API y manejan las sesiones, cuando se hace login, nos envía toda la información relacionada con el usuario: nombre, email, datos de fechas, incluso un avatar y lo más importante el token, todo esto se debe almacenar para tener mas accesos.  

Client Session (Browser): ♨
  Las fases o etapas a considerar desde el punto de vista de la sesión del cliente, es decir desde el Browser o la app (aplicaciones móviles) son las siguientes:  

Captura desde 2023-03-29 22-33-02.png

 

Un estado de login: una vez qu se hace el login y es exitoso debemos guardar en algún estado la información proveniente del usuario, como los token son ++stealers++, es decir que no tienen un estado fijo se debe guardar en un LocalStorage o cookie.  
Cookies o LocalStorage: el mejor lugar para guardar el token podría ser una cookie (que es mejor que un LocalStorage), cada vez que se hace un request (una petición), es decir se quiere por ejemplo consultar categorías, se quiere crear una orden, se quiere editar un producto, etc, se debe enviar el token por cada petición.  
Enviar en el header: Existe en Angular una manera que se pueda interceptar el token por medio de un header y no sea necesario enviar el token cada vez que se haga una petición.  
Refresh token: Los token deben tener una duración, es decir un tiempo de expiración, esto se ve relejado por ejemplo en las sesiones bancarias en donde después de un tiempo de consulta, se expira la sesión y se sale, sin embargo en otras sesiones no relacionadas con el área bancaria puede crear malestar al usuario que lo estén sacando por ejemplo cada 15 minutos, para evitar esto se encuentra los Refresh token, que es un segundo token que se genera al hacer login que al expirar el primero, el segundo lo sustituye sin necesidad de salir de la sesión (el frontend lo solicita).  
Validar permisos: Al tener el token se puede validar permisos e indicarle al backend qué tipo de perfil es y verificar si está autorizado a visualizar o consultar cierta información restringida a la mayoría de usuarios.  

17. recuperación de contraseñas a traves de correo con nodemail: `npm i nodemailer`
    https://ethereal.email/ cuenta fake

18. NodeApp rmon aywz vmhn jbus --- usando el servidor smtp de gmail
19. Tutorial actual de configurar contraseña de aplicación

https://support.google.com/accounts/answer/185833?hl=es

20. También podemos usar mailtrap para checar nuestros correos en nodemailer

https://mailtrap.io/
