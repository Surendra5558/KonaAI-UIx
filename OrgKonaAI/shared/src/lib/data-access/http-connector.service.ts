import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

 
@Injectable({
    providedIn: 'root'
})
export class HttpConnecrService{
    message: string = '';
    constructor(private httpClient: HttpClient){
 
    }
 
    get(url: string,options?:any){
     return this.httpClient.get(url,options)
     //.pipe(catchError(this.handleError))
    }
 
    post(url: string,obj:any,options?:any){
      return this.httpClient.post(url,obj)
     }
 
     patch(url: string,obj:any,option?:any){
       return this.httpClient.patch(url,obj,option)
     }
 
     delete(url: string,options:any){
        return this.httpClient.delete(url,options)
       
       }
   
    handleError(error:HttpErrorResponse){
       if(error && error.status){
           if( error.status == 404){
               this.message = "Page not fount";
           }
       }
        return throwError(this.message || "server error.");
    }
   
}