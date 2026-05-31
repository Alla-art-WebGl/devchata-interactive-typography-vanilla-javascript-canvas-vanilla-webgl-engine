/**
 * INTERACTION.js — Контроллер касаний и жестов мыши/тача (КИНЕТИКА — РЕЛИЗ)
 */

window.Interaction = {
    mouseX: 0.0,
    mouseY: 0.0,
    speed: 0.0, // Живой ток скорости движения руки для перемешивания песка!
    isDown: false,
    duration: 0,
    
    // Внутренние буферные точки для замера шага движения
    _lastX: 0.0,
    _lastY: 0.0,

    init() {
        const t0_int = performance.now();

        // 1. СЛУШАЕМ МЫШЬ (Для компьютеров)
        window.addEventListener('mousemove', (e) => this.handleMove(e.clientX, e.clientY));
        window.addEventListener('mousedown', () => { this.isDown = true; });
        window.addEventListener('mouseup', () => { this.isDown = false; this.speed = 0.0; });

        // 2. СЛУШАЕМ СМАРТФОН (Касание строго в один палец)
        window.addEventListener('touchstart', (e) => this.handleTouch(e), { passive: false });
        window.addEventListener('touchmove', (e) => this.handleTouch(e), { passive: false });
        window.addEventListener('touchend', () => { this.isDown = false; this.speed = 0.0; });

        this.duration = (performance.now() - t0_int).toFixed(4);
    },

    /**
     * handleMove — Переводит экранные пиксели клика в WebGL-пространство NDC (от -1.0 до 1.0)
     */
    handleMove(x, y) {
        if (!window.Resolution || !window.CoordinateSpace) return;

        // Переводим пиксели по оси X
        this.mouseX = window.CoordinateSpace.worldToGL(x * (window.devicePixelRatio || 1.0), window.Resolution.width);
        
        // В WebGL ось Y растет ВВЕРХ, а в браузере ВНИЗ — инвертируем пиксели перед переводом!
        const invertedY = window.innerHeight - y;
        this.mouseY = window.CoordinateSpace.worldToGL(invertedY * (window.devicePixelRatio || 1.0), window.Resolution.height);

        // --- ВЫЧИСЛЕНИЕ ЖИВОЙ СКОРОСТИ ---
        const dx = this.mouseX - this._lastX;
        const dy = this.mouseY - this._lastY;
        const targetSpeed = Math.sqrt(dx * dx + dy * dy) * 12.0; // Множитель сочности бурления

        // Плавная инерция затухания скорости, чтобы песок не дергался как робот
        this.speed += (targetSpeed - this.speed) * 0.3;

        // Запоминаем текущие координаты как старые для следующего кадра
        this._lastX = this.mouseX;
        this._lastY = this.mouseY;
    },

    /**
     * handleTouch — Чистый перехват одного пальца смартфона
     */
    handleTouch(e) {
        e.preventDefault(); // запрещаем дергание страницы при свайпе пальцем
        this.isDown = true;
        
        if (e.touches && e.touches.length > 0) {
            this.handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }
};

window.Interaction._lastX = window.Interaction.mouseX;
window.Interaction._lastY = window.Interaction.mouseY;

Object.seal(window.Interaction);