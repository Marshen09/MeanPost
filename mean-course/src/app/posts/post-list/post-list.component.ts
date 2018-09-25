import { Component,OnInit, OnDestroy} from "@angular/core";
import { Subscription } from "rxjs";
import { PageEvent } from "@angular/material";

import { PostModel  } from "../post.model";
import { PostService } from "../post.service";

@Component({
  selector:'app-post-list',
  templateUrl:'./post-list.component.html',
  styleUrls:['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy{
  posts:PostModel[]=[];
  isLoading=false;
  totalposts=10;
  postsPerPage=2;
  currentpage=1;
  pageSizeOptions=[1,2,5,10];
  private postSubscription:Subscription;

  constructor(public postService:PostService){
  }
  ngOnInit(){
    this.postService.getPost(this.postsPerPage,this.currentpage);
    this.isLoading=true;
    this.postSubscription=this.postService.getPostUpdateListener()
    .subscribe((posts:PostModel[])=>{
      this.isLoading=false;
      this.posts=posts;
    });
  }
  ngOnDestroy(){
    this.postSubscription.unsubscribe();
  }
  onDelete(reqId:string){
    if (reqId!=null) {
      this.postService.deletePost(reqId);
    }
  }
  onPageChange(pageData:PageEvent){
  console.log(pageData);
  this.currentpage=pageData.pageIndex+1;
  this.postsPerPage=pageData.pageSize;
  this.postService.getPost(this.postsPerPage,this.currentpage);
  }
 }
