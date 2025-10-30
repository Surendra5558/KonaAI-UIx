import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class commonModels {
   constructor() {

   } 
   
}
export const EndPoints = {
    GetUser: '/User/get',
    GetMenu: '/menu',
    loginUrl: '/Login'
   } 


export const APITypes = {
    api : 'apiBaseUrl',
    odata : 'ODataUrl',
    report : 'reportUrl',
    auth: 'authUrl'
}

export const AlertTypes = {
  ENTITY: 'Entity',
  TRANSACTION: 'Transaction',
  MULTI_TRANSACTION: 'Multi-Transaction'
};

export interface MetaData {
  rowId: string;  
  name: string;       
  description: string;  
  orderBy: number;      
}

