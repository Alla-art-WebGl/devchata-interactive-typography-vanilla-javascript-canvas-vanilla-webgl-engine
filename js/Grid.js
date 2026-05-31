/**
 * GRID.js — Пространственный навигатор (БЕТОН)
 */

window.Grid = {
    // 1. ПАРАМЕТРЫ ХРАНЕНИЯ
    cells: [],       // Сетке нужно место, чтобы помнить, где лежат песчинки
    cellSize: 20,    // Размер одного квадрата (20х20 пикселей) — это стандарт
    cols: 0,         // Заготовка для количества столбцов
    rows: 0,         // Заготовка для количества строк
    duration: 0,    // <--- ДОБАВИТЬ ЭТУ СТРОКУ

    /**
     * init — Математическая разметка мира
     */
    init() {
        // 2. СВЯЗЬ С РЕАЛЬНОСТЬЮ
        // Берем ширину и высоту из Resolution (нашей линейки)
        const t0 = performance.now();
        const w = window.Resolution ? Resolution.width : window.innerWidth;
        const h = window.Resolution ? Resolution.height : window.innerHeight;

        // 3. НАРЕЗКА ПРОСТРАНСТВА
        // Делим экран на ячейки и округляем вверх (Math.ceil), чтобы не было дырок
        this.cols = Math.ceil(w / this.cellSize);
        this.rows = Math.ceil(h / this.cellSize);
        
        // 4. СОЗДАНИЕ ПАМЯТИ
        // Создаем массив, размер которого равен общему количеству ячеек
        this.cells = new Array(this.cols * this.rows);
        
        // 5. ПЕРВИЧНАЯ УБОРКА
        // Наполняем ячейки пустыми списками, чтобы система не выдала ошибку
        this.clear();

        this.duration = (performance.now() - t0).toFixed(4); 
    },

    /**
     * getIndex — Главный поисковик
     * Превращает экранные X и Y в номер ячейки (индекс массива)
     */
    getIndex(x, y) {
        // Узнаем, в какой колонке и строке находится точка
        const c = Math.floor(x / this.cellSize);
        const r = Math.floor(y / this.cellSize);
        
        // Проверка: если палец или песок вылетели за экран, возвращаем "пусто" (-1)
        if (c < 0 || c >= this.cols || r < 0 || r >= this.rows) return -1;
        
        // Магическая формула: переводим 2D карту в 1D список
        return r * this.cols + c;
    },

    /**
     * clear — Веник для каждого кадра
     * Мы будем звать эту функцию 60 раз в секунду, чтобы стирать старые тени песка
     */
    clear() {
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i] = []; // Делаем ячейку абсолютно чистой
        }
    }
};

/**
 * 6. САМОЗАПУСК (Автоматика)
 * Как только браузер прочитает файл, Навигатор настроит свои расчеты.
 */
window.Grid.init();

/**
 * 7. ПЕЧАТЬ (Object.seal)
 * Мы не используем freeze, потому что нам нужно МЕНЯТЬ данные в ячейках.
 * Seal запрещает удалять Grid или менять cellSize, но разрешает работу clear().
 */
Object.seal(window.Grid);