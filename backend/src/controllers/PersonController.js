const axios = require('axios'); // caso use chamada para outras API's (imgur, lightshot etc...)
const Person = require('../models/Person')
const Search = require('./SearchController')

module.exports = {
    async store(request, response) {
        const {rg, contact, name, avatar_url, adress, org, plates, friends, others, images} = request.body
    

        let person = await Person.findOne({$or : [{rg}, {contact}]});
        if(!person){
            person = await Person.create({
                rg,
                contact,
                name,
                avatar_url,
                adress,
                org,
                plates,
                friends,
                others,
                images
            })
        }
    
        return response.json(person)
    },

    async index(request, response){
        const people = await Person.find().skip(4)
        return response.json(people)
    },

    async updateOrAdd(request, response){
        let { _id = null,rg, contact, name, avatar_url, adress, org, plates =[], friends=[], others=[], images=[]} = request.body
        
        if(_id){
            if(request.level < process.env.ADMIN){
                return response.status(400).send({message : 'Você não possui esses poderes!'})
            }
            await Person.updateOne({_id}, {$set : {
                rg,
                contact,
                name,
                avatar_url,
                adress,
                org,
                plates,
                friends,
                others,
                images
            }});
            
            const people = await Person.findOne({_id})
            return response.json(people)
        }else{
            // search if rg/contact matches any
            // if so, ADD new information on fields that are empty and push new info on to arrays.
            let person;
            if(rg !== null && contact !== null){
                person = await Person.findOne({$or : [{rg}, {contact}]});
            }else if(rg == null || contact == null){
                rg !== null ? person = await Person.findOne({rg}) : person = await Person.findOne({contact})
            }
            if(!person){
                person = await Person.create({
                    rg,
                    contact,
                    name,
                    avatar_url,
                    adress,
                    org,
                    plates,
                    friends,
                    others,
                    images
                })
                return response.json(person)
            }else{
                let data = {}
                data.rg = person.rg || rg,
                data.contact = person.contact || contact,
                data.name = person.name || name,
                data.avatar_url = person.avatar_url || avatar_url,
                data.org = person.org || org,
                data.plates = person.plates? person.plates : []
                data.plates = [...person.plates, ...plates],
                data.friends = person.friends? person.friends : []
                data.friends = [...person.friends, ...friends],
                data.others = person.others? person.others : []
                data.others = [...person.others, ...others],
                data.images = person.images? person.images : []
                data.images = [...person.images, ...images] 
                
                await Person.updateOne({_id : person._id}, data)
                const _person = await Person.findOne({_id : person._id})
                return response.json(_person)
            }
        }
    },

    async deletePerson(request, response){
        if(request.level < process.env.ADMIN){
            return response.status(400).send({message : 'Você não possui esses poderes!'})
        }
        await Person.deleteOne({_id : request.body._id})
        let {field, term} = request.body
        const person = field? await Search.searchField(term,field) : await Search.searchMatches(term)
        return response.json(person)
    }
    
}