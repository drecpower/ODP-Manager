import { Component, OnInit } from '@angular/core';
import { LeftBarMenuComponent } from 'src/app/components/left-bar-menu/left-bar-menu.component';
import { SystemService } from 'src/app/services/system.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.less']
})
export class HelpComponent implements OnInit {

  constructor(
    public systemSvc:SystemService
  ) { }

  ngOnInit(): void {
    this.showTextOnMenus();
  }
  showTextOnMenus() {
    setTimeout(() => {
      LeftBarMenuComponent.instance.showText=true;
    }, 1000);
  }

}
