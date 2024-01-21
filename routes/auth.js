const router = require("express").Router();
const User = require('../models/User');
// for the password encryption
const bcrypt = require('bcrypt');



// register User
router.post("/register", async(req, res) => {
  
  try{
    //  password Encryption 
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password,salt);    
      
          // create new user
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
        })

      // save to the schema
      const user = await newUser.save();
      // data in JSON
      res.status(200).json(user);
  }
  catch(err){
    res.status(500).json(err)
      
  }
    
});


// Login user

router.post("/login", async(req,res)=>{
  try{
    // find email
   const user = await  User.findOne({email:req.body.email});
    // if email not found
    !user && res.status(404).json("user Not Found");


    // For the password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
      !validPassword && res.status(400).json("Password is wrong");

      res.status(200).json(user);
  }
  catch(err)
  {
    res.status(500).json(err);
  }
})
  
module.exports = router
// we can use type="module" in package.json and use import and export
