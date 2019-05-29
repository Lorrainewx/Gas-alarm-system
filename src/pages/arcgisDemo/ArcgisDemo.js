import React,{ PureComponent } from 'react';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import { Map } from '@esri/react-arcgis';
import BermudaTriangle from './BermudaTriangle';

class ArcgisDemo extends PureComponent {
    constructor(props){
        super(props);

        this.state = {
            type: 9
        }
    }
    basemap = ["streets", "satellite", "hybrid", "terrain", "topo", "gray", "dark-gray", "oceans", "national-geographic", "osm", "dark-gray-vector", "gray-vector", "streets-vector", "topo-vector", "streets-night-vector", "streets-relief-vector", "streets-navigation-vector"]
    render() {
        const { type } = this.state;

        const mapProperties = {
            basemap: this.basemap[type]
        }

        const viewProperties = {
            center: [120.040898, 31.561599],
            zoom: 10
        };

        return (
            <GridContent>
                <Map
                    mapProperties={mapProperties}
                    viewProperties={viewProperties}
                    style={{ width: '100%', height: 670 }}
                >
                    <BermudaTriangle />
                </Map>
            </GridContent>
        )
    }
}

export default ArcgisDemo;