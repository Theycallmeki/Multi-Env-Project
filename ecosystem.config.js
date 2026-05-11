module.exports = {
  apps: [
    {
      name: 'app-development',
      script: './src/server.js',
      watch: true,
      ignore_watch: ['node_modules', 'uploads', 'logs'],
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
    },
    {
      name: 'app-staging',
      script: './src/server.js',
      watch: false,
      env: {
        NODE_ENV: 'staging',
        PORT: 4000,
      },
    },
    {
      name: 'app-production',
      script: './src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
    },
  ],
};
