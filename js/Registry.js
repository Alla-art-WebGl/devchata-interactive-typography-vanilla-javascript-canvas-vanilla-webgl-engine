/**
 * REGISTRY.js — Склад материи (БЕТОН)
 */

window.Registry = {
    // 1. ХРАНИЛИЩЕ (Сюда Завод складывает массивы точек каждой буквы)
    data: {},
    duration: 0,

    /**
     * set — Приемка товара на склад
     */
    set(id, pointsArray) {
        this.data[id] = pointsArray;
    },

    /**
     * get — Выдача конкретной буквы по её ID
     */
    get(id) {
        return this.data[id] || null;
    },

    /**
     * getCombinedData — Плавление всех букв в один "золотой слиток"
     */
    getCombinedData() {
        const t0_combine = performance.now();

        // Достаем все массивы из хранилища (D, E, V, CH, A...)
        const arrays = Object.values(this.data);
        
        // Вычисляем общий размер будущего массива
        const totalSize = arrays.reduce((acc, arr) => acc + arr.length, 0);
        
        // Создаем финальный типизированный массив (только так понимает GPU)
        const combined = new Float32Array(totalSize);
        
        // Копируем данные каждой буквы один за другим
        let offset = 0;
        for (const arr of arrays) {
            combined.set(arr, offset);
            offset += arr.length;
        }

        this.duration = (performance.now() - t0_combine).toFixed(4);
        return combined;
    },

    /**
     * getTotalPointsCount — Счетчик всех песчинок в проекте
     */
    getTotalPointsCount() {
        const totalNumbers = Object.values(this.data).reduce((acc, arr) => acc + arr.length, 0);
        // Делим на шаг Схемы (6), чтобы узнать чистое количество точек
        return totalNumbers / window.Schema.stride;
    }
};

// --- АТОМАРНЫЙ СТАНДАРТ ---

const t0_reg = performance.now();

// Мы не замораживаем объект полностью (через freeze), чтобы Завод мог вносить данные.
// Мы используем SEAL, чтобы защитить структуру методов.
Object.seal(window.Registry);

const duration_reg = (performance.now() - t0_reg).toFixed(4);

Logger.log('SYSTEM', `Склад материи (Registry) открыт за ${duration_reg} мс`, '📦');