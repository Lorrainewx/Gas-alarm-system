import React,{ PureComponent } from 'react';
import GridContent from '@/components/PageHeaderWrapper/GridContent';

import esriLoader from './esriLoader';

class EsriLoaderMap extends PureComponent {
    constructor(props){
        super(props);

        this.state = {
            type: 9
        }
    }
    componentDidMount(){
        esriLoader('viewMap');
    }
    render() {
        return (
            <GridContent>
                <div
                    id='viewMap'
                    style={{ width: '100%', height: 670 }}
                />
            </GridContent>
        )
    }
}

export default EsriLoaderMap;