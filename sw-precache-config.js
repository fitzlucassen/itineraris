module.exports = {
    staticFileGlobs: [
        'dist/**.html',
        'dist/**.js',
        'dist/**.css',
        'dist/**.png',
        'dist/**.webp',
        'dist/**.eot',
        'dist/**.svg',
        'dist/**.woff',
        'dist/**.woff2',
        'dist/**.ttf',
        'dist/assets/markers/*'
    ],
    root: 'dist',
    stripPrefix: 'dist/',
    navigateFallback: '/index.html',
    runtimeCaching: [{
        urlPattern: /itineraris\.fr/,
        handler: 'networkFirst'
    }]
};