const jwt = require('jsonwebtoken');
const secret = require('./env').secret;
const User = require('../models/user');

module.exports = 
async function ({ req }) {
    let token = null;
    let currentUser = null;
    if(!token) return {};

    token = req.headers["authorization"];
    const decodeInfo = jwt.verify(token,secret);

    if(token && decodeInfo){
        currentUser = await User.findById(decodedInfo.id);

        if(!currentUser) throw new Error('Invalid Token');
    }

    if(!currentUser){
        throw new Error('Needs token');
    }

    return{
        token: token,
        currentUser
    }
}