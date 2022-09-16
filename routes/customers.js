const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

var bodyParser = require('body-parser');
  router.use(bodyParser.json());



//creating a mongoose model and parsing mongoose schema as it second argument
const Customer = new mongoose.model('Customer',mongoose.Schema({
  name :{
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  },
  isGold:{
    type: Boolean,
    default: false
  },
  phone :{
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50
  }
}));




//GET request
router.get('/', async (req, res) =>{
  
  const customer = await Customer.find().sort('name');
    res.send(customer);
  })
  
  router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if(!customer) return res.status(404).send("Customer wih the giving ID NOT FOUND");
    res.send(customer)
  });
  
  //getting POST request
  router.post('/', async (req, res) =>{
  //First validate the body of the request to see if it meets requirements
  // else display a 404 error to the client with the message details
    const {error} = ValidateCustomer(req.body)
    if(error) return res.status(404).send(error.details[0].message)
    
  
    let customer = new Customer({
        name:req.body.name,
        phone:req.body.phone,
        isGold:req.body.isGold
    })
    customer = await customer.save()
    res.send(customer)
  });


  //Getting a PUT request 
  router.put('/:id', async (req, res)=>{
     // validate the body of the request to see if it meets requirements
  // else display a 404 error to the client with the message details
    const {error} = ValidateCustomer(req.body)
    if(error) return res.status(404).send(error.details[0].message)

    let customer =Customer.findByIdAndUpdate(req.body.id,{name:req.body.name},{
      new:true
    })


    
    if(!customer) return res.status(404).send("CUSTOMER NOT FOUND");
    res.send(customer);
  });
  
  //getting DELETE request


  router.delete('/:id', async(req, res) =>{
      //first finds the id the and deletes it
  //else displays a 404 error to the client
    const customer = await Customer.findByIdAndRemove(req.params.id)

      if(!customer) return res.status(404).send('CUSTOMER NOT FOUND');
      res.send(customer);
  });
  


  //This is schema defined for the Joi validator
  const ValidateCustomer =(customer)=>{
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    }
        return Joi.validate(customer,schema);
    
    }

    module.exports = router;