const db = require("../models");
const ROLES = db.ROLES;
const User = db.users;
checkDuplicateUsernameOrEmail = (req, res, next) => {
    //* if username or email is duplicate or not
    // Username
    User.findOne({
        where:{
            username: req.body.username
        }
    }).then(users => {
        if (users){
            res.status(400).send({
                message: "Gagal! Username sudah digunakan!"
            });
            return;
        }
        // Email
        User.findOne({
            where: {
                email: req.body.email
            }
        }).then(users => {
            if(users){
                res.status(400).send({
                    message: "Gagal! Email sudah digunakan!"
                });
                return;
            }
            next();
        });
    });
};

// Role is existed or not
checkRoleExisted = (req, res, next) => {
    if(req.body.roles){
        for(let i = 0; i < req.body.roles.length; i++){
            if(!ROLES.includes(req.body.roles[i])){
                res.status(400).send({
                    message: "Gagal Role tidak tersedia = ." + req.body.roles[i]
                });
                return;
            }
        }
    }
    next();
};
const verifySignUp = {
            checkDuplicateUsernameOrEmail:checkDuplicateUsernameOrEmail,
            checkRoleExisted:checkRoleExisted
        };
module.exports = {
    verifySignUp,
    checkDuplicateUsernameOrEmail,
    checkRoleExisted
}