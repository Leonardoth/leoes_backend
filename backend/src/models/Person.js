const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
    rg : String,
    contact : String,
    name: String,
    avatar_url : String,
    adress : String,
    org : String,
    plates : [{}],
    friends : [String],
    others : [String],
    images : [[]]
})

module.exports = mongoose.model('Person', PersonSchema)