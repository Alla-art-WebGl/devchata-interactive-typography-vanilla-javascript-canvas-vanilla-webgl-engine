/**
 * VIEWPORT.js — Системный контроллер обзора (БЕТОН)
 */

window.Viewport = {
    centerX: 0,
    centerY: 0,
    aspect: 1,

    calculate() {
        // ЗАВИСИМОСТЬ: Берем данные у Четкости (№10)
        const w = window.Resolution ? Resolution.width : window.innerWidth;
        const h = window.Resolution ? Resolution.height : window.innerHeight;

        this.centerX = w / 2;
        this.centerY = h / 2;
        this.aspect = w / h;
    }
};

// 1. УНИКАЛЬНЫЙ СТАРТ ЗАМЕРА
const t0_view = performance.now();

// 2. ВЫПОЛНЯЕМ РАСЧЕТ
window.Viewport.calculate();

// 3. БЕТОНИРУЕМ (Замок)
Object.freeze(window.Viewport);

// 4. УНИКАЛЬНЫЙ СТОП ЗАМЕР
const duration_view = (performance.now() - t0_view).toFixed(4);

// 5. ФИНАЛЬНЫЙ ОТЧЕТ (обращаемся напрямую к Viewport.centerX)
Logger.log('SYSTEM', `Камера сфокусирована на центр (Viewport): [${Viewport.centerX}, ${Viewport.centerY}] за ${duration_view} мс`, '👁️');