import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

// MODELS
import { Horno } from 'src/app/models/hornos.models';

// SERVICES
import { HornosService } from 'src/app/services/hornos.service';
import { TemperaturasService } from 'src/app/services/temperaturas.service';
import { Temperatura } from 'src/app/models/temperaturas.model';

@Component({
  selector: 'app-horno',
  templateUrl: './horno.component.html',
  styleUrls: ['./horno.component.css']
})
export class HornoComponent implements OnInit {

  constructor(  private activatedRoute: ActivatedRoute,
                private hornosService: HornosService,
                private temperaturasService: TemperaturasService,
                private fb: FormBuilder){

                  activatedRoute.params.subscribe( ({id}) => { this.loadHorno(id) });

  }

  ngOnInit(): void {
    
  }

  /** ======================================================================
   * LOAD HORNO
  ====================================================================== */
  public horno!: Horno;
  loadHorno(id: string){

    this.hornosService.loadHornoId(id)
        .subscribe( ({horno}) => {

          this.horno = horno;

          this.loadTemperaturas(horno.baja._id!, horno.alta._id!);
          

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ======================================================================
   * LOAD TEMPERATURAS
  ====================================================================== */
  public bajas: Temperatura[] = [];
  public altas: Temperatura[] = [];
  loadTemperaturas(baja: string, alta: string){

    this.temperaturasService.loadTemperaturas( {termometro: baja, desde: 0, hasta: 50} )
        .subscribe( ({temperaturas}) => {

          this.bajas = temperaturas;

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg);          
        })

    this.temperaturasService.loadTemperaturas( {termometro: alta, desde: 0, hasta: 50} )
    .subscribe( ({temperaturas}) => {
      this.altas = temperaturas;
      
    }, (err) => {
      console.log(err);
      Swal.fire('Error', err.error.msg);          
    })
    

  }

}
