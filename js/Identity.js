/**
 * IDENTITY.js — Системный паспорт проекта
 */

// 1. Начинаем замер
const t0_id = performance.now();

window.IDENTITY = {
    name: "DEVCHATA_GOLD_SAND",
    version: "1.0.0",
    author: "Creative Director",
    mode: "DEVELOPMENT"
};

// 2. Бетонируем паспорт
Object.freeze(window.IDENTITY);

// 3. Считаем время
const duration_id = (performance.now() - t0_id).toFixed(4);

// 4. Отчет в консоль (проверь скобки в конце этой строки!)
if (window.Logger) {
    Logger.log('SYSTEM', `Личность проекта [${window.IDENTITY.name}] подтверждена за ${duration_id} мс`, '🆔');
}