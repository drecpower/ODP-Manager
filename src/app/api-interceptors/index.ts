/* "Barrel" of Http Interceptors */
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './auth-interceptor';
import { OrdersInterceptor } from './orders-interceptor';

import { StaticStackInterceptor } from './staticStackInterceptor';
import { UploadInterceptor } from './upload-interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: StaticStackInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: UploadInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: OrdersInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
];