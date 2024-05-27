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

    async sendRecovery(email) {
        const user = await service.findByEmail(email);
        if (!user) {
            throw boom.unauthorized();
        }
        const payload = { sub: user.id };
        const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
        //? enviar al frontend
        const link = `http://myfrontend.com/recovery?token=${token}`;
        await service.update(user.id, {recoveryToken: token});

        const mail = {
            from: config.smtpEmail,
            to: `${user.email}`,
            // to: 'bibliotecaspj@gmail.com',
            subject: "Email para recuperar contraseña",
            html: `<b>Ingresa a este link => ${link}</b>`,
        }

        const rta = await this.sendMail(mail);
        return rta;
    }

    async sendMail(infoMail) {
        // servidor para el envio de correo
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            secure: true,
            port: 465,
            auth: {
                user: config.smtpEmail,
                pass: config.smtpPassword
            }
        });

        await transporter.sendMail(infoMail);
        return { message: 'mail sent' };
    }


}

module.exports = AuthService;
