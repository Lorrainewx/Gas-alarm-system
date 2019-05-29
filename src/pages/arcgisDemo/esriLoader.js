import { loadModules } from 'esri-loader';
import areaBorder from '@/assets/json/areaBorder.json';
import townBorder from '@/assets/json/townBorder.json';

import Marks, { types } from './marks';

export default function (target) {
    const mapURL = {
        url: "https://js.arcgis.com/4.7/dojo/dojo.js"
    }
    loadModules([
        "esri/Map",
        "esri/views/MapView",

        "esri/PopupTemplate",
        "esri/geometry/Point",
        "esri/Graphic",
        "esri/symbols/TextSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/PictureMarkerSymbol",
        "esri/geometry/Polyline",
        "esri/layers/GraphicsLayer",
    ], mapURL).then(([
        Map,
        MapView,
        
        PopupTemplate, 
        Point, 
        Graphic, 
        TextSymbol,
        SimpleLineSymbol, 
        PictureMarkerSymbol, 
        Polyline, 
        GraphicsLayer
    ]) => {

        const map = new Map({
            basemap: 'dark-gray-vector'
        });

        const graphicsPolylineLayer = new GraphicsLayer();

        // 加载区界
        const qulineSymbol = new SimpleLineSymbol({
            color: "#ff5500",
            width: 2
        });
        for (let i = 0; i < areaBorder.features.length; i++) {
            let feature = areaBorder.features[i];
            graphicsPolylineLayer.add(new Graphic({
                geometry: new Polyline({ paths: feature.geometry.coordinates[0] }),
                symbol: qulineSymbol
            }));
        }

        // 加载镇界
        const znlineSymbol = new SimpleLineSymbol({
            style: "short-dot",
            color: "#ff5500",
            width: 1
        });
        for (let i = 0; i < townBorder.features.length; i++) {
            let feature = townBorder.features[i];
            graphicsPolylineLayer.add(new Graphic({
                geometry: new Polyline({ paths: feature.geometry.coordinates[0] }),
                symbol: znlineSymbol
            }));
        }

        map.add(graphicsPolylineLayer);

        const view = new MapView({
            container: target,
            map: map,
            center: [120.040898, 31.561599],
            zoom: 9
        });

        Marks.forEach(function (item) {
            //定义点位
            var point = new Point({
                x: Number(item.longitude),
                y: Number(item.latitude)
            });

            //定义信息模板
            var popupTemplate = new PopupTemplate({
                title: item.name,
                content: `<div>${item.riverquality}</div>`
            });

            var picMarkerSymbol = new PictureMarkerSymbol({
                url: types[item.riverquality],
                width: '25px',
                height: '33px',
                yoffset: '16px'
            });

            //名称标注
            var textSymbol = new TextSymbol({
                color: "#fff",
                text: item.name,
                xoffset: 0,
                yoffset: -10,
                font: {
                    size: 10,
                    family: "微软雅黑"
                }
            });

            //定义Graphic
            var graphic = new Graphic({
                geometry: point,
                attributes: item,
                symbol: picMarkerSymbol,
                popupTemplate: popupTemplate
            });

            //定义Graphic
            var graphicTxt = new Graphic({
                geometry: point,
                attributes: item,
                symbol: textSymbol,
                popupTemplate: popupTemplate
            });

            view.graphics.add(graphic);
            view.graphics.add(graphicTxt);

        })

    })
}