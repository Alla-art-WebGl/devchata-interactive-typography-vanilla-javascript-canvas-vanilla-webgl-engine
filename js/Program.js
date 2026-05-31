/**
 * PROGRAM.js — Сборщик графической программы (БЕТОН)
 */

window.Program = {
    instance: null,
    duration: 0, 

    init() {
        const t0_pg = performance.now();
        const gl = window.Kernel.gl;
        
        if (!gl) {
            Logger.log('ERROR', 'Ядро WebGL не найдено', '🚨');
            return;
        }

        // 1. ПЕРЕВОД: Текст -> Код
        const vShader = this.createShader(gl, gl.VERTEX_SHADER, ShadersSource.vertex);
        const fShader = this.createShader(gl, gl.FRAGMENT_SHADER, ShadersSource.fragment);

        // 2. СВАРКА: Соединяем физику и цвет
        this.instance = gl.createProgram();
        gl.attachShader(this.instance, vShader);
        gl.attachShader(this.instance, fShader);
        gl.linkProgram(this.instance);

        // 3. КОНТРОЛЬ: (Исправлено: LINK_STATUS вместо LINK_PROGRAM_STATUS)
        if (!gl.getProgramParameter(this.instance, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(this.instance);
            Logger.log('ERROR', 'Сбой линковки программы: ' + info, '🚨');
            return;
        }

        // 4. ПУСК: Программа активирована на GPU
        gl.useProgram(this.instance);
        
        this.duration = (performance.now() - t0_pg).toFixed(4);
    },

    createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader);
            Logger.log('ERROR', 'Ошибка в коде шейдера: ' + info, '🚨');
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
};

Object.seal(window.Program);