/**
 * ENGINE.js — Главный цикл и рендеринг (БЕТОН)
 */

window.Engine = {
    duration: 0,

    init() {
        const t0_eng = performance.now();

        // 1. ЗАПУСК ЦИКЛА
        // requestAnimationFrame — это встроенный метроном браузера (60 FPS)
        this.render();

        this.duration = (performance.now() - t0_eng).toFixed(4);
    },

    /**
     * render — Главный цикл отрисовки
     */
    render() {
     

       const gl = window.Kernel.gl;
        if (!gl) return;

        // 2. ОЧИСТКА ЭКРАНА
        // Каждый кадр мы стираем старое изображение, чтобы нарисовать новое
        gl.clear(gl.COLOR_BUFFER_BIT);

        // 3. ОБНОВЛЕНИЕ ПУЛЬСА
        // Берем текущее время (в секундах) и координаты из Interaction
        const time = performance.now() * 0.001;
        window.Uniforms.update(
            time, 
            window.Interaction.mouseX, 
            window.Interaction.mouseY
        );

        // 4. ГЛАВНАЯ КОМАНДА ЖИЗНИ
        // gl.drawArrays — это кнопка "ПУСК" для видеокарты.
        // Мы говорим: "Возьми всё золото (POINTS) со склада и нарисуй его разом"
        const count = window.Registry.getTotalPointsCount();
        gl.drawArrays(gl.POINTS, 0, count);

        // 5. РЕКУРСИЯ
        // Просим браузер вызвать этот же метод снова, как только экран обновится
        requestAnimationFrame(() => this.render());
    }
};

Object.seal(window.Engine);