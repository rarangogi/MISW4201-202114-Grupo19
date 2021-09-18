import { Component, OnInit } from '@angular/core';
import { Cancion, Genero } from '../cancion';
import { CancionService } from '../cancion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ThrowStmt } from '@angular/compiler';
import { GENEROS_CANCION } from '../cancion.constants';

@Component({
  selector: 'app-cancion-list',
  templateUrl: './cancion-list.component.html',
  styleUrls: ['./cancion-list.component.css']
})
export class CancionListComponent implements OnInit {

  constructor(
    private cancionService: CancionService,
    private routerPath: Router,
    private router: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  userId: number
  token: string
  canciones: Array<Cancion> = []
  mostrarCanciones: Array<Cancion>
  cancionSeleccionada: Cancion
  indiceSeleccionado: number = 0
  filteredCanciones: Cancion[] = [];
  busqueda: string = '';


  // Pendiente: Hay que dejarlo en la deficion de la clase para no repetirlo aqui
  generos:Array<Genero> = [
    {
      llave: "TODAS", valor: 0
    },
    ...GENEROS_CANCION
  ];

  public filtro: any = '';



  get cancionesFiltered(): Cancion[] {
    let _canciones;

    // Filtro por genero
    if (this.filtro === '' || this.filtro === 'TODAS') {
      _canciones = this.canciones;
    } else {
      _canciones = this.canciones.filter(cancion => cancion.genero === this.filtro);
    }

    // Filtro por busqueda
    return _canciones.filter(cancion => {
      if(this.busqueda !== '') {
        return cancion.titulo.toLocaleLowerCase().includes(this.busqueda.toLocaleLowerCase()) || cancion.interprete.toLocaleLowerCase().includes(this.busqueda.toLocaleLowerCase());
      } else {
        return cancion
      }
    })
  }



  ngOnInit() {
    if(!parseInt(this.router.snapshot.params.userId) || this.router.snapshot.params.userToken === " "){
      this.showError("No hemos podido identificarlo, por favor vuelva a iniciar sesión.")
    }
    else{
      this.userId = parseInt(this.router.snapshot.params.userId)
      this.token = this.router.snapshot.params.userToken
      this.getCanciones();
    }
  }

  getCanciones():void{
    this.cancionService.getCanciones()
    .subscribe(canciones => {
      this.canciones = canciones
      this.canciones = this.canciones.sort((a, b) => (a.titulo < b.titulo ? -1 : 1))//canciones
    })
  }

  onSelect(cancion: Cancion, indice: number){
    this.indiceSeleccionado = indice
    this.cancionSeleccionada = cancion
    this.cancionService.getAlbumesCancion(cancion.id)
    .subscribe(albumes => {
      this.cancionSeleccionada.albumes = albumes
    },
    error => {
      this.showError(`Ha ocurrido un error: ${error.message}`)
    })

  }

  buscarCancion(busqueda: string) {
    this.busqueda = busqueda.trim();
  }

  eliminarCancion(){
    this.cancionService.eliminarCancion(this.cancionSeleccionada.id)
    .subscribe(cancion => {
      this.ngOnInit()
      this.showSuccess()
    },
    error=> {
      this.showError("Ha ocurrido un error. " + error.message)
    })
  }


  irCrearCancion(){
    this.routerPath.navigate([`/canciones/create/${this.userId}/${this.token}`])
  }

  showError(error: string){
    this.toastr.error(error, "Error de autenticación")
  }

  showSuccess() {
    this.toastr.success(`La canción fue eliminada`, "Eliminada exitosamente");
  }

}
