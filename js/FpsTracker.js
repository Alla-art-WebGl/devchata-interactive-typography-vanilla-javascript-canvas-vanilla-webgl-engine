/**
 * FPSTRACKER.js — Автономный утилитарный датчик пульса 60 FPS (БЕТОН — РЕЛИЗ)
 */

window.FpsTracker = {
    frameCount: 0,
    lastTime: 0,
    duration: 0,

    init() {
        const t0_fps = performance.now();
        
        this.lastTime = performance.now();
        this.frameCount = 0;

        // ЗАПУСК АВТОНОМНОГО МЕТРОНОМА
        // Датчик сам запускает свой независимый цикл, вообще не трогая код Engine.js и Завода!
        this.loop();

        this.duration = (performance.now() - t0_fps).toFixed(4);
        Logger.log('SYSTEM', `Датчик пульса [FpsTracker] автономно активирован в утилитах за ${this.duration} мс`, '💓');
    },

    /**
     * loop — Независимая утилитарная петля замера FPS
     */
    loop() {
        // Просим браузер зафиксировать текущий кадр монитора
        requestAnimationFrame(() => this.loop());

        this.frameCount++;
        const now = performance.now();

        // Как только прошла ровно 1 секунда — выводим честный пульс экрана
        if (now - this.lastTime >= 1000) {
            const currentFps = this.frameCount;
            
            let statusEmoji = '🟢'; // Идеал (60+ FPS)
            if (currentFps < 55) statusEmoji = '🟡';
            if (currentFps < 30) statusEmoji = '🔴';

            // Выводим строгий, прецизионный пульс в одну строчку
            Logger.log('SYSTEM', `${statusEmoji} PULSE: ${currentFps} FPS`, '⏱️');

            this.frameCount = 0;
            this.lastTime = now;
        }
    }
};

// --- АВТОНОМНЫЙ ЗАПУСК КРЕМНИЯ ---
// Модуль сам вызывает свой метод init() строго в свою очередь загрузки в index.html!
window.FpsTracker.init();

// Намертво запечатываем структуру объекта от изменений в рантайме
Object.seal(window.FpsTracker);
