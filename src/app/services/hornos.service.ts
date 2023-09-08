import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// MODELS
import { Horno } from '../models/hornos.models';

// ENV
import { environment } from '../../environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HornosService {

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
   *  LOAD HORNOS
  ==================================================================== */
  loadHornos(query: any){
    return this.http.post<{ok: boolean, hornos: Horno[], total:number}>( `${base_url}/hornos/query`, query, this.headers );
  }

  /** ================================================================
   *  LOAD HORNOS
  ==================================================================== */
  loadHornoId(id: string){
    return this.http.get<{ok: boolean, horno: Horno}>( `${base_url}/hornos/${id}`, this.headers );
  }

  /** ================================================================
   *  LOAD HORNOS
  ==================================================================== */
  loadHornoDashboard(){
    return this.http.get<{ok: boolean, hornos: Horno[], total: number}>( `${base_url}/hornos/dashboard/temp`, this.headers );
  }

  /** ================================================================
   *  CREATE HORNO
  ==================================================================== */
  createHorno( formaData: any ){
    return this.http.post<{horno: Horno, ok: boolean}>(`${base_url}/hornos`, formaData, this.headers);
  }

  /** ================================================================
   *  UPDATE HORNO
  ==================================================================== */
  updateHorno( formData: any, id: string ){
    return this.http.put< { horno: Horno, ok: boolean } >(`${base_url}/hornos/${id}`, formData, this.headers);
  }

  /** ================================================================
   *  DELETE HORNO
  ==================================================================== */
  deleteHorno( id: string ){
    return this.http.delete< { horno: Horno, ok: boolean } >(`${base_url}/hornos/${id}`, this.headers);
  }
}
