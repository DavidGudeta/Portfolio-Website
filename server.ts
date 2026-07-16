import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import propertyRoutes from './server/routes/properties';
import userRoutes from './server/routes/users';
import testimonialRoutes from './server/routes/testimonials';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { db } from './server/utils/firebase';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for development with Vite
  }));
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());

  // API Routes
  app.use('/api/properties', propertyRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/testimonials', testimonialRoutes);

  // Health check
  app.get('/api/health', async (req, res) => {
    try {
      const collections = await db.listCollections();
      res.json({ 
        status: 'ok', 
        firestore: 'connected',
        collections: collections.map(c => c.id),
        timestamp: new Date().toISOString() 
      });
    } catch (error: any) {
      res.json({ 
        status: 'error', 
        firestore: 'error',
        error: error.message,
        timestamp: new Date().toISOString() 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
