/**
 * MATH.js — Системный инструментарий (БЕТОН)
 */

window.Utils = {
    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },

    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    },

    norm(val, min, max) {
        return (val - min) / (max - min);
    },

    map(val, sourceMin, sourceMax, destMin, destMax) {
        return this.lerp(destMin, destMax, this.norm(val, sourceMin, sourceMax));
    }
};

// 1. УНИКАЛЬНЫЙ СТАРТ ЗАМЕРА
const t0_utils = performance.now();

// 2. БЕТОНИРУЕМ (Замок)
Object.freeze(window.Utils);

// 3. УНИКАЛЬНЫЙ СТОП ЗАМЕР
const duration_utils = (performance.now() - t0_utils).toFixed(4);

// 4. ФИНАЛЬНЫЙ ОТЧЕТ
Logger.log('SYSTEM', `Инструментарий (Utils/Math) забетонирован за ${duration_utils} мс`, '🛠️');