import { Component,OnInit, OnDestroy} from '@angular/core';
import { NotifyService } from './loader.service';
import { Subscription } from 'rxjs/Subscription';

declare var jQuery: any;

@Component({
  selector: 'app-root',
  template: `<div class="center" id="infinity-gif-div" [hidden]="!showLoader">
                <img src="../../assets/images/Infinity.gif" class="loader-image" />
             </div>
             <router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  subscription: Subscription;
  /* handels loaders visiblity. Initailly hidden */
  showLoader=false;

  constructor(private notifyService: NotifyService){
    console.log( "constructor AppComponent");
    this.subscription = this.notifyService.getLoader().subscribe( (data) => { 
      console.log( "Data: "+JSON.stringify(data)); 
      this.showLoader = data.show;
    } );

  }
  ngOnDestroy() {
    console.log( "constructor ngOnDestroy");
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
}


}
