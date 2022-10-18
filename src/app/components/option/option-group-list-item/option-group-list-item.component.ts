import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OptionGroupProduct } from 'src/app/api/models';
import { OptionGroupProductEditorComponent } from '../option-group-product-editor/option-group-product-editor.component';

@Component({
  selector: 'app-option-group-list-item',
  templateUrl: './option-group-list-item.component.html',
  styleUrls: ['./option-group-list-item.component.scss']
})
export class OptionGroupListItemComponent implements OnInit {

  @Input() ogp: OptionGroupProduct;
  constructor(public dialog: MatDialog) { }
  @Output() onDeletedOptionGroup = new EventEmitter();
  ngOnInit(): void {
  }

  edit() {

    var dialogRef = this.dialog.open(OptionGroupProductEditorComponent, {
      width: "70vw",
      height: "100vw",
      position: { right: '0' },
      data: this.ogp
    });
    dialogRef.afterClosed().subscribe(
      (result) => {
        console.log(result);
        if (result) {
          this.ogp = result;
        }
      },
      (error) => {
        console.error(error);
      }
    )
  }

  delete() {
    this.onDeletedOptionGroup.emit(this.ogp);
  }
}
