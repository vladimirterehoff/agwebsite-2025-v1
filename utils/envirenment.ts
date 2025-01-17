export const FRONT_DOMAIN = process.env.NEXT_PUBLIC_FRONT_DOMAIN || 'https://localhost:3000/';
export const API_DOMAIN   = process.env.NEXT_PUBLIC_API_DOMAIN || 'https://api.cleango-dev.php-dev.attractgroup.com';
export const OAUTH_URL    = `${API_DOMAIN}/api/oauth`;
export const AUTH_URL     = `${API_DOMAIN}/api/auth`;
export const API_URL      = `${API_DOMAIN}/api/v1`;
export const BACKEND_URL  = `${API_DOMAIN}/backend/v1`;
export const S3_SERVER    = 'media/s3/pre-signed';

export const APP_ENV     = process.env.NEXT_PUBLIC_APP_ENV || 'DEV'; //DEV, STAGE, PROD
export const COMPOSE_PROJECT_NAME     = process.env.NEXT_PUBLIC_COMPOSE_PROJECT_NAME || '';

export const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID || 1;
export const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET || 'mkr0se02CkhBQclbUcAcv89kpy3QJMDwL3SBHiiE';

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyC7klUytJW9prH2NCPax3ZC3oG2zX8k0co';