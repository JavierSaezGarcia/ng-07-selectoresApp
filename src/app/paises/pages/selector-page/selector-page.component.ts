import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { Pais, PaisSmall } from '../../interfaces/paises.interface';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {


  constructor(private fb: FormBuilder,
              private paisesService: PaisesService) { }

  miFormulario: FormGroup = this.fb.group({
    region  : ['', Validators.required],
    pais    : ['', Validators.required],
    frontera: ['', Validators.required]
  });

  // Llenar selectores
  regiones :  string[]    = [];
  paises   :  PaisSmall[] = [];
  fronteras:  PaisSmall[] | undefined   = [];
  
  //UI
  cargando: boolean = false;

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;
    // -------------------------
    // Cuando cambie la región:
    // -------------------------
 
    // *** REFACTORIZAMOS ESTO CON OPERADORES DE RX JS!
    /*

    // this.miFormulario.get('region')?.valueChanges.subscribe(region => {
    //   console.log(region);

    //   this.paisesService.getPaisesPorRegion( region ).subscribe( paises => {
    //     this.paises = paises;
    //     console.log(paises)
    //   })
    // })

    */
    // CUANDO CAMBIA LA REGION /////////////////////////////////
    this.miFormulario
    .get('region')?.valueChanges
    // con pipe transformamos el valor
      // también permite:
      // --- disparar otras cosas mediante SwitchMap
      // --- disparar efectos secundarios mediante el tap
      // --- mutar la información con el map
      // --- etc
 
      // EL QUE ME INTERESA ES switchMap & tap
      // ==> Utilizamos el operador de RX: SwitchMap
      // SwitchMap: toma el valor producto de un Observable, lo muta y regresa el valor de otro Observable
      // ==> Utilizamos también tap
      // para lanzar el efecto secundario - recibimos la región, 
      // pero no es de nuestro interés (ponemos entonces como argumento del arrow function '_'), 
      // pero tomamos la propiedad 'pais' del formulario, y hacemos el reset de este campo (con .reset y asignamos string vacío)
      .pipe(
        tap( ( _ ) => {
          this.miFormulario.get('pais')?.reset('');
          this.cargando = true;
        }),        
        switchMap( (region) => this.paisesService.getPaisesPorRegion( region ))
      )
      .subscribe(paises => {
          this.paises = paises;
          this.cargando = false;
          
      })
    // CUANDO CAMBIA EL PAIS /////////////////////////////////
    this.miFormulario
      .get('pais')?.valueChanges
      .pipe(
        tap( () => {
           this.fronteras = [];
           this.miFormulario.get('frontera')?.reset('');
           this.cargando = true;
        }),
        // esto devuelve un pais a traves de su codigo
        switchMap( codigo => this.paisesService.getPaisPorCodigo( codigo )),
        switchMap( pais => this.paisesService.getPaisesPorCodigos(pais? pais![0]?.borders: []) )
      )
      .subscribe(paises => {
        
        //this.fronteras = pais? pais[0]?.borders:[];
        this.fronteras = paises;
        this.cargando = false;
    })

  }
  
  guardar() {
    console.log(this.miFormulario.value);
  }

}
