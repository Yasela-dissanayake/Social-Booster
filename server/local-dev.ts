import express, { type Request, Response, NextFunction } from "express";
import { setupVite, log } from "./vite";
import { createServer } from "http";

const app = express();

// Set trust proxy for rate limiting
app.set('trust proxy', true);

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Simple logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  next();
});

// Simple API routes for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Local development server is running' });
});

app.get('/api/dashboard/stats/:userId', (req, res) => {
  res.json({
    contentGenerated: 42,
    totalViews: 12500,
    engagement: 85.5,
    costSavings: 247.50
  });
});

app.get('/api/cost-savings/:userId', (req, res) => {
  res.json({
    id: 1,
    userId: parseInt(req.params.userId),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    savings: 247.50,
    description: "Local development savings"
  });
});

// Error handling
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

(async () => {
  try {
    const server = createServer(app);
    
    // Setup Vite for frontend
    await setupVite(app, server);
    
    const port = 5000;
    server.listen(port, '0.0.0.0', () => {
      log(`Local development server running on port ${port}`);
      log(`Frontend: http://localhost:${port}`);
      log(`API Health: http://localhost:${port}/api/health`);
    });
    
  } catch (error) {
    console.error('Failed to start local development server:', error);
    process.exit(1);
  }
})();