/**
 * RESOLUTION.js — Системный контроллер четкости (БЕТОН)
 */

window.Resolution = {
    width: 0,
    height: 0,
    dpr: 1,

    update() {
        this.dpr = window.DeviceCapabilities ? DeviceCapabilities.pixelRatio : 1;
        const displayWidth  = window.innerWidth;
        const displayHeight = window.innerHeight;

        this.width  = Math.floor(displayWidth  * this.dpr);
        this.height = Math.floor(displayHeight * this.dpr);
    }
};


const t0_res = performance.now(); 

window.Resolution.update();

Object.freeze(window.Resolution);


const duration_res = (performance.now() - t0_res).toFixed(4);

Logger.log('SYSTEM', `Четкость настроена (Resolution): ${Resolution.width}x${Resolution.height} за ${duration_res} мс`, '📐');