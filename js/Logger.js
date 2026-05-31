/**
 * LOGGER.js — Универсальный командный центр (БЕТОН)
 * Роль: Вывод любых системных данных в красивом формате.
 */
window.Logger = {
    styles: {
        SYSTEM:   'background: #0044ff; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;',
        STATE:    'background: #ff00ff; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;', 
        DATA:     'background: #ffaa00; color: black; padding: 2px 8px; border-radius: 4px; font-weight: bold;',
        STORAGE:  'background: #006600; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;',
        PHYSICS:  'background: #7700ff; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;',
        STATS:    'color: #008800; font-weight: bold; font-family: monospace; font-size: 12px;',
        ERROR:    'background: #ff0000; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
    },

    /**
     * log — Универсальный метод вывода.
     * @param {string} type — Ключ из стилей (SYSTEM, PHYSICS и т.д.)
     * @param {string} message — Сообщение
     * @param {string} icon — Иконка (передается самим файлом, например 🌀 или 💎)
     */
    log(type, message, icon = "—") {
        const prefix = window.IDENTITY ? IDENTITY.name : "SYSTEM";
        const style = this.styles[type] || 'color: gray;';
        
        if (type === 'STATS') {
            console.groupCollapsed(`%c${icon} ${message}`, style);
            console.log(`Time: ${new Date().toLocaleTimeString()}`);
            console.groupEnd();
            return; 
        }

        if (type === 'STATE') console.log('\n'); 

        console.log(
            `%c${prefix}%c %c${icon} ${type}%c ${message}`,
            'color: #777; font-family: monospace; font-size: 10px;', 
            '', style, 'color: #000; font-weight: 500;'
        );
        
    },

    // Универсальная группа без привязки к "песку"
    group(name, icon = "🔥") {
        console.log('\n' + '—'.repeat(45));
        console.log(`%c ${icon} НАЧАЛО ПРОЦЕССА: ${name.toUpperCase()} `, 'color: #ffaa00; font-size: 14px; font-weight: bold;');
    },

    groupEnd(message = "ПРОЦЕСС ЗАВЕРШЕН", icon = "✨") {
        console.log(`%c ${icon} ${message} `, 'color: #008800; font-weight: bold; font-size: 12px;');
        console.log('—'.repeat(45) + '\n');
    }
};

Object.freeze(window.Logger);

window.Logger.log('SYSTEM', 'Голос системы настроен и готов к работе', '🎤');