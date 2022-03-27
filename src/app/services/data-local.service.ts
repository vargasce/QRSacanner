import { Injectable, OnInit } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService implements OnInit {

    public guardado: Registro[] = [];

    constructor(
        private _storageService: Storage,
        private navCtrl: NavController,
        private iab: InAppBrowser,
        private file: File,
        private email: EmailComposer
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

            case 'geo':

                this.navCtrl.navigateForward(`/tabs/mapa/${registro.text}`);
            break;
        }
    }

    public enviarCorreo():void{
        
        const arrTmp = [];
        const title: string = 'Tipo, Formato, Creado en, Texto \n';
        arrTmp.push( title );

        this.guardado.forEach( registro => {
            let fila = `${registro.type},${registro.format},${registro.created},${registro.text.replace(',', '')} \n`;
            arrTmp.push( fila );
        });

        this.crearArchivoFisico( arrTmp.join(' ') );
    }

    private crearArchivoFisico( text: string ):void{
        this.file.checkFile( this.file.dataDirectory , 'registros.csv')
            .then( existe => {  return this.escribirArchivoFisico( text ); })
            .catch( error => {
                return this.file.createFile( this.file.dataDirectory, 'registros.csv', false )
                   .then( creado => {   this.escribirArchivoFisico( text ); })
                   .catch( err2 => console.log( err2 ) );
            });
    }

    private async escribirArchivoFisico( text: string ){
        await this.file.writeExistingFile( this.file.dataDirectory, 'registros.csv', text );
        this.enviarEmail( this.file.dataDirectory + 'registros.csv ');
    }

    private async enviarEmail( pathFile: string ):Promise<any>{

        let email = {
            to: 'cris.ema.vargas20@gmail.com',
            //cc: '',
            //bcc: ['john@doe.com', 'jane@doe.com'],
            attachments: [
                pathFile
            ],
            subject: 'BackUp Scans',
            body: 'Back Up scans success!!',
            isHtml: true
        };


        await this.email.open( email );
    }

}
