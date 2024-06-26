const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('./../libs/sequelize');

class UserService {
    constructor() { }

    async create(data) {
        const hash = await bcrypt.hash(data.password, 10);
        const newUser = await models.User.create({
            ...data,
            password: hash
        });

        //* retornar usuario pero sin password
        delete newUser.dataValues.password; // sequelize - serealize(parsear y controlar los valores)
        return newUser;
    }

    async find() {
        const rta = await models.User.findAll({
            include: ['customer']
        });
        return rta;
    }

    async findByEmail( email ) {
        const rta = await models.User.findOne({  // el primer que cumpla con email( ademas es único)
            where: { email }
        });
        return rta;
    }

    async findOne(id) {
        const user = await models.User.findByPk(id);
        if (!user) {
            throw boom.notFound('user not found');
        }
        return user;
    }

    async update(id, changes) {
        const user = await this.findOne(id);
        const rta = await user.update(changes);
        return rta;
    }

    async delete(id) {
        const user = await this.findOne(id);
        await user.destroy();
        return { id };
    }
}

module.exports = UserService;
