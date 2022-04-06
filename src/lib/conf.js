export const dev = true
export const basePath = "/simple-game-maker"
export const baseURL = "https://jameslinimk.github.io/simple-game-maker"

/**
 * @param {string} path
 * @returns {string} new path
 */
export const parseHref = (path) => (dev ? path : `${basePath}${path}`)
