import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { aiSecurity } from "./security-service";

const app = express();

// Apply security middleware
const rateLimiters = aiSecurity.createRateLimiters();
const helmetConfig = aiSecurity.getHelmetConfig();

// Skip helmet for download routes
app.use((req, res, next) => {
  if (req.path.startsWith('/admin/download/')) {
    return next();
  }
  helmetConfig(req, res, next);
});

app.use('/api/', rateLimiters.generalLimiter);
app.use('/api/auth/', rateLimiters.authLimiter);
app.use('/api/ai/', rateLimiters.aiLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      console.log(
        `${new Date().toLocaleTimeString()} [express] ${req.method} ${path} ${res.statusCode} in ${duration}ms`
      );
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Simple static file serving for production (no Vite)
  if (process.env.NODE_ENV === "production") {
    // Serve static files from public directory if it exists
    const path = await import("path");
    const fs = await import("fs");
    
    const publicDir = path.join(process.cwd(), "public");
    if (fs.existsSync(publicDir)) {
      app.use(express.static(publicDir));
    }
    
    // Catch-all handler for SPA routing
    app.get("*", (req, res) => {
      const indexPath = path.join(publicDir, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).json({ message: "Frontend not found" });
      }
    });
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    console.error(`[express] Error ${status}: ${message}`);
    console.error(err.stack);
  });

  const PORT = Number(process.env.PORT) || 3000;
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(`📡 API endpoints available at http://localhost:${PORT}/api/`);
    if (process.env.NODE_ENV === "production") {
      console.log(`🌐 Production backend ready for API requests`);
    }
  });
})();