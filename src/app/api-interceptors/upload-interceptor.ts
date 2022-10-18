import { finalize, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { empty, Observable, of, Subject } from 'rxjs';
import { SystemService } from '../services/system.service';
import { SSIpfs } from '../static-stack/ipfs';
import { StaticStackInterceptor } from './staticStackInterceptor';


@Injectable()
export class UploadInterceptor implements HttpInterceptor {
    constructor(public _router: Router,public systemSvc:SystemService) {
    }

    async getIpfsMeta(_file){
        var _cidIpfs=await SSIpfs.addFile(_file);
        return {
            ipfsHash:_cidIpfs.cid.toString(),
            fullName:_file.name
        }
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (
            req.url.startsWith("./api/Sys/upload") && this.systemSvc.isStaticAppOnly
        ) {
            var _file=req.body.get("file");
            return StaticStackInterceptor.staticStackResponseAsync(req,this.getIpfsMeta(_file));
            
        } else {
            return next.handle(req);
        }
        
    }
}