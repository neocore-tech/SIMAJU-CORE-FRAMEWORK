#!/bin/bash

# Simaju Core Framework Installer
# ─────────────────────────────────────────────────────────────

# Warna untuk output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Clear terminal
clear

# Tampilkan Logo dari name.txt jika ada
if [ -f "name.txt" ]; then
    echo -e "${BLUE}$(cat name.txt)${NC}"
else
    echo -e "${BLUE}SIMAJU CORE FRAMEWORK${NC}"
fi

echo -e "${BOLD}Starting Installation Process...${NC}\n"

# 1. Cek Node.js
echo -e "📦 Checking dependencies..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}Error: npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v) found.${NC}"

# 2. Install NPM Dependencies
echo -e "\n🚚 Installing NPM packages..."
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dependencies installed successfully.${NC}"
else
    echo -e "${RED}Error: Failed to install dependencies.${NC}"
    exit 1
fi

# 3. Setup Environment File
echo -e "\n⚙️ Setting up environment variables..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✓ .env file created from .env.example.${NC}"
    else
        echo -e "${RED}Warning: .env.example not found. Please create .env manually.${NC}"
    fi
else
    echo -e "💡 .env file already exists, skipping..."
fi

# 4. Make mji executable
echo -e "\n🔧 Setting permissions..."
chmod +x mji
chmod +x simaju
echo -e "${GREEN}✓ Executable permissions set.${NC}"

# 5. Run Database Migrations
echo -e "\n🗄️ Running database migrations (SQLite)..."
./mji run migrate sqlite
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database migrations completed.${NC}"
else
    echo -e "${RED}Warning: Database migrations failed. Please check your DB configuration.${NC}"
fi

# Finalizing
echo -e "\n${BOLD}${GREEN}==============================================${NC}"
echo -e "${BOLD}${GREEN}   SIMAJU CORE INSTALLED SUCCESSFULLY!       ${NC}"
echo -e "${BOLD}${GREEN}==============================================${NC}"
echo -e "\nTo start the development server, run:"
echo -e "${BLUE}  ./mji run dev${NC}\n"
