import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { Termometro } from '../models/termometros.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TermometrosService {

  constructor(  private http: HttpClient) { }

  /** ================================================================
   *   GET TOKEN
  ==================================================================== */
  get token():string {
    return localStorage.getItem('token') || '';
  }

  /** ================================================================
   *   GET HEADERS
  ==================================================================== */
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  /** ================================================================
   *  LOAD TERMOMETROS
  ==================================================================== */
  loadTermometros(query: any){
    return this.http.post<{ok: boolean, termometros: Termometro[], total:number}>( `${base_url}/termometros/query`, query, this.headers );
  }

  /** ================================================================
   *  CREATE TERMOMETRO
  ==================================================================== */
  createTermometro( formaData: any ){
    return this.http.post<{termometro: Termometro, ok: boolean}>(`${base_url}/termometros`, formaData, this.headers);
  }

  /** ================================================================
   *  UPDATE TERMOMETRO
  ==================================================================== */
  updateTermometro( formData: any, id: string ){
    return this.http.put< { termometro: Termometro, ok: boolean } >(`${base_url}/termometros/${id}`, formData, this.headers);
  }

  /** ================================================================
   *  DELETE TERMOMETRO
  ==================================================================== */
  deleteTermometro( id: string ){
    return this.http.delete< { termometro: Termometro, ok: boolean } >(`${base_url}/termometros/${id}`, this.headers);
  }


}
