const { Strategy } = require('passport-local');
const AuthService = require('./../../../services/auth.service');


const service = new AuthService();

const LocalStrategy = new Strategy({
        usernameField: 'email',      // personlizar el campo
        passwordField: 'password'
    },
    async(email, password, done) => {
        try {
            const user = await service.getUser(email, password);
            done(null, user); // (no hay error, user)
        } catch (error) {
            done(error, false); // false: no fue posible hacer la validación
        }
    }
);


module.exports = LocalStrategy;
