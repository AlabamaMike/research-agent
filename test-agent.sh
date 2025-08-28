#!/bin/bash

# Test script for Strategy Consulting Agent

echo "🧪 Testing Strategy Consulting Agent..."
echo "========================================="

# Build the project first
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Test 1: Help command
echo "Test 1: Help command"
node dist/cli.js --help > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Help command works"
else
    echo "❌ Help command failed"
fi
echo ""

# Test 2: Company analysis with demo data
echo "Test 2: Company analysis (will use demo data)"
echo "Tesla" | node dist/cli.js analyze --framework swot --depth quick > test-output.txt 2>&1
if [ $? -eq 0 ] && grep -q "SWOT Analysis" test-output.txt; then
    echo "✅ Company analysis works"
else
    echo "❌ Company analysis failed"
    cat test-output.txt
fi
echo ""

# Clean up
rm -f test-output.txt

echo "========================================="
echo "✅ Tests completed!"
echo ""
echo "To run the agent interactively, use:"
echo "  npm start"
echo ""
echo "Or run specific commands:"
echo "  node dist/cli.js analyze --company 'Tesla' --framework swot"
echo "  node dist/cli.js market-entry --industry 'renewable energy' --region 'Europe'"
echo "  node dist/cli.js competitive-analysis --company 'Netflix' --competitors 'Disney+,HBO Max'"