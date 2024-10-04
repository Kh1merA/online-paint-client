import React from 'react';
import "../styles/toolbar.scss";
import toolState from "../store/toolState";

const SettingBar = () => {
    return (
        <div className="setting-bar">
            <label htmlFor="line-width">Line width</label>
            <input
                onChange={(e) => {
                    toolState.setLineWidth(e.target.value)
                }}
                style={{margin: '0 10px'}}
                id='line-width'
                type='number'
                min={1}
                defaultValue={1}/>
            <label htmlFor="fill-color">Fill color</label>
            <input
                onChange={(e) => {
                    toolState.setFillColor(e.target.value)
                }}
                id='fill-color'
                type='color'
                style={{margin: '0 10px'}}/>
            <label htmlFor="stroke-color">Stroke color</label>
            <input
                onChange={(e) => {
                    toolState.setStrokeColor(e.target.value)
                }}
                id='stroke-color'
                type='color'
                style={{margin: '0 10px'}}/>
        </div>
    );
};

export default SettingBar;