import { useState, useEffect } from 'react';
import { loadModules } from '@esri/react-arcgis';
import areaBorder from '@/assets/json/areaBorder.json';
import townBorder from '@/assets/json/townBorder.json';

import Marks, { types } from './marks';

const BermudaTriangle = (props) => {

    const [graphic, setGraphic] = useState(null);
    useEffect(() => {

        loadModules([
            "esri/PopupTemplate",
            "esri/geometry/Point",
            "esri/Graphic",
            "esri/symbols/TextSymbol",
            "esri/symbols/SimpleLineSymbol",
            "esri/symbols/PictureMarkerSymbol",
            "esri/geometry/Polyline",
            "esri/layers/GraphicsLayer",
        ]).then(([
            PopupTemplate,
            Point,
            Graphic,
            TextSymbol,
            SimpleLineSymbol,
            PictureMarkerSymbol,
            Polyline,
            GraphicsLayer
        ]) => {

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

            props.map.add(graphicsPolylineLayer);

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
                    color: "black",
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

                props.view.graphics.add(graphic);
                props.view.graphics.add(graphicTxt);

            })

            window.arcgis = props;

        }).catch((err) => console.error(err));

        return function cleanup() {
            props.view.graphics.remove(graphic);
        };
    }, []);

    return null;

}

export default BermudaTriangle;