export default {
    auth: {
        domain: "dev-4ddccsmwx5jbfe7t.us.auth0.com",
        clientId: "1WMAi5OVwb4rJpmGAKjmou83jDNG498W",
        authorizationParams: {
            redirect_uri: "http://localhost:4200/login/callback",
            audience: "http://localhost:8080",
        },
    },
    httpInterceptor: {
        allowedList: ['http://localhost:8080/api/orders/**', 'http://localhost:8080/api/checkout/purchase'],
    },
}