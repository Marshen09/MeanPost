import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { interpolate } from '@angular/core/src/view';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatInputModule,MatCardModule,MatButtonModule,MatToolbarModule,MatExpansionModule,
    MatProgressSpinnerModule,MatPaginatorModule
   } from '@angular/material';
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { HeaderComponent } from "./posts/header/header.component";
import { PostListComponent } from './posts/post-list/post-list.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent
  ],
  imports: [
    BrowserModule,AppRoutingModule,ReactiveFormsModule,BrowserAnimationsModule,MatInputModule,MatCardModule,
    MatButtonModule,MatButtonModule,MatToolbarModule,MatExpansionModule,HttpClientModule,
    MatProgressSpinnerModule,MatPaginatorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
