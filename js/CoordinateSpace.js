/**
 * COORDINATESPACE.js — Системный переводчик координат (БЕТОН)
 */

window.CoordinateSpace = {
    /**
     * worldToGL — Главная формула перевода.
     * Превращает пиксельную координату в координату для шейдера.
     */
    worldToGL(px, limit) {
        return (px / limit) * 2 - 1;
    },

    /**
     * getRelative — Находит позицию точки относительно центра.
     */
    getRelative(px, center) {
        return px - center;
    },

    /**
     * checkBounds — Проверяет, не вылетела ли точка за границы экрана.
     */
    checkBounds(val, limit) {
        if (window.Utils) {
            return Utils.clamp(val, 0, limit);
        }
        return val;
    }
};

// 1. УНИКАЛЬНЫЙ СТАРТ ЗАМЕРА
const t0_space = performance.now();

// 2. БЕТОНИРУЕМ (Замок)
Object.freeze(window.CoordinateSpace);

// 3. УНИКАЛЬНЫЙ СТОП ЗАМЕР
const duration_space = (performance.now() - t0_space).toFixed(4);

// 4. ФИНАЛЬНЫЙ ОТЧЕТ (Теперь в самом низу)
Logger.log('SYSTEM', `Переводчик координат (CoordinateSpace) (WebGL Bridge) активен за ${duration_space} мс`, '🌉');