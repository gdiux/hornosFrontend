import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// MODELS
import { Horno } from 'src/app/models/hornos.models';
import { Termometro } from 'src/app/models/termometros.model';

// SERVICES
import { HornosService } from 'src/app/services/hornos.service';
import { TermometrosService } from 'src/app/services/termometros.service';

@Component({
  selector: 'app-hornos',
  templateUrl: './hornos.component.html',
  styleUrls: ['./hornos.component.css']
})
export class HornosComponent implements OnInit {

  constructor(  private hornosService: HornosService,
                private fb: FormBuilder,
                private termometrosService: TermometrosService) {
    
  }

  ngOnInit(): void {

    this.loadHornos();
    this.loadTermometros();
    
  }

  /** ======================================================================
   * LOAD TERMOMETROS
  ====================================================================== */
  public termometros: Termometro[] = [];
  loadTermometros(){

    this.termometrosService.loadTermometros({desde: 0, hasta: 1000})
        .subscribe( ({termometros}) => {
          this.termometros = termometros;
        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

  /** ======================================================================
   * LOAD HORNOS
  ====================================================================== */
  public hornos: Horno[] = [];
  public hornosTemp: Horno[] = [];
  public total: number = 0;
  public query: any = {
    desde: 0,
    hasta: 50
  }

  loadHornos(){

    this.hornosService.loadHornos(this.query)
        .subscribe( ({hornos, total}) => {

          this.hornos = hornos;
          this.total = total;

        }, (err) => { Swal.fire('Error', err.error.msg, 'error') })

  }

  /** ======================================================================
   * CREATE CENTER
  ====================================================================== */
  @ViewChild('modalNewUser') modalNewUser!: ElementRef;

  public formNewSubmitted: boolean = false;
  public formNewHorno = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    baja: 'none',
    alta: 'none',
  });

  createHorno(){
       
    this.formNewSubmitted = true;   
    
    if (this.formNewHorno.invalid) {
      return;
    }

    if (this.formNewHorno.value.baja === 'none') {
      Swal.fire('Atención', 'Debes de seleccionar un termometro de baja', 'warning');
      return;
    }
    if (this.formNewHorno.value.alta === 'none') {
      Swal.fire('Atención', 'Debes de seleccionar un termometro de alta', 'warning');
      return;
    }

    if (this.formNewHorno.value.alta === this.formNewHorno.value.baja) {
      Swal.fire('Atención', 'Los termometros deben ser diferentes', 'warning');
      return;
    }

    this.hornosService.createHorno(this.formNewHorno.value)
    .subscribe( ({horno}) => {
      
      this.hornos.push(horno);
      
      this.formNewHorno.reset({
        name: '',
        baja: 'none',
        alta: 'none',
      });
      this.total ++;

      this.formNewSubmitted = false;
      
      Swal.fire('Estupendo', 'El nuevo horno se creo con exito!', 'success');

    }, (err) => { Swal.fire('Error', err.error.msg, 'error') });

  }

  /** ======================================================================
   * VALIDATE
  ====================================================================== */
  validate(campo: string): boolean{
    if (this.formNewHorno.get(campo)?.invalid && this.formNewSubmitted ) {
      return true;      
    }else{
      return false;
    }
  }

  /** ======================================================================
   * CHANGE PAGE
  ====================================================================== */
  cambiarPagina(desde: number){

    this.query.desde += Number(desde);

    if (this.query.desde < 0) {
      this.query.desde = 0;
    }

    this.loadHornos();

  }


  /** ======================================================================
   * SEARCH
  ====================================================================== */
  limiteChange(hasta: any){

    if(hasta){
      this.query.hasta = Number(hasta);
    }

    this.loadHornos();

  }

}
