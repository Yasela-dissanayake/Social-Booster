export function createAppLanding() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Social Media Generator</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            padding: 60px 40px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }
        h1 {
            color: #1f2937;
            font-size: 3rem;
            margin-bottom: 10px;
            font-weight: 700;
        }
        .subtitle {
            color: #6b7280;
            font-size: 1.2rem;
            margin-bottom: 40px;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 30px;
            margin: 40px 0;
        }
        .feature {
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
        }
        .feature h3 {
            color: #1f2937;
            margin-bottom: 10px;
        }
        .feature p {
            color: #6b7280;
            font-size: 0.9rem;
        }
        .btn-group {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 40px;
        }
        .btn {
            display: inline-block;
            padding: 15px 30px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1rem;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        .btn-primary {
            background: #3b82f6;
            color: white;
        }
        .btn-primary:hover {
            background: #2563eb;
            transform: translateY(-2px);
        }
        .btn-secondary {
            background: #6b7280;
            color: white;
        }
        .btn-secondary:hover {
            background: #4b5563;
            transform: translateY(-2px);
        }
        .stats {
            display: flex;
            justify-content: space-around;
            margin: 30px 0;
            padding: 20px;
            background: #f1f5f9;
            border-radius: 12px;
        }
        .stat {
            text-align: center;
        }
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #3b82f6;
        }
        .stat-label {
            color: #6b7280;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>AI Social Media Generator</h1>
        <p class="subtitle">Create viral content for TikTok, Instagram, YouTube and more with your own AI engine</p>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-number">$0</div>
                <div class="stat-label">Monthly Cost</div>
            </div>
            <div class="stat">
                <div class="stat-number">250ms</div>
                <div class="stat-label">Response Time</div>
            </div>
            <div class="stat">
                <div class="stat-number">100%</div>
                <div class="stat-label">Success Rate</div>
            </div>
        </div>

        <div class="features">
            <div class="feature">
                <h3>Custom AI Engine</h3>
                <p>Your own AI system with zero subscription costs</p>
            </div>
            <div class="feature">
                <h3>Multi-Platform</h3>
                <p>Optimized content for all major social platforms</p>
            </div>
            <div class="feature">
                <h3>Viral Optimization</h3>
                <p>Built-in viral patterns and engagement triggers</p>
            </div>
        </div>

        <div class="btn-group">
            <a href="/app" class="btn btn-primary">Launch Main App</a>
            <a href="/admin" class="btn btn-secondary">Admin Dashboard</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 0.8rem;">
                Powered by your custom AI engine • Zero ongoing costs • Unlimited usage
            </p>
        </div>
    </div>
</body>
</html>
  `;
}