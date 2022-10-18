import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Option } from 'src/app/api/models';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-option-editor',
  templateUrl: './option-editor.component.html', 
  styleUrls: ['./option-editor.component.scss']
})
export class OptionEditorComponent implements OnInit {

  @Input() option:Option;
  @Output() onDeletedOption = new EventEmitter();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  alterStatus(status){
    this.option.status = status;
  }
  async deleteOption(){
    let translate=AppComponent.Instance.translate;
    let title=await translate.get("optionEditor.dlg.title").toPromise();
    let msg=await translate.get("optionEditor.dlg.msg").toPromise();
    var dialogData: ConfirmDialogModel ={
      title:title,
      message:msg+ this.option.productIdNavigation.name + '" ?',
      showCancel:true
    }
    var dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "80vw",
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(
      (ok) => {
        if (ok) {
          this.onDeletedOption.emit(this.option);
        }
      }
    )
  }
}
