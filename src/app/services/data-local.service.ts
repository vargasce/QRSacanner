import { Injectable, OnInit } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService implements OnInit {

    public guardado: Registro[] = [];

    constructor(
        private _storageService: Storage,
        private navCtrl: NavController,
        private iab: InAppBrowser
    ){ 
        this.init();
    }

    private async init(){
        const store = await this._storageService.create();
        this._storageService = store;
        this.cargarRegistros();
    }

    public async ngOnInit():Promise<void>{ }

    public async guardarRegistro( format: string, text: string ){
        await this.cargarRegistros();
        const nuevoRegistro = new Registro( format, text );
        this.guardado.unshift( nuevoRegistro );
        this._storageService.set( 'registros', this.guardado );

        this.abrirRegistro( nuevoRegistro );
    }

    public async cargarRegistros(){
        this.guardado = ( await this._storageService.get('registros') ) || [];
    }

    public abrirRegistro( registro: Registro ){
        this.navCtrl.navigateForward('/tabs/tab2');
        
        switch( registro.type ){
            case 'http':
                this.iab.create( registro.text, '_system' );
            break;

            case '':

            break;
        }
    }

}
