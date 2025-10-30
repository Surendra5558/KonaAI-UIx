import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { concat, Observable, throwError } from 'rxjs';
import { HttpConnecrService } from './http-connector.service';
import { ConfigLoaderService } from '../config/config-loader.service';

interface Headers {
  [key: string]: any;
  'Content-Type': any;  
  'X-XSS-Protection': any;
}
 

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  themeClient = '';
  public headers: any;
  configValues: any;

  constructor(
    private configsLoaderService: ConfigLoaderService,
    private httpConnecrService: HttpConnecrService,
  
  ) {
  
    
  }
 
  handleCorrelationId(correlationId: any) {
    //if correlationId is undefined creating a newguid
    if (correlationId === undefined || correlationId === null)
      //correlationId = this.commonService.generateGUID();
    // sessionStorage.setItem(
    //   this.commonModels.sessionStorageKeys.CorrelationID,
    //   correlationId,
    // );
    return correlationId;
  }
 
  newsetHeaders() {
    let token = sessionStorage.getItem(
     'token'
    );
    let correlationId = '';
    let headerObj: Headers = {
      'Content-Type': 'application/json' ,
      'X-XSS-Protection':  '1; mode=block'
    };
   
    
    //Passing Token in Headers
    if (token != null) {
      headerObj['Authorization'] =
        'Bearer ' + token;
    }
 
    var headers = new HttpHeaders(headerObj);
    let options = {
      headers: headers,
    };
    return options;
  }
  
  
 
  get(url: string, type?: string): Observable<any> {
    let baseUser = type ? this.configsLoaderService.getUrl(type) : this.configsLoaderService.apiBaseUrl;
    console.log("base url: "+baseUser);
    baseUser = baseUser + url;
    let options = this.newsetHeaders();
    return this.httpConnecrService.get(baseUser,options);
  }
  odataGet(url: string, type?: string): Observable<any> {
    //let baseUser = this.configsLoaderService.apiBaseUrl;
        let baseUser = type ? this.configsLoaderService.getUrl(type) : this.configsLoaderService.apiBaseUrl;

    baseUser = baseUser + url;
    let options = this.newsetHeaders();
    return this.httpConnecrService.get(baseUser, options);
  }
  post(url: string, obj: any, type?: string): Observable<any> {
   let baseUser = type ? this.configsLoaderService.getUrl(type) : this.configsLoaderService.apiBaseUrl;
    baseUser = baseUser + url;
   //let options = this.newsetHeaders();
    // if (!this.validateParams(obj)) {
    //   return concat(throwError('Invalid Data'));
    // }
    return this.httpConnecrService.post(baseUser, obj);
  }

 
  patch(url: string, obj: any, type?: string): Observable<any> {
   let baseUser = type ? this.configsLoaderService.getUrl(type) : this.configsLoaderService.apiBaseUrl;
    baseUser = baseUser + url;
    let options = this.newsetHeaders();
    if (!this.validateParams(obj)) {
      return concat(throwError('Invalid Data'));
    }
    return this.httpConnecrService.patch(baseUser, obj, options);
  }
 
  delete(url: string, type?: string ): Observable<any> {
    let baseUser = type ? this.configsLoaderService.getUrl(type) : this.configsLoaderService.apiBaseUrl;
    baseUser = baseUser + url;
    let options = this.newsetHeaders();
    return this.httpConnecrService.delete(baseUser, options);
  }
  
  
  errordetailspopup(Message: any, ErrorCode: any) {
    return Message.replace('{0}', ErrorCode);
  }
  ErrorDetailsHandle(Message: any, ErrorCode: any, CorrelationID: any) {
    let ErrorMessage = Message.replace('{0} :', '');
    let ErrCode = ErrorCode;
    let corelationId = CorrelationID;
    return {
      ErrorMessage: ErrorMessage,
      ErrorCode: ErrCode,
      CorrelationID: corelationId,
    };
  }
 
   validateParams(obj: any): boolean {
    let isValidParams = true;
    Object.values(obj).forEach((val: any) => {
      if (/<\/?[a-z][\s\S]*>/i.test(val.toString())) {
        isValidParams = false;
      }
    });
    return isValidParams;
  }
}
