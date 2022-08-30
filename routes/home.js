const express =require('express')
const router = express.Router(); 


//getting GET request
router.get('/', (req, res) => res.render('index',{title:'My Vidly App', message:'Welcome to Vidly App'}))

module.exports = router;