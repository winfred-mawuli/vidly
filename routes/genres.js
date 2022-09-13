const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

var bodyParser = require('body-parser');
  router.use(bodyParser.json());


const genreSchema = new mongoose.Schema({
  name :{
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  }
})

const Genre = new mongoose.model('Genre',genreSchema);




router.get('/', async (req, res) =>{
  const genres = await Genre.find().sort('name');
    res.send(genres);
  })
  
  router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if(!genre) return res.status(404).send("Genre wih the giving ID NOT FOUND");
    res.send(genre)
  });
  
  //getting POST request
  router.post('/', async (req, res) =>{
    const {error} = ValidateGenre(req.body)
    if(error) return res.status(404).send(error.details[0].message)
    
  
    let genre = new Genre({name:req.body.name})
    genre = await genre.save()
    res.send(genre)
  });
  
  //getting PUT request
  
  
  router.put('/:id', async (req, res)=>{
    const {error} = ValidateGenre(req.body)
    if(error) return res.status(404).send(error.details[0].message)

    let genre =Genre.findByIdAndUpdate(req.body.id,{name:req.body.name},{
      new:true
    })


    
    if(!genre) return res.status(404).send("GENRE NOT FOUND");
    res.send(genre);
  });
  
  //getting DELETE request
  router.delete('/:id', async(req, res) =>{
    const genre = await Genre.findByIdAndRemove(req.params.id)

      if(!genre) return res.status(404).send('GENRE NOT FOUND');
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
  exports.genreSchema =genreSchema;
  