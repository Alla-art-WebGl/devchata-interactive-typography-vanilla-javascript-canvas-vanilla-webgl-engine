/**
 * KERNEL.js — Ядро графической системы (БЕТОН)
 */

window.Kernel = {
    gl: null,
    canvas: null,

    init(canvasId = 'canvas') {
        const t0_kernel = performance.now(); // Замеряем внутри старта

        this.canvas = document.getElementById(canvasId);
        
        if (!this.canvas) {
            Logger.log('ERROR', `Критическая ошибка: Холст с id="${canvasId}" не найден!`, '🚨');
            return;
        }

        this.gl = this.canvas.getContext('webgl', {
            alpha: false,
            depth: true,
            antialias: false
        });

        if (!this.gl) {
            Logger.log('ERROR', 'WebGL не поддерживается браузером', '🚨');
            return;
        }

        // Замораживаем объект только после того, как GL контекст получен
        Object.seal(this); 

        const duration_kernel = (performance.now() - t0_kernel).toFixed(4);
        Logger.log('SYSTEM', `Ядро WebGL (Kernel) успешно инициализировано за ${duration_kernel} мс`, '💎');
    }
};

// ВАЖНО: Мы убрали отсюда автоматический вызов window.Kernel.init();
// Теперь Ядро будет ждать команды от Завода.