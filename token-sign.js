const jwt = require('jsonwebtoken');


const secret = 'myCat';// sólo lo deberia tener el backend
const payload = {    // lo que se encripta dentro del token
    sub: 1, // poder identificar al usuario
    role: 'customer', // permisos (scope)
};

function signToken( payload, secret ) {
    return jwt.sign(payload, secret); // genera el token
}

const token = signToken( payload, secret );
console.log(token);
