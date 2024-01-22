const jwt = require('jsonwebtoken');

const generateToken = (id)=>{
    return jwt.sign({id}, "tokennekot", { expiresIn: '30d' })
} 

module.exports = generateToken