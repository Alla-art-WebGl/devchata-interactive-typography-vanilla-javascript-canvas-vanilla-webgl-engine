/**
 * SCHEMA.js — Паспорт золотой песчинки (БЕТОН)
 */

window.Schema = {
    // Сколько чисел занимает одна песчинка (x, y, ox, oy, id, size)
    stride: 6,

    // Быстрые ссылки на данные
    index: {
        x: 0, y: 1,    // Текущая позиция
        ox: 2, oy: 3,  // Дом (куда возвращаться)
        id: 4,         // Номер для мерцания
        size: 5        // Размер чешуйки
    }
};

// --- АТОМАРНЫЙ СТАНДАРТ ---

const t0_schema = performance.now();

Object.freeze(window.Schema);
Object.freeze(window.Schema.index);

const duration_schema = (performance.now() - t0_schema).toFixed(4);

Logger.log('SYSTEM', `Паспорт песчинки (Schema) утвержден за ${duration_schema} мс`, '📋');