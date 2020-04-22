// camelCase since as opposed to global constants these can have different values
export const isProduction = process.env.NODE_ENV === 'production'
export const appName = process.env.APP_NAME || 'no app name set'
export const buildTime = process.env.BUILD_TIME || null
