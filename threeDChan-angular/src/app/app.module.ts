import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ThreeDchanCoreModule } from './three-dchan-core/three-dchan-core.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ThreeDchanCoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
