import { Component } from '@angular/core';
import { BarcodeScanner, BarcodeScanResult } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

    public swiperOpts = {
        allowSlidePrev: false,
        allowSlideNext: false
    }

    constructor(
        private _barcodeScanner: BarcodeScanner,
        private _dataLocalService: DataLocalService
    ) {}

    public scan(){

        this._barcodeScanner.scan().then( ( barcodeData: BarcodeScanResult ) => {
            
            if( !barcodeData.cancelled ){
                this._dataLocalService.guardarRegistro( barcodeData.format, barcodeData.text );
            }

        }).catch( ( _error ) => {
            console.log( _error );
            this._dataLocalService.guardarRegistro( 'QRCpde', 'geo:40.73151796986687,-74.06087294062502' );
        });
    }


    public ionViewDidEnter(){
        this.scan();
    }

    public ionViewWillEnter(){
    }

    public ionViewDidLeave(){
    }

    public ionViewWillLeave(){
    }

    public ionViewWillUnload(){
    }

    public ionViewDidLoad(){
    }

}
