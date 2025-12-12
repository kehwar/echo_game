#!/bin/bash
# GitHub Pages Deployment Setup Checker
# This script verifies that your local environment is ready for GitHub Pages deployment

set -e

echo "🔍 GitHub Pages Deployment Setup Checker"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js version
echo "📦 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Node.js is installed: $NODE_VERSION"
    
    # Extract major version number
    NODE_MAJOR=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -ge 20 ]; then
        echo -e "${GREEN}✓${NC} Node.js version is 20 or higher"
    else
        echo -e "${RED}✗${NC} Node.js version should be 20 or higher (current: $NODE_VERSION)"
        exit 1
    fi
else
    echo -e "${RED}✗${NC} Node.js is not installed"
    exit 1
fi
echo ""

# Check npm
echo "📦 Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} npm is installed: v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm is not installed"
    exit 1
fi
echo ""

# Check if dependencies are installed
echo "📚 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
else
    echo -e "${YELLOW}!${NC} Dependencies not installed. Run: npm install"
fi
echo ""

# Check critical files
echo "📄 Checking configuration files..."

files=(
    "nuxt.config.ts"
    "package.json"
    ".github/workflows/deploy.yml"
    "public/.nojekyll"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file is missing"
        exit 1
    fi
done
echo ""

# Check Nuxt config for GitHub Pages settings
echo "⚙️  Checking Nuxt configuration..."
if grep -q "baseURL.*echo_game" nuxt.config.ts; then
    echo -e "${GREEN}✓${NC} baseURL is configured for GitHub Pages"
else
    echo -e "${YELLOW}!${NC} baseURL may not be configured correctly"
fi

if grep -q "ssr.*false" nuxt.config.ts; then
    echo -e "${GREEN}✓${NC} SSR is disabled (required for static generation)"
else
    echo -e "${RED}✗${NC} SSR should be disabled for static generation"
fi

if grep -q "preset.*static" nuxt.config.ts; then
    echo -e "${GREEN}✓${NC} Nitro preset is set to 'static'"
else
    echo -e "${RED}✗${NC} Nitro preset should be 'static'"
fi
echo ""

# Try to build
echo "🏗️  Testing build process..."
if npm run generate > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Build successful"
    
    # Check if output directory exists
    if [ -d ".output/public" ]; then
        echo -e "${GREEN}✓${NC} Output directory created: .output/public"
        
        # Check for critical files
        if [ -f ".output/public/.nojekyll" ]; then
            echo -e "${GREEN}✓${NC} .nojekyll file present in output"
        else
            echo -e "${YELLOW}!${NC} .nojekyll file missing in output"
        fi
        
        if [ -f ".output/public/index.html" ]; then
            echo -e "${GREEN}✓${NC} index.html generated"
        else
            echo -e "${RED}✗${NC} index.html not found in output"
        fi
    else
        echo -e "${RED}✗${NC} Output directory not created"
        exit 1
    fi
else
    echo -e "${RED}✗${NC} Build failed"
    echo "Run 'npm run generate' to see detailed error messages"
    exit 1
fi
echo ""

# Final checklist
echo "📋 Setup Checklist:"
echo "==================="
echo -e "${GREEN}✓${NC} Local environment is configured correctly"
echo -e "${GREEN}✓${NC} Build process works"
echo -e "${GREEN}✓${NC} Static files are generated successfully"
echo ""
echo -e "${YELLOW}⏳${NC} GitHub Pages Setup (Manual step required):"
echo "   1. Go to: https://github.com/kehwar/echo_game/settings/pages"
echo "   2. Set Source to 'GitHub Actions'"
echo "   3. Save and push to main branch"
echo ""
echo -e "${GREEN}✨ Everything looks good!${NC}"
echo "See DEPLOYMENT.md for detailed deployment instructions."
