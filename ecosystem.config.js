module.exports = {
  apps: [{
    name: 'topheroes-bot',
    script: 'index.js',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 5000,
    env: {
      NODE_ENV: 'production'
    }
  }]
};
