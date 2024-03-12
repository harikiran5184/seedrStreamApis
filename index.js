const express = require('express');
const axios = require('axios')
const bodyParser = require('body-parser');
const Seedr=require('seedr');
const fs = require('fs');
const seedr=new Seedr()
const app = express();
const port = 3000;
const mongoose=require('mongoose');
const movieModel = require('./models/movieModel');

const data=mongoose.connect('mongodb+srv://hari:hari@cluster0.1socvoq.mongodb.net/movierulz',{ useNewUrlParser: true, useUnifiedTopology: true }).then((res)=>{
  console.log("connected")
}).catch(()=>{
  console.log("connection failed")
})

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

async function getdata(){
  await seedr.getVideos().then(async (res)=>{
    if(res.length==0){
      getdata()
    }
    else{
      return res
    }
  })
}

app.post('/',async (req,res)=>{
  const {magnet,auth}=req.body
  const data=JSON.parse(auth)
    await seedr.login(data.email,data.password);
    console.log(JSON.parse(auth))
    // await seedr.addMagnet("magnet:?xt=urn:btih:0f6d62c4c5aa5d296ed9efad13489bc6efaf4c7d&dn=www.5MovieRulz.top%20-%20Animal%20(2023)%20Telugu%20DVDScr%20x264%20AAC%20300MB.mkv&tr=udp%3a%2f%2ftracker.openbittorrent.com%3a80%2fannounce&tr=udp%3a%2f%2ftracker.opentrackr.org%3a1337%2fannounce&tr=udp%3a%2f%2fp4p.arenabg.com%3a1337%2fannounce&tr=udp%3a%2f%2ftracker.torrent.eu.org%3a451%2fannounce&tr=udp%3a%2f%2ftracker.dler.org%3a6969%2fannounce&tr=udp%3a%2f%2fopen.stealth.si%3a80%2fannounce&tr=udp%3a%2f%2fopentracker.i2p.rocks%3a6969%2fannounce&tr=http%3a%2f%2ftracker.gbitt.info%3a80%2fannounce&tr=udp%3a%2f%2ftracker.tiny-vps.com%3a6969%2fannounce&tr=udp%3a%2f%2fmovies.zsw.ca%3a6969%2fannounce");
    // Starts downloading, wait till that happens
    var contents = await seedr.getVideos();
    let ne;
    
    if(contents.length==0){
      await seedr.addMagnet(magnet).finally(()=>{
        console.log("adding data....")
        res.json(true)
      })
      
    }
    else{
      return res.json(false)
    }
    
})
app.post('/del',async (req,res)=>{
  const {auth}=req.body
  console.log(JSON.parse(auth))
  const data = JSON.parse(auth)
  await seedr.login(data.email,data.password);
  var contents = await seedr.getVideos();
  if(contents.length>0){
    // var ne = await seedr.getFile(contents[0][0].id)
    console.log("deleting......")
    await seedr.deleteFolder(contents[0][0].fid).then(()=>{
      console.log("deleted....")
      return res.json({len:true})
    })
    
  }
  else{
    return res.json({len:true})
  }
  
  // await seedr.deleteFolder(contents[0][0].fid)
})
app.post('/fetchVideo',async (req,res)=>{
  const{auth}=req.body
  const data=JSON.parse(auth)
  await seedr.login(data.email,data.password);
  var contents = await seedr.getVideos();
  console.log(contents)
  if(contents.length>0){
    console.log("fetching......")
    let n=await seedr.getFile(contents[0][0].id).then((e)=>{
      console.log("fetched....")
      console.log(e)
      return res.json(e)
    })
    
  }
  else{
    return res.json(contents.length)
  }
})

app.post('/fetchVideoget',async (req,res)=>{
  const{auth}=req.body
  const data=JSON.parse(auth)
  await seedr.login(data.email,data.password);
  var contents = await seedr.getVideos();
  let videos=[]
  if(contents.length>0){
    console.log("fetching......")
    console.log(contents[0].length)
    for(var i=0;i<contents[0].length;i++){
    let n=await seedr.getFile(contents[0][i].id).then((e)=>{
      console.log("fetched....")
      e.id=i
      videos.push(e)
    })
  }
  console.log(videos.length)
  console.log("consoled")
  return res.json(videos)
  }
  else{
    return res.json(contents.length)
  }
})
app.get('/movierulz/:id', (req, res) => {
  const movieId = req.params.id;
  const queryParams = req.query;

  // Render the 'movie.ejs' template and pass data to it
  res.send(`
  <center>
  <h1>Movie Details</h1>
  <p>Movie ID: ${movieId}</p>
  <a href='movierulz://movie/${movieId.slice(0,movieId.length)}'>
      <button style="width: max-content;height: max-content;border-radius: 40px;background-color: rgba(194, 47, 153, 0.449);cursor:pointer">
          <h1>Open in App</h1>
      </button>
  </a>
  </center>`)})

app.get('/adminmovie/:id', (req, res) => {
  const movieId = req.params.id;
  const queryParams = req.query;
  console.log(movieId)
  // Render the 'movie.ejs' template and pass data to it
  res.send(`
  <center>
  <h1>Movie Details</h1>
  <p>Movie ID: ${movieId}</p>
  <a href='movierulz://adminmovie/${movieId}'>
      <button style="width: max-content;height: max-content;border-radius: 40px;background-color: rgba(194, 47, 153, 0.449);cursor:pointer">
          <h1>Open in App</h1>
      </button>
  </a>
  </center>
  `)
});

app.get('/version',(req,res)=>{
  const version="4.0.1";
  const link="https://drive.google.com/file/d/1hu5CuZyF2Yvn9hDj1Yxz4k6dhvioYZFd/view?usp=sharing";
  const whatsnews=['changes in bottom bar','Make it more responsive for some devices']
  res.json({version:version,link:link,whatsnews:whatsnews})
})
app.get('/live',(req,res)=>{
 const link="https://cricstreaming.github.io/Hindi"
  res.json({link:link})
})

app.get('/movies/:id',async (req,res)=>{
  const id=req.params.id
  console.log(id)
  const data=await movieModel.find({_id:id.toString()})
  console.log(data)
  res.json(data[0])
})

app.get('/allmovies',async (req,res)=>{
  const data=await movieModel.aggregate([
    {
  $project:{
  "description":0,
  "torrent":0,
  "__v":0
  }
  }
  ])

  res.json({data:data})
})

app.post('/addmovies',async (req,res)=>{
  const {description,image,title,torrent,size,quality,cast}=req.body
  const des=description
  const img= image
  const tle= title
  const cas=cast

const torr=[]
for(i=0;i<torrent.length;i++){
  try{
  var subdata={magnet:torrent[i],quality:quality[i],size:size[i]}
  torr.push(subdata)
  }
  catch{
    console.log("torrent error")
  }
}


const url= "https://ww3.5movierulz.vet/happy-ending-2024-dvdscr-telugu-full-movie-watch-online-free/"

  const data=await movieModel({description:des,image:img,title:tle,torrent:torr,url,cast:JSON.stringify(cas)})
  const added=await data.save()
  console.log(added._id)
  if(added._id){
    res.json({status:true})
  }
  else{
    res.json({status:false})
  }
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
