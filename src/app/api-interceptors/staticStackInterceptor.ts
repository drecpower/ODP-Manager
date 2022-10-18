import { finalize, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { empty, Observable, of, Subject } from 'rxjs';
import { SystemService } from '../services/system.service';
import { SSAuthentication } from '../static-stack/authentication';
import { SSRestBridge } from '../static-stack/restbridge';




@Injectable()
export class StaticStackInterceptor implements HttpInterceptor {
    constructor(
        //Injections
        public _router:Router,
        public systemSvc:SystemService
        ) { 
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const started = Date.now();
        if (this.systemSvc.isStaticAppOnly){
            return this.staticStackManipulator(req,next,started)
        } else {
            return next.handle(req);
        }
    }


    staticStackManipulator(req: HttpRequest<any>, next: HttpHandler, started: number):Observable<HttpResponse<any>> {
        if (req.url.startsWith("./api/Authentication/oauth/token")){
            return StaticStackInterceptor.staticStackResponseAsync(req, SSAuthentication.getOauthTokenAsync(req.body) );
        } 
        else if (
                req.url.startsWith("./api/Order/")
            ){
                return <any>next.handle(req);
        }
        else if (
            req.url.startsWith("http")
        ){
            return <any>next.handle(req);
    }
        else if (
            req.url.startsWith("./api/Sys/upload")
        ){
            return <any>next.handle(req);
    }
        else {
            //return this.staticStackResponse(req,[]);
            return StaticStackInterceptor.staticStackResponseAsync(req,  SSRestBridge.manipulateFakeRestAsync(req,next,started) );
        }
    }

    public static staticStackResponse(req:HttpRequest<any>,obj:any){
        var httpres=new HttpResponse({
            body:obj,
            status:200,
            url:req.url,
            statusText:'OK',
        });
        var subj=(new Subject<HttpResponse<any>>());
        setTimeout(() => {
            subj.next(httpres)
            subj.complete()
        }, 10);
        return subj.asObservable();
    }

    public static staticStackResponseAsync(req:HttpRequest<any>,obj:Promise<any>){
        var subj=(new Subject<HttpResponse<any>>());
        obj.then(
            (d)=>{
                var httpres=new HttpResponse({
                    body:d,
                    status:200,
                    url:req.url,
                    statusText:'OK',
                });
                subj.next(httpres);
                subj.complete();
            }
        )
        return subj.asObservable();
    }
}