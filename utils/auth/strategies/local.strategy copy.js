const { Strategy } = require('passport-local');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const UserService = require('./../../../services/user.service');


const service = new UserService();

const LocalStrategy = new Strategy({
        usernameField: 'email',      // personlizar el campo
        passwordField: 'password'
    },
    async(email, password, done) => {
        try {
            const user = await service.findByEmail(email);// si no encuentra user return null
            if ( !user ) {
                done(boom.unauthorized(), false);
            }
            const isMatch = await bcrypt.compare(password, user.password);

            if ( !isMatch ) {
                done(boom.unauthorized(), false);
            }
            delete user.dataValues.password;
            done(null, user); // (no hay error, user)
        } catch (error) {
            done(error, false); // false: no fue posible hacer la validación
        }
    }
);


module.exports = LocalStrategy;
