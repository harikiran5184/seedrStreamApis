const mongoose=require('mongoose')

const movieSchema=mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    torrent:{
        type:Array,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    cast:{
        type:String,
        required:true
    }
})

let movie=module.exports=mongoose.model('MovieModel',movieSchema)