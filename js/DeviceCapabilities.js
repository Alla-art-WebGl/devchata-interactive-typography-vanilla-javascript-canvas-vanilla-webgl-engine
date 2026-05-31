/**
 * DEVICECAPABILITIES.js — Системный разведчик (БЕТОН)
 */

window.DeviceCapabilities = {
    pixelRatio: window.devicePixelRatio || 1,
    isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    maxTextureSize: 0,

    /**
     * scan — Разовая проверка ресурсов устройства
     */
    scan() {
        // Убрали отсюда замер времени и логгер
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');

        if (gl) {
            this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        }
        
        canvas.remove();
    }
};

// 1. УНИКАЛЬНЫЙ СТАРТ ЗАМЕРА (Внешний)
const t0_dev = performance.now();

// 2. ВЫПОЛНЯЕМ ОПРОС РЕСУРСОВ
window.DeviceCapabilities.scan();

// 3. БЕТОНИРУЕМ (Замораживаем отчет)
Object.freeze(window.DeviceCapabilities);

// 4. УНИКАЛЬНЫЙ СТОП ЗАМЕР
const duration_dev = (performance.now() - t0_dev).toFixed(4);

// 5. ФИНАЛЬНЫЙ ОТЧЕТ (Теперь он подтверждает готовность всего модуля)
Logger.log('SYSTEM', `Разведка железа завершена(DeviceCabilities): Texture Limit ${DeviceCapabilities.maxTextureSize} за ${duration_dev} мс`, '🔍');