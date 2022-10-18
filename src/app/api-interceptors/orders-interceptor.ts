import { finalize, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { empty, Observable, of, Subject } from 'rxjs';
import { SystemService } from '../services/system.service';


@Injectable()
export class OrdersInterceptor implements HttpInterceptor {
    constructor(public _router: Router,public systemSvc:SystemService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (
            req.url.startsWith("/api/Order/") && this.systemSvc.isStaticAppOnly
        ) {
            var _url = "http://localhost:5075" + req.url;//Temporary order interceptor that link to Dotnet Core Kestrel Development Server
            return <any>next.handle(req.clone({ url: _url }));
        } else {
            return next.handle(req);
        }
        
    }
}