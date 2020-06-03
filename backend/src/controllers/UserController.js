const axios = require('axios'); // caso use chamada para outras API's (imgur, lightshot etc...)
const User = require('../models/User')
require('dotenv-safe').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    async store(request, response){
        // request.body.password / username
        // hash password
        // store username + hashed password in db
        const {password, username, level} = request.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const hasUser = await User.findOne({username})
        console.log(hashedPassword, username)
        if(!hasUser){
            await User.create({
                username,
                password : hashedPassword,
                level
            })
            return response.json(`Usuário ${username} criado com sucesso.`)
        }else{
            return response.json("Usuário já existe!")
        }
    },

    async login(request, response, next){
        const {password, username} = request.body
        const user = await User.findOne({username})
        if(!user){
            return response.status(400).send({auth : false, token : null})
        }
        const {_id, level} = user 
        const hashedPassword = user.password
        const login = await bcrypt.compare(password,hashedPassword)
        if(login){
            var token = jwt.sign({_id, level}, process.env.SECRET, {
                expiresIn: 86400
            })
            return response.status(200).send({auth:true, token, level});
        }else{
            return response.status(200).send({auth:false, token:null});
        }      
    },

    async verifyJWT(request, response, next){
        var token = request.headers['x-access-token']
        if(!token) return response.status(401).send({auth:false, message:"No token provided.", loggedIn : false})

        jwt.verify(token, process.env.SECRET, function(err, decoded){
            if(err) return response.status(500).send({auth:false, message:"Failed to authenticate.", loggedIn : false})
        
            request.userId = decoded._id;
            request.level = decoded.level;
            next()
        })
    }
    
}