import { Component, OnInit} from "@angular/core";
import { createWiresService } from "selenium-webdriver/firefox";

import { PostModel } from "../post.model";
import { FormGroup, FormControl,Validators } from "@angular/forms";
import { PostService } from "../post.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { mimeType } from "./mime-type.validator";

@Component({
  selector:'app-post-create',
  templateUrl:'./post-create.component.html',
  styleUrls:['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  enteredTitle="";
  enteredContent="";
  isLoading=false;
  form:FormGroup;
  imagePreview:any;
  private mode="create";
  private postId:string;
  postModelObj:PostModel;
  constructor(public postService:PostService,public route:ActivatedRoute){

  }
  ngOnInit(){
    this.form=new FormGroup({
      'title':new FormControl(null,
          {validators:[Validators.required,Validators.minLength(3)]}),
      'content':new FormControl(null,
          {validators:[Validators.required]}),
      'image':new FormControl(null,
          {validators:[Validators.required],
          asyncValidators:[mimeType]})
    });
    this.route.paramMap.subscribe((paramMap:ParamMap)=>{
      if (paramMap.has('postId')) {
        this.mode="edit";
        this.postId=paramMap.get('postId');
        this.isLoading=true;
        this.postService.getEditPost(this.postId).subscribe(postData=>{
          this.isLoading=false;
          this.postModelObj={
            id:postData._id,title:postData.title,content:postData.content,imagePath:postData.imagePath};
          //this.imagePreview=this.postModelObj.imagePath;
          this.form.setValue({
            'title':this.postModelObj.title,
            'content':this.postModelObj.content,
            'image':null});
        });
    }
      else
      {
        this.mode="create";
        this.postId=null;
      }
    });
  }
onSavePost(){
  if (this.form.valid) {
    this.isLoading=true;
    const post :PostModel={
      id:null,
      title:this.form.value.title,
      content:this.form.value.content,
      imagePath:this.form.value.image
    };
    if (this.mode==="create") {
      this.postService.addPost(post.title,post.content,this.form.value.image);
    }
    else{
      post.id=this.postId;
      this.postService.updatePost(post.id,post.title,post.content,this.form.value.image);
    }
    this.form.reset();
  }
  else{
    return;
  }
}
onImagePicked(event:Event){
  const file=(event.target as HTMLInputElement).files[0];
  this.form.patchValue({'image':file});
  this.form.get('image').updateValueAndValidity();
  const reader=new FileReader();
  reader.onload=()=>{
    this.imagePreview=reader.result as string;
  };
  reader.readAsDataURL(file);
}
}
