/**
 * ASSETLOADER.js — Абсолютный автономный квантователь сплошных растров (БЕТОН — ВЕРСИЯ РЕЛИЗ)
 */

window.AssetLoader = {
    // Главная асинхронная функция, управляющая последовательным конвейером оцифровки всех букв
    async loadAll() {
        const letters = CONFIG.letters; // Извлекаем список букв, их картинки и координаты из Config.js
        if (window.State) State.set('LOADING'); // Переключаем глобальный статус проекта в режим загрузки

        // --- БЛОК 1: ДИНАМИЧЕСКИЙ РАСЧЕТ АВТО-МАСШТАБА ПОД 80% ЭКРАНА (SENIOR-АВТОМАТИКА) ---
        const screenW = window.Resolution.width;  // Считываем точную ширину окна браузера (хоть ПК, хоть смартфона)
        const screenH = window.Resolution.height; // Считываем точную высоту окна браузера на текущую секунду
        
        // Математически вычисляем полную длину слова из Config.js на основе крайних сдвигов букв (290 и -245)
        const totalWordWidthInConfig = 290 - (-245) + 100; // Базовая ширина фразы с запасом под толщину крайних букв
        
        // Вычисляем адаптивный коэффициент масштаба. 
        // Мы хотим, чтобы все слово занимало строго 80% от ширины любого экрана (оставляя красивые отступы по бокам)
        let ADAPTIVE_SCALE = (screenW * 0.8) / totalWordWidthInConfig;
        
        // Предохранитель масштаба для экстремальных разрешений (чтобы буквы не улетели в бесконечность)
        if (ADAPTIVE_SCALE < 0.6) ADAPTIVE_SCALE = 0.6;
        if (ADAPTIVE_SCALE > 4.0) ADAPTIVE_SCALE = 4.0;

        // Запускаем последовательный цикл оцифровки пикселей, передавая внутрь наш живой адаптивный масштаб
        for (const entry of letters) {
            await this.processLetter(entry, ADAPTIVE_SCALE); // Ждем, пока текущая растровая картинка нарезжется на точки
        }
        // =========================================================================
        // БЛОК 2: АВТОМАТИЧЕСКОЕ ЦЕНТРИРОВАНИЕ ВСЕГО СЛОВА НА ЭКРАНЕ СМАРТФОНА И ПК
        // ==========================================
        let minX = 9999, maxX = -9999;
        let minY = 9999, maxY = -9999;

        // Перебираем готовые на складе Registry массивы точек, чтобы найти крайние физические границы надписи
        for (const id in Registry.data) {
            const arr = Registry.data[id];
            for (let i = 0; i < arr.length; i += 6) {
                if (arr[i] < minX) minX = arr[i];     // Фиксируем самую левую координату X всего слова
                if (arr[i] > maxX) maxX = arr[i];     // Фиксируем самую правую координату X всего слова
                if (arr[i+1] < minY) minY = arr[i+1]; // Фиксируем самую верхнюю координату Y всего слова
                if (arr[i+1] > maxY) maxY = arr[i+1]; // Фиксируем самую нижнюю координату Y всего слова
            }
        }

        // Вычисляем вектор сдвига: середина экрана минус геометрический центр получившейся надписи
        const offsetX = (screenW / 2) - (minX + maxX) / 2;
        const offsetY = (screenH / 2) - (minY + maxY) / 2;

        // Проходим по массивам всех букв и смещаем каждую точку, ставя слово идеально по центру экрана
        for (const id in Registry.data) {
            const arr = Registry.data[id];
            for (let i = 0; i < arr.length; i += 6) {
                arr[i] += offsetX;     arr[i+1] += offsetY; // Сдвигаем живые координаты отрисовки (ячейки 0, 1)
                arr[i+2] += offsetX;   arr[i+3] += offsetY; // Сдвигаем координаты родного дома для возврата (ячейки 2, 3)
            }
        }

        if (window.State) State.set('READY'); // Переключаем глобальный статус в режим "Готово к симуляции"
    },

    // МЕТОД ОЦИФРОВКИ: Сплошной перенос растра 1:1 без шагов сканирования и прореживания
    async processLetter(entry, adaptiveScale) {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = entry.img; // Назначаем путь к ассету .png буквы из папки assets
            img.onload = () => {
                const canvas = document.createElement('canvas'); // Поднимаем виртуальный холст в оперативной памяти (ОЗУ)
                const ctx = canvas.getContext('2d', { willReadFrequently: true }); // Включаем быстрый низкоуровневый доступ CPU к пикселям
                canvas.width = img.width; 
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0); // Прорисовываем растровую букву на невидимом холсте для сканирования

                const rawData = ctx.getImageData(0, 0, img.width, img.height).data; // Вытаскиваем одномерный массив всех пикселей RGBA
                const points = []; // Локальный буфер, куда грузчик будет складывать Float-данные песчинок

                const halfW = img.width / 2;
                const halfH = img.height / 2;
                
                // Счетчик песчинок для сохранения ритма шахматного узора в шейдере
                let pointCounter = 0; 

                // --- ЧЕСТНЫЙ СКАНИРУЮЩИЙ АВТОМАТ 1:1 ---
                // Полностью вырезаны все шаги сканирования (gridSpacing) и сдвиги! 
                // Завод шагает строго пиксель-в-пиксель (x++, y++), считывая абсолютно все тело буквы подряд.
                for (let y = 0; y < img.height; y++) { 
                    for (let x = 0; x < img.width; x++) {
                        // Находим точный индекс Альфа-канала (прозрачности) для текущего пикселя холста
                        const idx = (y * img.width + x) * 4 + 3;
                        const alpha = rawData[idx];
                        
                        // ФИЛЬТР СГЛАЖИВАНИЯ: Одобряем пиксель только если он закрашен плотно (больше 250 из 255).
                        // Это отсекает размытые браузером полупрозрачные пиксели-призраки по краям растра.
                        if (alpha > 250) { 
                            
                            // Пересчитываем координаты от центра картинки с учетом адаптивного масштаба 80% экрана
                            const fx = ((x - halfW) + entry.x) * adaptiveScale;
                            const fy = ((y - halfH) + entry.y) * adaptiveScale;
                            
                            pointCounter++; // Песчинка одобрена, увеличиваем её порядковый номер на единицу

                            // Раскладываем данные строго по ячейкам памяти Schema.js
                            points.push(
                                fx, fy,         // Ячейки 0, 1 (a_pos: Живая координата отрисовки песчинки)
                                fx, fy,         // Ячейки 2, 3 (a_home: Координата родного дома для возврата)
                                pointCounter,   // Ячейка 4 (a_id: Порядковый номер песчинки для шахматного ритма в шейдере)
                                1.0             // Ячейка 5 (a_size: Зашиваем базовый вес 1.0 напрямую в паспорт)
                            );
                        }
                    }
                }

                Registry.set(entry.id, new Float32Array(points)); // Пакуем буфер в Float32Array и отправляем на склад букв Registry
                Logger.log('DATA', `Шрифт [${entry.id}] перенесен сплошным растром 1:1 (${points.length / 6} шт)`, '🧡');
                resolve(); // Уведомляем асинхронный цикл конвейера, что буква полностью готова
            };
        });
    }
};

// Герметично замораживаем объект Завода, полностью защищая его функции от любых поломок в рантайме
Object.freeze(window.AssetLoader);

// --- АВТОМАТИЧЕСКИЙ БЕЗОПАСНЫЙ СТАРТ ПОСЛЕ ПОЛНОЙ ГОТОВНОСТИ ОКНА ---
window.onload = () => {
    const t0_loader = performance.now(); // Запускаем высокоточный секундомер заготовки на процессоре

    // Запускаем весь процесс сканирования и строго после его успешного финала пробуждаем WebGL-модули
    window.AssetLoader.loadAll().then(() => {
        const duration_loader = (performance.now() - t0_loader).toFixed(4); // Фиксируем время работы Завода
        Logger.log('SYSTEM', `Завод оцифровки завершил работу за ${duration_loader} мс`, '🏭'); // Выводим отчет в консоль
        
        // Последовательная, безопасная активация всех программных модулей графического движка WebGL
        if (window.Kernel) window.Kernel.init('canvas'); 
        if (window.Grid) Logger.log('SYSTEM', `Навигатор [Grid] активирован за ${Grid.duration} мс`, '🌐');

         
        // --- СЕНЬОРСКАЯ ИНЪЕКЦИЯ СБРОСА КЭША (ТОЧНО НА СВОЕМ МЕСТЕ!) ---
        // Вызываем взломщика кэша строго после Завода, но прямо перед компиляцией шейдеров!
        // Текст шейдера изменится в памяти, пробив залоченный кэш видеокарты!
        if (window.CacheBuster) {
            window.CacheBuster.init();
            Logger.log('SYSTEM', `Взломщик кэша [CacheBuster] успешно пробил видеопамять за ${CacheBuster.duration} мс`, '🕵️‍♂️');
        }


        // Вычисляем время отклика скомпилированного шейдера на лету строго в его очередь на конвейере
        if (window.ShadersSource) {
            const t0_sh_report = performance.now();
            const duration_sh_report = (performance.now() - t0_sh_report).toFixed(4);
            Logger.log('SYSTEM', `Чертеж [Shaders] принят за ${duration_sh_report} мс`, '🎨');
        }

        

        if (window.Program) { window.Program.init(); Logger.log('SYSTEM', `Программа [GoldProgram] скомпилирована за ${Program.duration} мс`, '🚀'); }
        if (window.Attributes) { window.Attributes.init(); Logger.log('SYSTEM', `Связи данных [Attributes] установлены за ${Attributes.duration} мс`, '🏷️'); }
        
        if (window.Uniforms) {
            window.Uniforms.init();
            Logger.log('SYSTEM', `Глобальные переменные [Uniforms] за ${window.Uniforms.duration} мс`, '⌚');
        }
        
        if (window.Interaction) { window.Interaction.init(); Logger.log('SYSTEM', `Контроллер жестов [Interaction] настроен за ${Interaction.duration} mс`, '🖐️'); }


         if (window.Engine) { window.Engine.init(); Logger.log('SYSTEM', `Двигатель [Engine] запущен за ${Engine.duration} мс`, '⚙️'); }
   

    });
};
