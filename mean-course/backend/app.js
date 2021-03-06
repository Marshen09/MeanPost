const express=require('express');
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const path=require("path");

const postRoute=require("./routes/posts")

const app=express();

mongoose.connect(
  "mongodb+srv://Marshen:bnUcX3VRnOusgBb1@clustermean-qmnto.mongodb.net/node-angular?retryWrites=true",
  {useNewUrlParser:true}
)
.then(()=>{
  console.log("Connected to Database");
})
.catch(()=>{
  console.log("Connection failed");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images",express.static(path.join("backend/images")));

app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,PATCH,DELETE,OPTIONS");
  next();
});

app.use('/api/posts',postRoute);

module.exports=app;
