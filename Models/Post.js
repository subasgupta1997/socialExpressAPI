const mangoose = require("mongoose");

const PostSchema = new mangoose.Schema(
  {
    userId:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
        max:500
    },
    img:{
        type:String,
    },
    likes:{
        type:Array,
        default:[]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mangoose.model("Post", PostSchema);
