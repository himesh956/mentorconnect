import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import { apiRouter } from './src/server/routes/apiRoutes.ts';
import { setupSocketIO } from './src/server/sockets/socketHandler.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Attach Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setupSocketIO(io);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount REST API endpoints
app.use('/api', apiRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Mentor Connect AI API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    // Development mode: Integrate Vite as middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
    console.log('[Mentor Connect AI] Mounted Vite dev middleware.');
  } else {
    // Production mode: Serve static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[Mentor Connect AI] Serving production static bundle.');
  }

  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Mentor Connect AI] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Mentor Connect AI] Failed to start server:', err);
  process.exit(1);
});
