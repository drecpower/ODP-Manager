import { HttpHandler, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { DtoOauthRequest } from "src/app/api/models";
import { CryptoService } from "src/app/services/crypto.service";
import { getFakeRestControllerByName } from "./fake-controllers";
import { SSOrbitdb } from "./orbitdb";
import { SSUuid } from "./uuid";


export class SSRestBridge {
    public static manipulateFakeRestAsync(req: HttpRequest<any>, next: HttpHandler, started: number): Promise<any> {
        return new Promise<any>(
            async (resolve, reject) => {
                var spltd = req.url.split('/');
                var dbName = spltd[2];
                var lastPartOfUrl = spltd[spltd.length - 1];
                let fakeRestController = getFakeRestControllerByName(dbName);
                var dbdoc: any = await SSOrbitdb.GetDocInstance(dbName);
                console.log(dbdoc);
                if (req.method == "POST" || req.method == "PUT") {
                    if (req.body.id == undefined || req.body.id == null) {
                        req.body.id = SSUuid.GenerateV4();
                    }
                    if (fakeRestController) {
                        var postResponse = await fakeRestController.post(req.body);
                        resolve(postResponse);
                    } else {
                        var hash = await dbdoc.put(req.body, { pin: true });
                        resolve(req.body);
                    }
                }
                if (req.method == "DELETE") {
                    if (lastPartOfUrl != dbName) {
                        if (fakeRestController) {
                            try {
                                await fakeRestController.delete(lastPartOfUrl);
                                resolve(req.body);
                            } catch (error) {
                                reject();
                            }
                        }
                        else {
                            var hash = await dbdoc.del(lastPartOfUrl);
                            if (hash) {
                                resolve(req.body);
                            } else {
                                reject();
                            }
                        }
                    }
                }
                if (req.method == "GET") {
                    if (lastPartOfUrl != dbName) {
                        var objs = [];
                        if (spltd.length == 5) {
                            let queryField = spltd[3].endsWith("Id") ? spltd[3] : spltd[3] + "Id";
                            if (fakeRestController) {
                                objs = await fakeRestController.query(queryField, lastPartOfUrl);
                                resolve(objs);
                            } else {
                                let allobjs = dbdoc.get('');
                                objs = dbdoc.query((doc) => doc[queryField] == lastPartOfUrl);
                                resolve(objs);
                            }
                            return;
                        } else {
                            if (fakeRestController) {
                                objs = [await fakeRestController.get(lastPartOfUrl)];
                            } else {
                                objs = dbdoc.get(lastPartOfUrl);
                            }
                        }

                        if (objs.length > 0) {
                            resolve(objs[0]);
                        } else {
                            reject();
                        }
                    } else {
                        objs = dbdoc.get('');
                        resolve(objs);
                    }

                }
            }
        );
    }
}

