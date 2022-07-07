export const appConfig = {
    clientId: process.env.REACT_APP_CLIENT_ID,
    baseUrl: process.env.REACT_APP_BASE_URL,
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development'
};

export default appConfig;