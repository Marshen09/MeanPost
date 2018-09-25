import { PostModel } from "../posts/post.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators"
import { Title } from "@angular/platform-browser";
import { StaggerAst } from "@angular/animations/browser/src/dsl/animation_ast";
import { Router } from "@angular/router";

@Injectable({providedIn:'root'})
export class PostService{
  private posts:PostModel[]=[];
  private postUpdated=new Subject<PostModel[]>();
  constructor(private http:HttpClient,private router:Router){

  }
  getPost(postsPerPage:number,currentpage:number){
    const queryParams=`?postsPerPage=${postsPerPage}&currentpage=${currentpage}`;
    this.http
    .get<{message:string,posts:any}>('http://localhost:3000/api/posts'+queryParams)
    .pipe(map((postData)=>{
      return postData.posts.map((post)=>{
      return{
        title:post.title,
        content:post.content,
        id:post._id,
        imagePath:post.imagePath
      };
      })
    }))
    .subscribe((postGetData)=>{
      this.posts=postGetData;
      this.postUpdated.next([...this.posts]);
    });
  }
  getPostUpdateListener(){
    return this.postUpdated.asObservable();
  }
  getEditPost(postId:string){
    return this.http.get<{_id:string,title:string,content:string,imagePath:string}>('http://localhost:3000/api/posts/'+postId);
  }
addPost(title:string,content:string,image:File){
  const postData=new FormData();
  postData.append("title",title);
  postData.append("content",content);
  postData.append("image",image,title);
  this.http.post<{message:string,post:PostModel}>('http://localhost:3000/api/posts',postData)
  .subscribe((postData)=>{
    const post:PostModel={
      id:postData.post.id,title:title,content:content,imagePath:postData.post.imagePath};
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
    this.router.navigate(["/"]);
  });
}
updatePost(id:string,title:string,content:string,image:File|string){
  let post:PostModel|FormData;
  if (typeof(image)==="object") {
    post=new FormData();
    post.append("id",id);
    post.append("title",title);
    post.append("content",content);
    post.append("image",image,title);
  }
  else{
    post={
      id:id,
      title:title,
      content:content,
      imagePath:image
    }
  }
  this.http.put<{message:string}>("http://localhost:3000/api/posts/"+id,post)
  .subscribe((postData)=>{
    const updatedPost=[...this.posts];
    const oldPostIndex=updatedPost.findIndex(p=>p.id===id);
    const post:PostModel={
      id:id,
      title:title,
      content:content,
      imagePath:image
    }
    updatedPost[oldPostIndex]=post;
    this.posts=updatedPost;
    this.postUpdated.next([...this.posts]);
    this.router.navigate(["/"]);
  });
}
deletePost(id:string){
  this.http.delete("http://localhost:3000/api/posts/"+id)
  .subscribe((postResult)=>{
   const updatedPost=this.posts.filter(post=>post.id!=id);
   this.posts=updatedPost;
   this.postUpdated.next([...this.posts]);
  });
}
}

