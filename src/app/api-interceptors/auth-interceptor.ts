import { finalize, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Router } from '@angular/router';
import { empty, Observable, of, Subject } from 'rxjs';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(public _router:Router ) { 
    }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const started = Date.now();
        let ok: string;
     

        // extend server response observable with logging
        return next.handle(req)
            .pipe(
                tap(
                    // Succeeds when there is a response; ignore other events
                    (event) =>{
                        ok = event instanceof HttpResponse ? 'succeeded' : '';
                    } ,
                    // Operation failed; error is an HttpErrorResponse
                    (error) => {
                        ok = 'erro:'+ error.status;
                    }
                ),
                // Log when response observable either completes or errors
                finalize(() => {
                    if (ok=="erro:401"){
                        this._router.navigate(['/auth'])
                    }
                })
            );
    }
}