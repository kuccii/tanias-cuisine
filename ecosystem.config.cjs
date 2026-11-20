module.exports = {
  apps: [{
    name: 'tanias',
    script: './server-run.mjs',
    cwd: '/var/www/tanias-cuisine',
    interpreter: '/usr/bin/node',
    env: {
      NODE_ENV: 'production',
      PORT: 3002,
      SUPABASE_URL: 'https://n8n.qivook.com/supabase/',
      SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwic3ViIjoiYW5vbiIsImlhdCI6MTc5NTIxMTc1OSwiZXhwIjoxODI2NzQ3NzU5fQ.hiMH6tOn8cCOxIY7bSCOAqGw6ChLhxrD_YJ0x0zdtK4',
      SUPABASE_SERVICE_ROLE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZmFsbGVuY2Rfcm9sZSIsImlzcyI6InN1cGFiYXNlIiwic3ViIjoiZmFsbGVuY2Rfcm9sZSIsImlhdCI6MTc5NTIxMTc1OSwiZXhwIjoxODI2NzQ3NzU5fQ.hcqnSls2D0pusDUYliE9hlPrLerS0sXQNJuzMUWkDZc',
      NVIDIA_API_KEY: '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'
    }
  }]
};