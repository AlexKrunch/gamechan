import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { GameChanCoreModule } from './gamechan-core/gamechan-core.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    GameChanCoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
