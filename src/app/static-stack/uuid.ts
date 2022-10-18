

import { HttpHandler, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { DtoOauthRequest } from "src/app/api/models";
import { CryptoService } from "src/app/services/crypto.service";
import { SSOrbitdb } from "./orbitdb";


    export class SSUuid {
        public static GenerateV4(){
            return window["__uuidv4"]();
        }
    }

