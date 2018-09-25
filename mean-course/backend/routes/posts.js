const express=require("express");
const multer=require("multer");

const router=express.Router();

const PostMongoModel=require('../mongomodels/post');

const MIME_TYPE_MAP={
  'image/png':'png',
  'image/jpeg':'jpg',
  'image/jpg':'jpg'
}

const fileStorage=multer.diskStorage(
  {
    destination:(req,file,cb)=> {
      const isValid=MIME_TYPE_MAP[file.mimetype];
      let error=new Error("Invalid Mime Type");
      if(isValid)
      {
        error=null;
      }
      cb(null,"backend/images");
    },
    filename:(req,file,cb)=>{
      const name=file.originalname.toLocaleLowerCase().split(' ').join('-');
      const ext=MIME_TYPE_MAP[file.mimetype];
      cb(null,name+"-"+Date.now()+"."+ext);
    }
  });
router.post('',multer({storage:fileStorage}).single('image'),(req,res,next)=>{
  const imageUrl=req.protocol+"://"+req.get("host");
  const post=new PostMongoModel({
    title:req.body.title,
    content:req.body.content,
    imagePath:imageUrl+"/images/"+req.file.filename
  });
  post.save().then(result=>{
    res.status(201).json({
      message:"Posted successfully",
      post:{
        ...result,
        id:result._id
      }
    });
  });
});

router.put('/:id',multer({storage:fileStorage}).single('image'),(req,res,next)=>{
  let imagePath=req.body.imagePath;
  if (req.file) {
    const imageUrl=req.protocol+"://"+req.get("host");
    imagePath=imageUrl+"/images/"+req.file.filename;
  }
  const post=new PostMongoModel({
    _id:req.body.id,
    title:req.body.title,
    content:req.body.content,
    imagePath:imagePath
  });
  console.log(post);
  PostMongoModel.updateOne({_id:req.params.id},post)
  .then((result)=>{
    res.status(200).json({
      message:'Posts Updated Successfully!'
    });
  });
});

router.get('',(req,res,next)=>{
  const pageSize= +req.query.postsPerPage;
  const currentPage= +req.query.currentpage;
  const postQuery=PostMongoModel.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize*(currentPage-1))
    .limit(pageSize);
  }
 postQuery.then((documents)=>{
  res.status(200).json({
    message:'Posts Fetched Successfully!',
    posts:documents
  });
 });
});

router.delete('/:id',(req,res,next)=>{
  PostMongoModel.deleteOne({_id:req.params.id})
  .then((postResult)=>{
    res.status(200).json({
      message:'Posts Deleted Successfully!',
    });
  })
});

router.get('/:id',(req,res,next)=>{
  PostMongoModel.findById(req.params.id)
  .then((resultDoc)=>{
    if (resultDoc) {
      res.status(200).json(resultDoc);
    }
    else{
      res.status(400).json({message:"post not fount"});
    }
  });
});

module.exports=router;
