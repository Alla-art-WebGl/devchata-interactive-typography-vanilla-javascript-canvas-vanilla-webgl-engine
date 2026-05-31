/**
 * ATTRIBUTES.js — Связист данных и видеокарты (БЕТОН)
 */

window.Attributes = {
    duration: 0,

    init() {
        const t0_at = performance.now();
        const gl = window.Kernel.gl;
        const program = window.Program.instance;

        // 1. СОЗДАЕМ BUFFER (Тот самый скоростной вагон в памяти GPU)
        const buffer = gl.createBuffer();
        
        // 2. ПРИВЯЗКА: Говорим видеокарте, что сейчас будем работать с этим буфером
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        // 3. ЗАГРУЗКА: Берем ВСЁ золото из Registry и перекачиваем в Buffer
        const allData = window.Registry.getCombinedData(); 
        gl.bufferData(gl.ARRAY_BUFFER, allData, gl.STATIC_DRAW);

        // 4. НАРЕЗКА (Stride): Узнаем шаг одной песчинки в байтах (6 чисел * 4 байта)
        const stride = window.Schema.stride * 4; 

        // 5. НАСТРОЙКА КАНАЛОВ (Связываем буфер с переменными в шейдере)
        // Канал "a_home": берем 2 числа (x, y), смещение 8 байт (пропускаем a_pos)
        this.setup(gl, program, 'a_home', 2, 2 * 4); 

        // Канал "a_id": берем 1 число, смещение 16 байт
        this.setup(gl, program, 'a_id',   1, 4 * 4); 

        // Канал "a_size": берем 1 число, смещение 20 байт
        this.setup(gl, program, 'a_size', 1, 5 * 4); 

        this.duration = (performance.now() - t0_at).toFixed(4);
    },

    /**
     * setup — Инструмент для прокладки одного "кабеля" данных
     */
    setup(gl, program, name, size, offset) {
        const location = gl.getAttribLocation(program, name);
        if (location === -1) return; // Если шейдер не использует эту переменную
        
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, window.Schema.stride * 4, offset);
    }
};

Object.seal(window.Attributes);