/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
    analyticsId: 'ABCD',
    webpackDevMiddleware: config => {
        config.watchOptions.poll = 300
        return config
    }
}

module.exports = nextConfig

// module.exports = {
//     webpackDevMiddleware: config => {
//         config.watchOptions.poll = 300
//         return config
//     }
// }