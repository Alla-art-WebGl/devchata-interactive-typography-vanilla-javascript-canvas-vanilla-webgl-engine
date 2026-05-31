/**
 * CONFIG.js — Архитектурный план проекта (БЕТОН)
 */

window.CONFIG = {
    // 1. НАСТРОЙКИ СЦЕНЫ
    scene: {
        bg: '#00050a',
        depth: 1000
    },

    // 2. КАРТА БУКВ (Layout)
    letters: [
        { id: 'D',  img: 'assets/d.png',  x: -247, y: 0 },
        { id: 'E',  img: 'assets/e.png',  x: -138, y: 16 },
        { id: 'V',  img: 'assets/v.png',  x: -60,  y: -25 },
        { id: 'CH', img: 'assets/ch.png', x: -14,   y: 5 },
        { id: 'A',  img: 'assets/a.png',  x: 56,    y: -1 },
        { id: 'T',  img: 'assets/t.png',  x: 172,   y: -24 },
        { id: 'A2', img: 'assets/a2.png', x: 280,   y: -24 }
    ]
};

// 1. УНИКАЛЬНЫЙ СТАРТ ЗАМЕРА
const t0_conf = performance.now();

// 2. БЕТОНИРУЕМ (Замок)
Object.freeze(window.CONFIG);
Object.freeze(window.CONFIG.scene);
Object.freeze(window.CONFIG.letters);

// 3. УНИКАЛЬНЫЙ СТОП ЗАМЕР
const duration_conf = (performance.now() - t0_conf).toFixed(4);

// 4. ФИНАЛЬНЫЙ ОТЧЕТ
Logger.log('SYSTEM', `Архитектурный план (Config) утвержден за ${duration_conf} мс`, '🗺️');