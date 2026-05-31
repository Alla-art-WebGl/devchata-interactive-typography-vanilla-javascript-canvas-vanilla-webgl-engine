/**
 * CACHEBUSTER.js — Модуль контролируемого сброса кэша видеокарты (БЕТОН)
 */

window.CacheBuster = {
    duration: 0,

    init() {
        const t0_cb = performance.now();

        // Проверяем, загружен ли уже наш чертеж шейдеров в память window
        if (window.ShadersSource && window.ShadersSource.vertex) {
            // Генерируем уникальный штамп времени на основе текущего кадра
            const uniqueStamp = performance.now().toFixed(0);

            // Насильно вшиваем в самый конец вершинного шейдера невидимый текстовый комментарий.
            // Это заставит видеокарту думать, что перед ней совершенно новый шейдер,
            // и она принудительно сотрет старый жирный прыгающий кэш!
            window.ShadersSource.vertex += `\n// cache_bypass_id_${uniqueStamp}\n`;
        }

        this.duration = (performance.now() - t0_cb).toFixed(4);
    }
};

// --- АВТОМАШИННЫЙ САМОЗАПУСК УБРАН ИЗ ЭТОЙ СТРОКИ ---
// Теперь модуль послушно ждет команды от Завода строго в свою миллисекунду очереди.

Object.seal(window.CacheBuster);