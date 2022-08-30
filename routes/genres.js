const express = require('express');
const router = express.Router();
const Joi = require('joi');


const genres= [
    {id : 1, name: "fiction"},
    {id : 2, name: "Narrative"},
    {id : 3, name: "Novel"},
    {id : 4, name: "Science Fiction"},
    {id : 5, name: "Fantasy"}
];

router.get('/', function (req, res) {
    res.send(genres);
  })
  
  router.get('/:id', (req, res) => {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("Genre wih the giving ID NOT FOUND");
    res.send(genre)
  });
  
  //getting POST request
  router.post('/', function (req, res) {
    const {error} = ValidateGenre(req.body)
    if(error) return res.status(404).send(error.details[0].message)
    
  
    const genre ={
      id: genres.length + 1,
      name: req.body.name
    }
    genres.push(genre)
    res.send(genre)
  });
  
  //getting PUT request
  var bodyParser = require('body-parser');
  router.use(bodyParser.json());
  
  router.put('/:id', function(req, res) {
    const genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("GENRE NOT FOUND");
  
    
    const {error} = ValidateGenre(req.body)
    if(error) return res.status(404).send(error.details[0].message)
    console.log(error)
  
    genre.name = req.body.name;
    res.send(genre);
  });
  
  router.delete('/:id', function(req, res) {
      const genre = genres.find(g => g.id === parseInt(req.params.id));
      if(!genre) return res.status(404).send('GENRE NOT FOUND');
  
      const index = genres.indexOf(genre)
      genres.splice(genre, 1);
  
      res.send(genre);
  });
  
  
  
  
  //Validate input of users
  const ValidateGenre =(genre)=>{
  const schema = {
      name: Joi.string()
      .min(3)
      .max(15)
      .required()
  }
      return Joi.validate(genre,schema);
  
  }

  module.exports = router