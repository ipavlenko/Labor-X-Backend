module.exports = {
  apps: [
    {
      name: 'laborx.platform.backend',
      script: 'bin/www',
      watch: ['./'],
      env: {
        PORT: 3000,
        NODE_ENV: 'development',
        DEBUG: '@laborx/platform.backend:*',
        DEBUG_COLORS: true,
        REST: true
      }
    }
  ]
}
