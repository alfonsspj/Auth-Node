const boom = require('@hapi/boom');
const { config } = require('./../config/config');


function checkApiKey( req, res, next ) {
    const apiKey = req.headers['api'];
    if( apiKey === config.apiKey ) {
        next();
    } else {
        next( boom.unauthorized() );
    }
}

function checkAdminRole( req, res, next ) {
    console.log(req.user);
    const user = req.user;// sabemos que lo tiene por payload de jwt
    if ( user.role === 'admin' ) {
        next();
    } else {
        next( boom.unauthorized() );
    }
}


// clousures
function checkRoles( ...roles ) { // que roles vamos a permitir que entren al endpoint
    // retorno un middleware
    return (req, res, next) => {
        const user = req.user;
        if ( roles.includes(user.role) ) {
            next();
        } else {
            next( boom.unauthorized() );
        }
    }
}

module.exports = { checkApiKey, checkAdminRole, checkRoles };
