import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment'

declare var mapboxgl: any;

@Component({
    selector: 'app-mapa',
    templateUrl: './mapa.page.html',
    styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit, AfterViewInit {

    public geo: string = '';
    private lat: number;
    private lng: number;

    constructor(
        private _route: ActivatedRoute
    ){ 
        this.geo = this._route.snapshot.paramMap.get('geo');
    }

    ngOnInit() {
        this.getSplitLetLag();
    }

    ngAfterViewInit(): void {
        this.preViewMap();       
    }

    private getSplitLetLag(){
        let geoSplit = this.geo.substring(4).split(',');
        this.lat = Number(geoSplit[0]);
        this.lng = Number(geoSplit[1]);
    }

    private preViewMap(){

        mapboxgl.accessToken = environment.mapsApi;

        const map = new mapboxgl.Map({
            style: 'mapbox://styles/mapbox/light-v10',
            center: [ this.lng , this.lat ],
            zoom: 15.5,
            pitch: 45,
            bearing: -17.6,
            container: 'map',
            antialias: true
        });

        map.on('load', () => {

            //Resize tam of page
            map.resize();

            //create marker
            new mapboxgl.Marker().setLngLat( [ this.lng, this.lat ]).addTo(map);

            const layers = map.getStyle().layers;
            const labelLayerId = layers.find( (layer) => layer.type === 'symbol' && layer.layout['text-field'] ).id;
            
            map.addLayer({
                'id': 'add-3d-buildings',
                'source': 'composite',
                'source-layer': 'building',
                'filter': ['==', 'extrude', 'true'],
                'type': 'fill-extrusion',
                'minzoom': 15,
                'paint': {
                    'fill-extrusion-color': '#aaa',
                    'fill-extrusion-height': [ 'interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height'] ],
                    'fill-extrusion-base': [ 'interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height'] ],
                    'fill-extrusion-opacity': 0.6
                }
            },
            labelLayerId
            );
        });

    }

}
