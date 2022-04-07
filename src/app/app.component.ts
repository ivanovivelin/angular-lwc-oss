import { Component, HostListener } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import SampleTs from 'src/modules/c/sample-ts/sample-ts';
// import Sample from 'src/modules/c/sample/sample';
// "noImplicitAny": false

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  ngOnInit(): void {
    customElements.define('c-sample-ts', SampleTs.CustomElementConstructor);
  }

  @HostListener('notifyangular', ['$event'])
  
  onRouteChange(event: any) {
    console.log('notifyangular', event); // element that triggered event, in this case HTMLUnknownElement
  }

}
