const { Router } = require('express');
const Person = require('./controllers/PersonController')
const Search = require('./controllers/SearchController')
const User = require('./controllers/UserController')
const express = require('express')


const routes = Router();

routes.post('/people', Person.store);
routes.get('/people',  Person.index);
routes.get('/search', User.verifyJWT, Search.findMatches);
routes.get('/searchField', User.verifyJWT, Search.findField);
routes.get('/getById', Search.getById);
routes.post('/updateOrAdd', User.verifyJWT, Person.updateOrAdd);
routes.post('/delete', User.verifyJWT, Person.deletePerson);
routes.post('/createUser', User.store);
routes.post('/login', User.login);


module.exports = routes;
