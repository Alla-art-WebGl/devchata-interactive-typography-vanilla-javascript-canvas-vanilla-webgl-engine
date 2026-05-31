/**
 * UNIFORMS.js — Изолированные системные провода для ноутбука ПК (БЕТОН — РЕЛИЗ)
 */

window.Uniforms = {
    locations: {},
    duration: 0,

    init() {
        const t0_un = performance.now();
        const gl = window.Kernel.gl;
        const program = window.Program.instance;

        // --- ВКЛЮЧАЕМ АЛЬФА-ШЛЮЗ ПОЛУПРОЗРАЧНОСТИ ДЛЯ ШУМА ПЕРЛИНА ---
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Привязываем только те розетки, которые нужны для графики на ПК
        this.locations.mouse = gl.getUniformLocation(program, 'u_mouse');  
        this.locations.time  = gl.getUniformLocation(program, 'u_time');   
        this.locations.res   = gl.getUniformLocation(program, 'u_res');   
        this.locations.dpr   = gl.getUniformLocation(program, 'u_dpr');
        this.locations.speed = gl.getUniformLocation(program, 'u_speed'); // --- КАБЕЛЬ СКОРОСТИ КИНЕТИЧЕСКОГО ЗАМЕСА ---

        this.duration = (performance.now() - t0_un).toFixed(4);
    },

    update(time, mouseX, mouseY) {
        const gl = window.Kernel.gl;

        // Принудительно заставляем Resolution брать свежие пиксели окна ноутбука
        if (window.Resolution && window.Resolution.update) window.Resolution.update();


        // --- НАПРЯМУЮ КАЧАЕМ ТОК В ЧИП GPU НОУТБУКА ПК ---
        gl.uniform1f(this.locations.time, time); 
        gl.uniform2f(this.locations.mouse, mouseX, mouseY); 
        
        // Жесткая привязка к измерительной линейке — буквы никогда не съедут
        gl.uniform2f(this.locations.res, window.Resolution.width, window.Resolution.height); 
        gl.uniform1f(this.locations.dpr, window.devicePixelRatio || 1.0);
        // --- ПОКАДРОВАЯ ПЕРЕДАЧА СКОРОСТИ РУКИ НА ЧИП GPU (ВСТАВКА) ---
        // Если палец/курсор замер — в u_speed улетит чистый 0.0, и песок мгновенно замрёт!
        const currentSpeed = window.Interaction ? window.Interaction.speed : 0.0;
        gl.uniform1f(this.locations.speed, currentSpeed);

    }
};

Object.seal(window.Uniforms);
