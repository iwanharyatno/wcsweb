const AppConfig = {
    API_BASE_URL: import.meta.env.API_BASE_URL,
    USER_COOKIE_KEY: import.meta.env.USER_COOKIE_KEY,
    API_VERSION_URL: '/api/v1'
}

function createApiPath(path) {
    return AppConfig.API_VERSION_URL + path;
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
    ForgotPassword: '/forgot-password',
    MediaList: {
        Index: '/list',
        Video: '/list/video',
        Photo: '/list/photo',
        Audio: '/list/audio',
    }
};

const ApiEndpoint = {
    Auth: {
        Login: createApiPath('/auth/login'),
        ForgetPassword: createApiPath('/auth/forget_password'),
        CreateUser: createApiPath('/auth/register')
    },
    Post: {
        Create: createApiPath('/posts/store'),
        GetAll: createApiPath('/posts'),
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