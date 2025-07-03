#!/bin/bash
# Simple local development server without database dependencies

echo "Starting local development server..."
echo "This bypasses database initialization for quick testing"

NODE_ENV=development tsx server/local-dev.ts