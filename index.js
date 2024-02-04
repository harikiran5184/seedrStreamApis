const express = require('express');
const axios = require('axios')
const bodyParser = require('body-parser');
const Seedr=require('seedr');
const seedr=new Seedr()
const app = express();
const port = 3000;

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
  res.render('movie', { movieId: movieId });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
