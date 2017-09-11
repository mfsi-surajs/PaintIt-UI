import {XHRBackend, Http, RequestOptions} from "@angular/http";
import {HttpInterceptor} from "./http.interceptor";
// Shows Progress bar and notifications
import { NotifyService } from "./loader.service";

export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions,notifyService:NotifyService): Http {
    return new HttpInterceptor(xhrBackend, requestOptions,notifyService);
}