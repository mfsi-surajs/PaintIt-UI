import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class NotifyService {

    /* @param data.show holds loader visibility. */
    private data = {"show" : false};
    
    /* Subject to subscribe for loader visibility. */
    private subject = new Subject<any>();

    /* Function called to make loader visible. */
    showPreloader(){
        this.data.show = true;
        //console.log("NotifyService: showPreloader");
        this.subject.next(this.data);
    }

    /* Function called to make loader hidden. */
    hidePreloader(){
        this.data.show = false;
        //console.log("NotifyService: hidePreloader");
        this.subject.next(this.data);

    }

    /* Function returns Observable to be subscribed for Loader visibility. */
    getLoader(): Observable<any>{
        return this.subject.asObservable();
    }
}