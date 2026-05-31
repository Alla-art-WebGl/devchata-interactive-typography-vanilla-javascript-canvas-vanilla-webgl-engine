/**
 * TYPECHECK.js — Служба безопасности данных (БЕТОН)
 * Роль: Проверка качества цифр и объектов перед тем, как пустить их в расчеты.
 */

window.TypeCheck = {
    /**
     * isNum — Проверяет, является ли значение "здоровым" числом.
     */
    isNum(v) {
        return typeof v === 'number' && !isNaN(v) && isFinite(v);
    },

    /**
     * exists — Проверяет, что данные физически существуют (не пустота).
     */
    exists(v) {
        return v !== undefined && v !== null;
    },

    /**
     * isArray — Проверяет, является ли объект списком (массивом).
     * Важно для оцифровки букв.
     */
    isArray(v) {
        return Array.isArray(v) && v.length > 0;
    }
};

// --- АТОМАРНЫЙ СТАНДАРТ ЗАПУСКА ---

const t0_check = performance.now();

// Бетонируем охранника, чтобы его правила никто не мог подменить
Object.freeze(window.TypeCheck);

const duration_check = (performance.now() - t0_check).toFixed(4);

// Финальный рапорт (используем иконку щита)
if (window.Logger) {
    Logger.log('SYSTEM', `Служба безопасности (TypeCheck) активна за ${duration_check} мс`, '🛡️');
}