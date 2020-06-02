const config = require('../config/config.js');
const jwt = require('jsonwebtoken');
const User = require('../user/userModel.js');



let alterData = (req, res, next) => {

    if (!req.body.event) {
        res.status(400).json('No event provided');
    } else {
        let event = req.body.event[0].toUpperCase() + req.body.event.slice(1);
        // event[0] = event[0].toUpperCase();
        req.body.event = event;
        next();
    }

}

const authenticate = async (req, res, next) => {
    let token = req.header('x-auth');
    let decoded;
    //console.log('middle-----------------------', req.user);
    try {
        decoded = jwt.verify(token, config.password);
        let user = await User.findOne({
            _id: decoded._id,
            "tokens.token": token
        });
        if (user) {
            req.user = user;
            req.token = token;
            next()
        } else {
            res.status(401).json('AUTHENTIFICATION: failed');
        }
    } catch (err) {
        res.status(400).json(err);
    }
}



module.exports = {
    alterData,
    authenticate
}

const findPostByUser = async () => {


}