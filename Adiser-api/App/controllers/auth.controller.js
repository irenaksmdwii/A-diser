const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;
const Role = db.roles;
const Op = db.Sequelize.Op;
let jwt = require("jsonwebtoken");
let bcrypt = require("bcryptjs");
const { roles } = require("../models");
exports.signup = (req, res) => {
    // Save User to DB
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
    .then(users => {
        if(req.body.roles){
            roles.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            }).then(roles => {
                users.setRoles(roles).then(() => {
                    res.send({message: "Register Berhasil"})
                });
            });
        }else{
            // user role = 1
            users.setRoles([1]).then(() => {
                res.send({message: "Register Berhasil"});
            });
        }
    })
    .catch(err => {
        res.status(500).send({message: err.message});
    });
};
exports.signin = (req, res) => {
    User.findOne({
        where:{
            username: req.body.username
        }
    })
    .then(users => {
        if(!users){
            return res.status(404).send({message: "User tidak ditemukan."});
        }
        let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            users.password
        );
        if(!passwordIsValid){
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }
        let token = jwt.sign({id: users.id}, config.secret, {
            expiresIn: 86400 // 24 hours 
        });
        let authorities = [];
        users.getRoles().then(roles => {
            for(let i = 0; i < roles.length; i++){
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: users.id,
                username: users.username,
                email: users.email,
                roles: authorities,
                accessToken: token
            });
        });
    })
    .catch(err => {
        res.status(500).send({message: err.message});
    });
}

