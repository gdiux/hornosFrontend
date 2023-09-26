import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// MODELS
import { Termometro } from 'src/app/models/termometros.model';

// SERVICES
import { TermometrosService } from 'src/app/services/termometros.service';

@Component({
  selector: 'app-termometros',
  templateUrl: './termometros.component.html',
  styleUrls: ['./termometros.component.css']
})
export class TermometrosComponent implements OnInit {

  constructor(  private termometrosService: TermometrosService,
                private fb: FormBuilder){}

  ngOnInit(): void {

    this.loadTermometros();

  }

  /** ======================================================================
   * LOAD TERMOMETROS
  ====================================================================== */
  public termometros: Termometro[] = [];
  public termometrosTemp: Termometro[] = [];
  public total: number = 0;
  public query: any = {
    desde: 0,
    hasta: 50
  }

  loadTermometros(){

    this.termometrosService.loadTermometros(this.query)
        .subscribe( ({termometros, total}) => {

          this.termometros = termometros;
          this.total = total;

        }, (err) => { Swal.fire('Error', err.error.msg, 'error') })

  }

  /** ======================================================================
   * CREATE CENTER
  ====================================================================== */
  @ViewChild('modalNewUser') modalNewUser!: ElementRef;

  public formNewSubmitted: boolean = false;
  public formNewTermometro = this.fb.group({
    code: ['', [Validators.required, Validators.minLength(1)]],
  });

  createTermometro(){
       
    this.formNewSubmitted = true;   
    
    if (this.formNewTermometro.invalid) {
      return;
    }

    this.termometrosService.createTermometro(this.formNewTermometro.value)
    .subscribe( ({termometro}) => {
      
      this.termometros.push(termometro);
      
      this.formNewTermometro.reset({
        code: '',
      });
      this.total ++;

      this.formNewSubmitted = false;
      
      Swal.fire('Estupendo', 'La nueva termocupula se creo con exito!', 'success');

    }, (err) => { Swal.fire('Error', err.error.msg, 'error') });

  }

  /** ======================================================================
   * VALIDATE
  ====================================================================== */
  validate(campo: string): boolean{
    if (this.formNewTermometro.get(campo)?.invalid && this.formNewSubmitted ) {
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

    this.loadTermometros();

  }


  /** ======================================================================
   * SEARCH
  ====================================================================== */
  limiteChange(hasta: any){

    if(hasta){
      this.query.hasta = Number(hasta);
    }

    this.loadTermometros();

  }
  
}
