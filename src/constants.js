const AppConfig = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    USER_COOKIE_KEY: import.meta.env.VITE_USER_COOKIE_KEY,
    API_VERSION_URL: '/api/v1'
}

function createApiPath(path, params = {}) {
    const keys = Object.keys(params);
    const urlParams = keys.map(k => {
        const value = params[k];
        if (typeof(value) === 'undefined') return;
        return `${k}=${encodeURIComponent(value)}`;
    }).filter(v => v);

    const result = AppConfig.API_VERSION_URL + path;
    if (keys.length === 0) return result;

    return result + '?' + urlParams.join('&');
}

const Path = {
    Index: '/',
    Login: '/login',
    User: {
        Upload: '/upload'
    },
    Admin: {
        Index: '/admin',
        NewUser: '/admin/registeruser',
        MediaDetail: (id) => '/admin/media/' + id
    },
    ForgotPassword: '/forgot-password'
};

const ApiEndpoint = {
    Auth: {
        Login: createApiPath('/auth/login'),
        ForgotPassword: createApiPath('/auth/forget_password'),
        CreateUser: createApiPath('/auth/register')
    },
    Post: {
        Create: createApiPath('/posts/store'),
        Single: (id) => createApiPath('/posts/' + id),
        All: (params) => createApiPath('/posts', params),
        Main: (params) => createApiPath('/posts/main', params),
    },
    Banner: {
        All: createApiPath('/banner')
    }
}

const FETCH_START_EVENT = 'fetch-start';
const FETCH_END_EVENT = 'fetch-end';
const FETCH_FAILED_EVENT = 'fetch-failed';

export {
    AppConfig,
    Path,
    ApiEndpoint,
    FETCH_START_EVENT,
    FETCH_END_EVENT,
    FETCH_FAILED_EVENT
}