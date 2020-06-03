const Person = require('../models/Person')

module.exports = {
    async findMatches(request, response) {
        // como procurar um field específico que o usuário defina? Ou procurar em TUDO o input do usuário?
        // exemplo de placa exata
        // const {rg_, contact, name, avatar_url, adress, org, plates, friends, others, images} = request.query
        const {term} = request.query
        let person;
        if(term.length == 0){
            person = await Person.find({
                $or : [
                    {rg : {$regex:term, $options : "gi"}},
                    {contact : {$regex:term, $options : "gi"}},
                    {name : {$regex:term, $options : "gi"}},
                    {adress : {$regex:term, $options : "gi"}},
                    {org : {$regex:term, $options : "gi"}},
                    {others : {$regex:term, $options : "gi"}},
                    {friends : {$regex:term, $options : "gi"}},
                    {"plates.plate_number" : {$regex:term, $options : "gi"}},
                    {"plates.plate_description" : {$regex:term, $options : "gi"}},
                ]
        }).limit(20)
        }else{
            person = await Person.find({
                    $or : [
                        {rg : {$regex:term, $options : "gi"}},
                        {contact : {$regex:term, $options : "gi"}},
                        {name : {$regex:term, $options : "gi"}},
                        {adress : {$regex:term, $options : "gi"}},
                        {org : {$regex:term, $options : "gi"}},
                        {others : {$regex:term, $options : "gi"}},
                        {friends : {$regex:term, $options : "gi"}},
                        {"plates.plate_number" : {$regex:term, $options : "gi"}},
                        {"plates.plate_description" : {$regex:term, $options : "gi"}},
                    ]
            })
        }
        if(!person.length){
            return response.json({message: 'Nenhuma placa encontrada.'})
        }

        return response.json(person)

    },

    async findField(request, response){
        // fields rg, contact, name, adress, org, plates, friends, others
        const { field, term } = request.query
        let person = ''
        switch(field){
            case "rg":
                person = await Person.findOne({rg : term})
                // apenas um resultado
                break;
            case "contact":
                person = await Person.findOne({contact : term})
                // apenas um resultado
                break;
            case "adress":
                person = await Person.find({adress : {$regex:term, $options : "gi"}})
                // apenas um resultado
                break;
            case "plates":
                if(term.length == 8){
                    person = await Person.findOne({"plates.plate_number" : term })
                }else{
                    person = await Person.find({"plates.plate_number" : {$regex:term, $options : "gi"}})
                }
                // se tiver 8 caracteres, só pode ter um resultado.
                // caso tenha menos, é placa parcial. Retornar matches.
                break;
            default:
                if(field == 'plate_description'){
                    person = await Person.find({"plates.plate_description" : {$regex:term, $options : "gi"}})
                }else{
                    person = await Person.find({[field] : {$regex:term, $options : "gi"}})
                }
                // coisas que podem ter mais de um resultado. Adicionar também plate_description ao array de resultados.
                break; 

        }

        return person? response.json(person) : response.json({error : "Nenhum resultado encontrado."})
    },


    async getById(request, response){
        let person = await Person.findOne( {"_id" : request.query.id}) 
        return response.json(person)
    },

    async searchMatches(term){
        let person;
        if(term.length == 0){
            person = await Person.find({
                $or : [
                    {rg : {$regex:term, $options : "gi"}},
                    {contact : {$regex:term, $options : "gi"}},
                    {name : {$regex:term, $options : "gi"}},
                    {adress : {$regex:term, $options : "gi"}},
                    {org : {$regex:term, $options : "gi"}},
                    {others : {$regex:term, $options : "gi"}},
                    {friends : {$regex:term, $options : "gi"}},
                    {"plates.plate_number" : {$regex:term, $options : "gi"}},
                    {"plates.plate_description" : {$regex:term, $options : "gi"}},
                ]
        }).limit(20)
        }else{
            person = await Person.find({
                    $or : [
                        {rg : {$regex:term, $options : "gi"}},
                        {contact : {$regex:term, $options : "gi"}},
                        {name : {$regex:term, $options : "gi"}},
                        {adress : {$regex:term, $options : "gi"}},
                        {org : {$regex:term, $options : "gi"}},
                        {others : {$regex:term, $options : "gi"}},
                        {friends : {$regex:term, $options : "gi"}},
                        {"plates.plate_number" : {$regex:term, $options : "gi"}},
                        {"plates.plate_description" : {$regex:term, $options : "gi"}},
                    ]
            })
        }
        if(!person.length){
            return response.json({message: 'Nenhuma placa encontrada.'})
        }

        return person
    },

    async searchField(term, field){
        let person = ''
        switch(field){
            case "rg":
                person = await Person.findOne({rg : term})
                // apenas um resultado
                break;
            case "contact":
                person = await Person.findOne({contact : term})
                // apenas um resultado
                break;
            case "adress":
                person = await Person.find({adress : {$regex:term, $options : "gi"}})
                // apenas um resultado
                break;
            case "plates":
                if(term.length == 8){
                    person = await Person.findOne({"plates.plate_number" : term })
                }else{
                    person = await Person.find({"plates.plate_number" : {$regex:term, $options : "gi"}})
                }
                // se tiver 8 caracteres, só pode ter um resultado.
                // caso tenha menos, é placa parcial. Retornar matches.
                break;
            default:
                if(field == 'plate_description'){
                    person = await Person.find({"plates.plate_description" : {$regex:term, $options : "gi"}})
                }else{
                    person = await Person.find({[field] : {$regex:term, $options : "gi"}})
                }
                // coisas que podem ter mais de um resultado. Adicionar também plate_description ao array de resultados.
                break; 

        }
        
        return person.length > 0? person : {error : "Nenhum resultado encontrado."}

    }

}