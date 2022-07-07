// Этот файл импортится только в develop режиме при запуске из под dev сервера
// Описывает как проксировать вызовы до бэкэнда

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:5093',
            changeOrigin: true,
        })
    );
};