export const PRODUCTION = false

const Constatnt = {

    // API_KEY: process.env.REACT_APP_API_KEY,
    // API_BASE_URL: PRODUCTION ? process.env.REACT_APP_API_BASE_URL : process.env.REACT_APP_LIVE_API_BASE_URL,

    APP_NAME: process.env.APP_NAME,
    API_KEY: process.env.REACT_APP_API_KEY,
    CONTENT_TYPE: process.env.REACT_CONTENT_TYPE || 'Application/json',
    API_BASE_URL: PRODUCTION ? process.env.REACT_APP_LIVE_API_BASE_URL : process.env.REACT_APP_DEVELOPMENT_API_BASE_URL,
    IS_ENCREPT: false,
    PLATFORM: 'AnDroId@Trace',
    // # ----------------------------- Encreption keys --------------------------------------

    KEY: process.env.REACT_APP_KEY,
    IV: process.env.REACT_APP_IV,

    BASE_URL: 'assets/images/page-images/',
    LANGUAGE: localStorage.getItem('language') == 'gu' ? localStorage.getItem('language') : 'en',
    per_page: 10,
    POET_LOGO: 'https://sha3ri-dev.s3.me-south-1.amazonaws.com/profile_image/1726821004260.png',
    SPORT_LOGO: `${process.env.PUBLIC_URL + '/dist/images/SportLogo.svg'}`,

    // --------------------------- Code manage ---------------------------------------

    SUCCESS: '1',
    INVALID_OR_FAIL: '0',
    NO_DATA_FOUND: '2',
    DELETE_ACCOUNT: '3',
    USER_SESSION_EXPIRE: '-1',

    // --------------------------local storage creandtials-----------------------------------------

    LOGIN_KEY: "ASTRO_is_login",
    AUTH_KEY: 'ASTRO_auth',
    ACCESS_TOKEN_KEY: 'ASTRO_access_token',
    REFRESH_TOKEN_KEY: 'ASTRO_refresh_token',
    LANGUAGE_KEY: 'ASTRO_language',
    ROLE_KEY: 'ASTRO_role',
    THEME_KEY: 'ASTRO_theme',

    ROLE: 'admin',
}

// # ----------------------------- S3 bucket keys --------------------------------------

export const PUBLIC_URL = process.env.PUBLIC_URL;
export const AWS_STORAGE_BUCKET_NAME = process.env.REACT_APP_AWS_STORAGE_BUCKET_NAME;
export const AWS_ACCESS_KEY_ID = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
export const AWS_S3_REGION_NAME = process.env.REACT_APP_AWS_S3_REGION_NAME;

export const SEARCH_DELAY = 1000;
export const PER_PAGE_DATA = 8;
export const COUNT_PER_PAGE = 10;

export const AwsFolder = {
    PHOTO_SHARE: 'photo_share',
    PROFILE_IMAGE: 'Profileimage',
    BLOG_IMAGE: 'blogs',
    CATEGORY_IMAGE: 'Category',
    CELEBRITY_IMAGE: 'celebrity',
    BANNER_IMAGE: 'Banner',
    NEWS_IMAGE: 'News'
};

// PROFILE_IMAGE: `${process.env.s3_URL}Profileimage/`,
// BLOG_IMAGE:`${process.env.s3_URL}blogs/`,
// CELEBRITY_IMAGE:`${process.env.s3_URL}celebrity/`,
// CELEBRITY_THUMBNAIL:`${process.env.s3_URL}celebrity/`,

export const ModelName = {
    POST_MODEL: 'POSTMODEL',
    DELETE_MODEL: 'DELETEMODEL',
    FAQ_MODEL: 'FAQMODEL',
    LOGOUT_MODEL: 'LOGOUTMODEL',
};

export const Codes = {
    SUCCESS: "1",
    INTERNAL_ERROR: "0",
    VALIDATION_ERROR: "0",
    UNAUTHORIZED: "-1",
    EXPIRE: "-2",
    INACTIVE: "3",
    NOT_FOUND: "2",
    ERROR: "0"
}

// const Codes = {
//     SUCCESS: 1,
//     INTERNAL_ERROR: 0,
//     VALIDATION_ERROR: 0,
//     UNAUTHORIZED: -1,
//     EXPIRE: -2,
//     INACTIVE: 3,
//     NOT_FOUND: 2,
//     ERROR:0
// }

export default Constatnt