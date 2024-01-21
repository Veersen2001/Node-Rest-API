const mongoose = require("mongoose") // user schema
const PostSchema = new mongoose.Schema(
  {
   userId:{
    type:String,
    required:true
   },
   desc:{
    type:String,
    max:50
   },
   img:{
      type:String
   },
   likes:{
    type:Array,
    default:[]
   },
   
  },
  // user Timestmps
  {timestamps: true}
)

module.exports = mongoose.model("Post", PostSchema)
