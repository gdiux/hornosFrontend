import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

// EXCEL
import * as XLSX from 'xlsx';

// CHARTS
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { BaseChartDirective } from 'ng2-charts';


// MODELS
import { Horno } from 'src/app/models/hornos.models';
import { Temperatura } from 'src/app/models/temperaturas.model';
import { Termometro } from 'src/app/models/termometros.model';

// SERVICES
import { HornosService } from 'src/app/services/hornos.service';
import { TemperaturasService } from 'src/app/services/temperaturas.service';
import { TermometrosService } from 'src/app/services/termometros.service';

@Component({
  selector: 'app-horno',
  templateUrl: './horno.component.html',
  styleUrls: ['./horno.component.css']
})
export class HornoComponent implements OnInit, OnDestroy {

  constructor(  private activatedRoute: ActivatedRoute,
                private hornosService: HornosService,
                private temperaturasService: TemperaturasService,
                private termometrosService: TermometrosService,
                private fb: FormBuilder){

                  activatedRoute.params.subscribe( ({id}) => { this.loadHorno(id) });

  }

  timer:any;

  ngOnInit(): void {

    this.loadTermometros();
    this.timer= this.interval();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  interval(){
    return setInterval( () => {
      this.activatedRoute.params.subscribe( ({id}) => { this.loadHorno(id) });      
    }, 30000)
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
   * LOAD HORNO
  ====================================================================== */
  public horno!: Horno;
  loadHorno(id: string){

    this.hornosService.loadHornoId(id)
        .subscribe( ({horno}) => {

          this.horno = horno;
          this.loadTemperaturas(horno.baja._id!, horno.alta._id!);

          this.formHorno.reset({
            name: this.horno.name,
            baja: this.horno.baja._id!,
            alta: this.horno.alta._id!
          })
          

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
  public datos: boolean = false;
  public labels: any[] = [];
  loadTemperaturas(baja: string, alta: string){    

    this.temperaturasService.loadTemperaturas( {termometro: alta, desde: 0, hasta: 20} )
    .subscribe( ({temperaturas}) => {
      this.altas = temperaturas;      

      if (temperaturas.length > 0) {
        this.loadAltas(temperaturas)        
      }      
      
    }, (err) => {
      console.log(err);
      Swal.fire('Error', err.error.msg);          
    })

    this.temperaturasService.loadTemperaturas( {termometro: baja, desde: 0, hasta: 20} )
        .subscribe( ({temperaturas}) => {

          this.bajas = temperaturas;

          if (temperaturas.length > 0) {
            this.loadBajas(temperaturas)        
          }

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg);          
        })
    

  }


  /** ======================================================================
   * CHAGEN ESTADO TEMPERATURAS
  ====================================================================== */
  changeEstado(temp: Temperatura, tipo: string){

    Swal.fire({
      title: "Estas seguro?",
      text: "De cambiar el estado de este registro!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, cambiar!",
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        
        if (temp.estado === 'Normal') {
          temp.estado = 'Anormal';
        }else if( temp.estado === 'Anormal' ){
          temp.estado = 'Normal';
        }
    
        this.temperaturasService.updateTemperatura({estado: temp.estado}, temp.teid!)
            .subscribe( ({temperatura}) => {
    
    
    
            }, (err) => {
              console.log(err);
              Swal.fire('Error', err.error.msg, 'error');          
            })

      }
    });
    
  }

  /** ======================================================================
   * LOAD TEMP ALTAS
  ====================================================================== */
  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  updateCharts(){
    this.charts.forEach((child) => {
        child.chart!.update()
    });
  }

  /** ======================================================================
   * LOAD TEMP ALTAS
  ====================================================================== */  
  public dataA: any[] = [];
  public labelsA: any[] = [];
  public datosAlta: boolean = false;
  loadAltas(temperaturas: Temperatura[]){

    this.dataA = [];
    this.labelsA = [];

    for (let i = 0; i < 10; i++) {
      let number =  10 - (i+1);
      const temperatura = temperaturas[number];

      let date = `${new Date(temperatura.fecha).getHours()}:${new Date(temperatura.fecha).getMinutes()}`;
      this.dataA.push(temperatura.temperatura);
      this.labelsA.push(date);
      
    }

    this.lineChartDataAlta.datasets[0].data = this.dataA;
    this.lineChartDataAlta.labels = this.labelsA;
    this.datosAlta = true;   

    this.updateCharts();

  }

  /** ======================================================================
   * CHARTS
  ====================================================================== */
  public lineChartDataAlta: any = {

    labels:[
      '1',
      '2',
      '3'
    ],
    
    datasets: [
      {
        data: [0],
        label: 'Termocupla Alta',
        fill: true,
        tension: 0.5,
        borderColor: 'rgba(245,39,39,0.8)',
        pointBackgroundColor: 'rgba(245,39,39,0.8)',
        backgroundColor: 'rgba(0,0,0,0.0)'
      },
    ]
  };

  /** ======================================================================
   * LOAD TEMP BAJA
  ====================================================================== */ 
 
  public dataB: any[] = [];
  public labelsB: any[] = [];
  public datosBaja: boolean = false;
  loadBajas(temperaturas: Temperatura[]){

    this.dataB = [];
    this.labelsB = [];

    for (let i = 0; i < 10; i++) {
      let number =  10 - (i+1);
      const temperatura = temperaturas[number];

      let date = `${new Date(temperatura.fecha).getHours()}:${new Date(temperatura.fecha).getMinutes()}`;
      this.dataB.push(temperatura.temperatura);
      this.labelsB.push(date);
      
    }

    this.lineChartDataBaja.datasets[0].data = this.dataB;
    this.lineChartDataBaja.labels = this.labelsB;
    this.datosBaja = true;       

    this.updateCharts();

  }

  /** ======================================================================
   * CHARTS BAJA
  ====================================================================== */
  public lineChartDataBaja: any = {

    labels:[
      '1',
      '2',
      '3'
    ],
    
    datasets: [
      {
        data: [0],
        label: 'Termocupla Baja',
        borderColor: 'rgba(39,123,245,0.8)',
        pointBackgroundColor: 'rgba(39,123,245,0.8)',
        fill: true,
        tension: 0.5,
        backgroundColor: 'rgba(0,0,0,0.0)'
      },
    ]
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: false
  };
  
  public lineChartLegend = true;


  /** ======================================================================
   * CREATE CENTER
  ====================================================================== */
  @ViewChild('modalNewUser') modalNewUser!: ElementRef;

  public formSubmitted: boolean = false;
  public formHorno = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    baja: 'none',
    alta: 'none',
  });

  updateHorno(){

    Swal.fire({
      title: 'Estas seguro?',
      text: "de editar este horno!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Cancelar',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, editar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.formSubmitted = true;   
    
        if (this.formHorno.invalid) {
          return;
        }

        if (this.formHorno.value.baja === 'none') {
          Swal.fire('Atención', 'Debes de seleccionar un termometro de baja', 'warning');
          return;
        }
        if (this.formHorno.value.alta === 'none') {
          Swal.fire('Atención', 'Debes de seleccionar un termometro de alta', 'warning');
          return;
        }

        if (this.formHorno.value.alta === this.formHorno.value.baja) {
          Swal.fire('Atención', 'Los termometros deben ser diferentes', 'warning');
          return;
        }

        this.hornosService.updateHorno(this.formHorno.value, this.horno.hid!)
        .subscribe( ({horno}) => {
          

          this.formSubmitted = false;
          
          Swal.fire('Estupendo', 'El nuevo horno se creo con exito!', 'success');

        }, (err) => { Swal.fire('Error', err.error.msg, 'error') });

      }
    })

  }

  /** ======================================================================
   * VALIDATE
  ====================================================================== */
  validate(campo: string): boolean{
    if (this.formHorno.get(campo)?.invalid && this.formSubmitted ) {
      return true;      
    }else{
      return false;
    }
  }

  /** ================================================================
   *   EXPORTAR EXCEL
  ==================================================================== */
  public loadingExcel: boolean = false;
  exportar(inicial:any, final: any, intervalo: any){
    
    if (inicial === null && final === null) {
      Swal.fire('Atención', 'Debes de seleccionar las fechas de busquedad', 'warning');  
      return;
    }
    
    this.loadingExcel = true;

    // let queryA = {
    //   termometro: this.horno.alta._id!,
    //   fechaInicio: new Date(inicial),
    //   fechaFin: new Date(final),
    //   fecha: { $gte: new Date(inicial), $lt: new Date(final) },
    //   intervalo: Number(intervalo),
    //   desde: 0,
    //   hasta: 10000
    // };

    let queryA = {
      termometro: this.horno.alta._id!,
      fechaInicio: new Date(inicial),
      fechaFin: new Date(final),
      intervalo: Number(intervalo)
    };
    
    let queryB = {
      termometro: this.horno.baja._id!,
      fechaInicio: new Date(inicial),
      fechaFin: new Date(final),
      intervalo: Number(intervalo)
    };

    let altas: any[] = [];
    let bajas: any[] = [];

    this.temperaturasService.loadTemperaturasInterval(queryA)
        .subscribe( ({temperaturas}) => {

          altas = temperaturas;

          this.temperaturasService.loadTemperaturasInterval(queryB)
          .subscribe( ({temperaturas}) => {

            bajas = temperaturas;
            this.loadingExcel = false;
            this.convertExcel(altas, bajas);

          }, (err) =>{
            console.log(err);
            Swal.fire('Error', err.error.msg, 'error');
            this.loadingExcel = false;     
          })
          

        }, (err) =>{
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');  
          this.loadingExcel = false;        
        })
    
  }

  convertExcel(altass: Temperatura[], bajass: Temperatura[]){

    const altas:Temperatura[]  = altass; 
    const bajas:Temperatura[]  = bajass; 

    /* generate a worksheet */
    let data: any[] = [];

    
    if (altas.length > bajas.length) {    

      for (let i = 0; i < altas.length; i++) {
        const alt = altas[i];
        const baja = bajas[i];

        if (bajas.length > i) {
          data.push({
            "Horno": this.horno.name,
            "Altas": alt.temperatura! + '°',
            "Estado A": alt.estado,
            "Fecha Alta": `${new Date(alt.fecha).getDate()}/${new Date(alt.fecha).getMonth() + 1}/${new Date(alt.fecha).getFullYear()} ${new Date(alt.fecha).getHours()}:${new Date(alt.fecha).getMinutes()}`,
            "Bajas": baja.temperatura + '°' || '',
            "Estado B": baja.estado,
            "Fecha Baja": `${new Date(baja.fecha).getDate()}/${new Date(baja.fecha).getMonth() + 1}/${new Date(baja.fecha).getFullYear()} ${new Date(baja.fecha).getHours()}:${new Date(baja.fecha).getMinutes()}`
          })

        }else{
          data.push({
            "Horno": this.horno.name,
            "Altas": alt.temperatura! + '°',
            "Estado A": alt.estado,
            "Fecha Alta": `${new Date(alt.fecha).getDate()}/${new Date(alt.fecha).getMonth() + 1}/${new Date(alt.fecha).getFullYear()} ${new Date(alt.fecha).getHours()}:${new Date(alt.fecha).getMinutes()}`,
          })
        }
        
        
      }

    }else{

      for (let i = 0; i < bajas.length; i++) {
        const alt = altas[i];
        const baja = bajas[i];

        if (altas.length > i) {
          data.push({
            "Horno": this.horno.name,
            "Altas": alt.temperatura! + '°',
            "Estado A": alt.estado,
            "Fecha Alta": `${new Date(alt.fecha).getDate()}/${new Date(alt.fecha).getMonth() + 1}/${new Date(alt.fecha).getFullYear()} ${new Date(alt.fecha).getHours()}:${new Date(alt.fecha).getMinutes()}`,
            "Bajas": baja.temperatura + '°' || '',
            "Estado B": baja.estado,
            "Fecha Baja": `${new Date(baja.fecha).getDate()}/${new Date(baja.fecha).getMonth() + 1}/${new Date(baja.fecha).getFullYear()} ${new Date(baja.fecha).getHours()}:${new Date(baja.fecha).getMinutes()}`
          })

        }else{
          data.push({
            "Horno": this.horno.name,
            "Bajas": baja.temperatura + '°' || '',
            "Estado B": baja.estado,
            "Fecha Baja": `${new Date(baja.fecha).getDate()}/${new Date(baja.fecha).getMonth() + 1}/${new Date(baja.fecha).getFullYear()} ${new Date(baja.fecha).getHours()}:${new Date(baja.fecha).getMinutes()}`
          })
        }
        
        
      }

    }    

    var ws = XLSX.utils.json_to_sheet(data);

    /* add to workbook */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, this.horno.name);

    let hoy = new Date();

    /* title */
    let title = `${new Date(hoy).getDate()}/${new Date(hoy).getMonth()+1}-temperaturas.xls`;

    /* write workbook and force a download */
    XLSX.writeFile(wb, title);

  }

}
