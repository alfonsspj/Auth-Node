const jwt = require('jsonwebtoken');


const secret = 'myCat';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTcxNjQ4OTE2MX0.JW9SFmTnKrRakvO_g1b2qg6JZf0FwQCClET_8RpHle0';

function verifyToken( token, secret ) {
    return jwt.verify(token, secret);
}

const payload = verifyToken( token, secret );
console.log(payload);// { sub: 1, role: 'customer', iat: 1716489161 } -- iat( fecha en la que se hizo la firma)
