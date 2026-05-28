#!/bin/bash
# BICTA Database Setup Script
# Run this after getting your DATABASE_URL from Railway

echo "========================================"
echo "  BICTA Database Setup"
echo "========================================"
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ ERROR: DATABASE_URL is not set!"
    echo ""
    echo "To fix this:"
    echo "1. Go to Railway.app → your MySQL service → Connect tab"
    echo "2. Copy the MYSQL_URL value"
    echo "3. Run: export DATABASE_URL='paste-url-here'"
    echo "   (Replace 'paste-url-here' with your actual URL)"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ DATABASE_URL found"
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🚀 Pushing database schema (creating all tables)..."
npx drizzle-kit push

echo ""
echo "🌱 Seeding sample data..."
npx tsx db/seed.ts

echo ""
echo "========================================"
echo "  ✅ Database setup complete!"
echo "========================================"
echo ""
echo "Your database now has all tables:"
echo "  • users, events, programs, speakers"
echo "  • partners, alumni, advisers"
echo "  • competition system tables"
echo "  • contact submissions, impact metrics"
echo "  • site settings, content blocks"
echo ""
