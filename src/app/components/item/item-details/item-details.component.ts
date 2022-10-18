import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { map, timeout } from 'rxjs/operators';
import { Category, Item } from 'src/app/api/models';
import { CatalogDataService } from 'src/app/services/catalog/catalog-data.service';
import { ImgService } from 'src/app/services/img.service';
import { UploadUtil } from 'src/app/shared/upload-util';

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss']
})
export class ItemDetailsComponent implements OnInit {

  constructor(public catalogDataSvc:CatalogDataService, public httpClient: HttpClient, public imgSvc: ImgService) { 

  }
  @Input() item:Item;
  imgItem: any;
  public text = "";
  public progress = 0;
  public meta = null;
  public file: Blob = null;

  categories:Category[];
  ngOnInit(): void {
    if (this.item && this.item.productIdNavigation.image) {
      this.onUploadImg(this.item.productIdNavigation.image, true);
    }
  }

  async changeImg(){
    var _self = this;
    var files = await UploadUtil.ChooseFileDialog();
    if (files.length > 0) {
      var _file = files[0];
      var _formData = new FormData();
      _formData.append("file", _file);
      this.progress = 0;
      this.text = "";
      this.httpClient.post<any>("./api/Sys/upload", _formData, {
        reportProgress: true,
        observe: 'events'
      }).pipe(timeout(5 * 60 * 1000))
        .pipe(map((event) => {

          switch (event.type) {

            case HttpEventType.UploadProgress:
              const progress = Math.round(100 * event.loaded / event.total!);
              return { status: 'progress', message: progress };

            case HttpEventType.Response:
              return event.body;
            default:
              return `Unhandled event: ${event.type} ${JSON.stringify(event)}`;
          }
        })
        )
        .subscribe(
          (res) => {
            console.log(res);
            if (res.status) {
              this.progress = res.message - 1;
            } else if (res.ipfsHash) {
              console.log(res.ipfsHash);
              this.text = res.ipfsHash;
              this.progress = 0;
              res.file = _file;
              _self.item.productIdNavigation.image = res.ipfsHash;
              // this.catalogDataSvc.saveItem(_self.item).then(function (d) {
              //   // _self.load = false;
              //   // _self.dialogRef.close();
              _self.onUploadImg(_self.item.productIdNavigation.image, true);
              // }).catch(function (e) {
              //   console.log(e);
              // });
            }
            //_self.onUploadImg(res, false);
          },
          (err) => {
            console.log(err);
          }
        );
    }
    console.log(files);
  }

  onUploadImg(metadata, hasIpfsHash) {
    if (hasIpfsHash) {
      this.imgItem = this.imgSvc.getBlobUrlFromHashAsync(metadata);
    } else {
      this.imgItem = this.imgSvc.getBlobUrlFromHashAsync(metadata.ipfsHash);
    }
    //this.formMerchantGroup.appIcon=metadata.ipfsHash;
  }
}
