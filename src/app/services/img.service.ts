import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SSIpfs } from '../static-stack/ipfs';
import { SystemService } from './system.service';

@Injectable({
  providedIn: 'root'
})
export class ImgService {

  constructor(
    public domSanitizer:DomSanitizer,
    public httpClient:HttpClient,
    public systemSvc:SystemService
  ) { }

  public getBlobUrlFromImageBlob(blob){
    return this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
  }

  public getBlobUrlFromHashAsync(hash){
    return new Promise<any>(
      async (resolve,reject)=>{
        if (this.systemSvc.isStaticAppOnly){
          try {
            var blob=await SSIpfs.getImageBlobFromIpfs(hash);
            resolve(this.getBlobUrlFromImageBlob(blob));  
          } catch (error) {
            reject(error);
          }
          
        } else {
          this.httpClient.get("api/Sys/download/"+hash,{responseType:'arraybuffer'}).subscribe(
            (d)=>{
              try {
                let blob=new Blob([d],{type:'application/image'});
                resolve(this.getBlobUrlFromImageBlob(blob));  
              } catch (error) {
                reject(error);
              }
            },
            (e)=>{
              reject(e);
            }
          )
        }

      }
    );
  }


  public resizeImage(settings: IResizeImageOptions){
    const file = settings.file;
    const maxSize = settings.maxSize;
    const reader = new FileReader();
    const image = new Image();
    const canvas = document.createElement('canvas');
    const dataURItoBlob = (dataURI: string) => {
      const bytes = dataURI.split(',')[0].indexOf('base64') >= 0 ?
          atob(dataURI.split(',')[1]) :
          unescape(dataURI.split(',')[1]);
      const mime = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const max = bytes.length;
      const ia = new Uint8Array(max);
      for (var i = 0; i < max; i++) ia[i] = bytes.charCodeAt(i);
      return new Blob([ia], {type:mime});
    };
    const resize = () => {
      let width = image.width;
      let height = image.height;
  
      if (settings.height && settings.width){
        height =settings.height ;
        width = settings.width;
      } else {
        if (width > height) {
          if (width > maxSize) {
              height *= maxSize / width;
              width = maxSize;
          }
      } else {
          if (height > maxSize) {
              width *= maxSize / height;
              height = maxSize;
          }
      }
      }

  
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);
      let dataUrl = canvas.toDataURL('image/jpeg');
      return dataURItoBlob(dataUrl);
    };
  
    return new Promise((ok, no) => {
        if (!file.type.match(/image.*/)) {
          no(new Error("Not an image"));
          return;
        }
  
        reader.onload = (readerEvent: any) => {
          image.onload = () => ok(resize());
          image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(file);
    })    
  };

}

interface IResizeImageOptions {
  maxSize: number;
  width?:number;
  height?:number;
  file: File;
}