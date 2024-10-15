const { env } = process;

// Essentials
export const root = new URL("./", import.meta.url).pathname;
export const NODE_ENV = env.NODE_ENV || "production";
export const PORT = env.PORT || 8080;
export const SERVER_TIME_ZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;


// General
export const url = env.SITE_URL || "http://localhost:" + PORT;
export const year = new Date().getFullYear();

// Content Security Policy
export const csp = `upgrade-insecure-requests;
                    default-src 'none';
                    child-src 'none';
                    frame-src 'none';
                    frame-ancestors 'none';
                    media-src 'self';
                    base-uri 'none';
                    object-src 'none';
                    manifest-src 'self';
                    img-src 'self';
                    connect-src 'self';
                    font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
                    style-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;
                    script-src 'self';
                    worker-src 'self';
                    form-action 'none';
                    `.replace(/\s/g, " ");