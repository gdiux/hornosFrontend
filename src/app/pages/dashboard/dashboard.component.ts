import { Component, OnInit } from '@angular/core';
import { Horno } from 'src/app/models/hornos.models';
import { HornosService } from 'src/app/services/hornos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(  private hornosService: HornosService){}

  ngOnInit(): void {
    this.loadHornos();
  }

  /** ================================================================
   *  LOAD HORNOS
  ==================================================================== */
  public hornos: Horno[] = [];
  public total: number = 0;
  loadHornos(){

    this.hornosService.loadHornoDashboard()
        .subscribe( ({hornos, total}) => {

          this.hornos = hornos;
          this.total = total;
          

        }, (err) => {
          console.log(err);
          Swal.fire('Error', err.error.msg, 'error');          
        })

  }

}
