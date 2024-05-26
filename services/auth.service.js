const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const UserService = require('./user.service');
const { config } = require('./../config/config');


const service = new UserService();

class AuthService {

    async getUser(email, password) {
        const user = await service.findByEmail(email);// si no encuentra user return null
        if (!user) {
            throw boom.unauthorized();
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw boom.unauthorized();
        }
        delete user.dataValues.password;
        return user;
    }

    signToken(user) {
        // firma del token
        const payload = {
            sub: user.id,
            role: user.role
        };
        const token = jwt.sign(payload, config.jwtSecret);
        return {
            user,
            token
        };
    };

    async sendMail(email) {
        const user = await service.findByEmail(email);
        if (!user) {
            throw boom.unauthorized();
        }

        // servidor para el envio de correo
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            secure: true,
            port: 465,
            auth: {
                user: 'alfonsspj@gmail.com',
                pass: 'rmonaywzvmhnjbus'
            }
        });

        await transporter.sendMail({
            from: 'alfonsspj@gmail.com',
            to: `${user.email}`,
            subject: "correo de prueba",
            text: "Hola, este es un mensaje de prueba",
            html: "<b>Hola, este es un mensaje de prueba</b>",
        });

        return { message: 'mail sent'};
    }


}

module.exports = AuthService;
