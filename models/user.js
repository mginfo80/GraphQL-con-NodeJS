const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../libs/env').secret;

const userSchema = new mongoose.Schema({
    email: String,
    hashedPassword:{
        type: String
    },
    token: String,
    courses: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Course'
    }]
    
});

userSchema.virtual('password');

userSchema.pre('validate',async function(){
    if(this.password === undefined) return;

    try{
    const hash = await bcrypt.hash(this.password, 10);
    console.log(hash, this.password);
    this.hashedPassword = hash;
    }catch(err){
        console.log(err);
        throw err;
    }
});

userSchema.statics.authenticate = async function({email,password}){
    const user = await this.findOne({email});
    console.log({email});
    if (!user) throw new Error('Error autenticación');
    console.log(password, user.hashedPassword);
    const result = await bcrypt.compare(password,user.hashedPassword);
    if(!result) throw new Error('Error autenticación');

    user.token = jwt.sign({id: user.id}, secret);
    await user.save();

    return user;

};

module.exports = mongoose.model('User', userSchema);