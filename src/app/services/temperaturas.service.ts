import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// MODELS
import { Temperatura } from '../models/temperaturas.model';

import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class TemperaturasService {

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
   *  LOAD TEMPERATURAS
  ==================================================================== */
  loadTemperaturas(query: any){
    return this.http.post<{ok: boolean, temperaturas: Temperatura[], total:number}>( `${base_url}/temperaturas/query`, query, this.headers );
  }

  /** ================================================================
   *  LOAD TEMPERATURAS
  ==================================================================== */
  loadTemperaturasInterval(query: any){
    return this.http.post<{ok: boolean, temperaturas: Temperatura[], total:number}>( `${base_url}/temperaturas/intervalo`, query, this.headers );
  }

  /** ================================================================
   *  CREATE TEMPERATURA
  ==================================================================== */
  createTemperatura( formaData: any ){
    return this.http.post<{temperatura: Temperatura, ok: boolean}>(`${base_url}/temperaturas`, formaData, this.headers);
  }

  /** ================================================================
   *  UPDATE TEMPERATURA
  ==================================================================== */
  updateTemperatura( formData: any, id: string ){
    return this.http.put< { temperatura: Temperatura, ok: boolean } >(`${base_url}/temperaturas/${id}`, formData, this.headers);
  }

  /** ================================================================
   *  DELETE TEMPERATURA
  ==================================================================== */
  deleteTemperatura( id: string ){
    return this.http.delete< { temperatura: Temperatura, ok: boolean } >(`${base_url}/temperaturas/${id}`, this.headers);
  }

}
