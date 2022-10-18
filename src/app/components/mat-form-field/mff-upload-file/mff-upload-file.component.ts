import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { map, timeout } from 'rxjs/operators';
import { UploadUtil } from 'src/app/shared/upload-util';

@Component({
  selector: 'app-mff-upload-file',
  templateUrl: './mff-upload-file.component.html',
  styleUrls: ['./mff-upload-file.component.less']
})
export class MffUploadFileComponent implements OnInit {
  

  constructor(
    public httpClient:HttpClient
  ) { }

  @Input() label: string;
  
  @Output() onComplete = new EventEmitter<any>();

  ngOnInit(): void {
  }

  public text="";
  public progress=0;
  public meta=null;
  public file:Blob=null;

  async uploadFile(){
    var files=await UploadUtil.ChooseFileDialog();
    if (files.length>0){
      var _file=files[0];
      var _formData=new FormData();
      _formData.append("file",_file);
      this.progress=0;
      this.text="";
      this.httpClient.post<any>("./api/Sys/upload",_formData,{
        reportProgress:true,
        observe:'events'
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
            this.progress=res.message-1;
          } else if (res.ipfsHash) {
            console.log(res.ipfsHash);
            this.text=res.ipfsHash;
            this.progress=0;
            res.file=_file;
            this.onComplete.next(res);
          }

        },
        (err) => {
          console.log(err);
        }
      );
    }
    console.log(files);
  }

}
