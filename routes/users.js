const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
// update the user
  router.put("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin)
    {       
         // password updated
         if(req.body.password){
            try{
               const salt = await bcrypt.genSalt(10);
               req.body.password = await bcrypt.hash(req.body.password,salt);
            }
            catch(err)
            {
               return res.status(500).json(err);
            }
         }

         // anything will be updated
         try{
            const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body});
            res.status(200).json('Account has been updated');
         }
         catch(err)
         {
            return res.status(500).json(err)

         }
    }
    else{
      return res.status(403).json("You can update only your account!");
    }
  });


//   delete user

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
   
    try {
      const user = await User.findByIdAndDelete(req.params.id)
      res.status(200).json("Account has been deleted")
    } catch (err) {
      return res.status(500).json(err)
    }
   } 
   else {
    return res.status(403).json("You can delete only your account!")
   }
})

// get user
router.get("/:id",async (req,res)=>{
   try{
      const user = await User.findById(req.params.id);

      // only get important data 
      // don't need password and timestamp
      const {password,updatedAt,...other}=user._doc;
       
      res.status(200).json(other);
   }
   catch(err)
   {
      return res.status(500).json(err);
   }
});

// follow a user

  router.put("/:id/follow", async(req,res)=>{
   // both users does not same
   if(req.body.userId !== req.params.id)
   {
      try{
         const user = await User.findById(req.params.id);
         const currentUser = await User.findById(req.body.userId);      
         if(!user.followers.includes(req.body.userId)){
            
            // push in followers id
            await user.updateOne({$push: { followers:req.body.userId}});

            // add following user

              await currentUser.updateOne({$push: {followings: req.params.id}})


              res.status(200).json("user has been followed");

         }
         // if both id same 
         else{
            res.status(403).json("you already follow this user");
         }
      }
      catch(err)
      {
         return res.status(500).json(err);
      }
   }
   else{
      res.status(403).json("you can not fellow yourself");
   }
  })


//   unfollow user

  router.put("/:id/unfollow", async (req, res) => {
    // both users does not same
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id)
        const currentUser = await User.findById(req.body.userId)
        if (user.followers.includes(req.body.userId)) {
          // push in followers id
          await user.updateOne({$pull: {followers: req.body.userId}})

          // add following user

          await currentUser.updateOne({$pull: {followings: req.params.id}})

          res.status(200).json("user has been unfollowed")
        }
        // if both id same
        else {
          res.status(403).json("you don't unfollow this user")
        }
      } catch (err) {
        return res.status(500).json(err)
      }
    } else {
      res.status(403).json("you can not unfellow yourself")
    }
  })





module.exports = router;
// we can use type="module" in package.json and use import and export 