#!/bin/bash

# Simaju Core Framework - One-Click Installer
# ─────────────────────────────────────────────────────────────

BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'
BOLD='\033[1m'

REPO_URL="https://github.com/neocore-tech/SIMAJU-CORE-FRAMEWORK.git"
TARGET_DIR="simaju-core"

clear
echo -e "${BLUE}==============================================${NC}"
echo -e "${BOLD}   SIMAJU CORE - REMOTE INSTALLER            ${NC}"
echo -e "${BLUE}==============================================${NC}\n"

# 1. Clone Repositori
echo -e "🚀 Cloning repository from GitHub..."
if git clone $REPO_URL $TARGET_DIR; then
    echo -e "${GREEN}✓ Repository cloned successfully.${NC}"
else
    echo -e "${RED}Error: Failed to clone repository.${NC}"
    exit 1
fi

# 2. Masuk ke direktori
cd $TARGET_DIR

# 3. Jalankan install.sh bawaan
if [ -f "install.sh" ]; then
    echo -e "\n📦 Running internal installer..."
    chmod +x install.sh
    ./install.sh
else
    echo -e "${RED}Error: install.sh not found in repository.${NC}"
    exit 1
fi

echo -e "\n${BOLD}${GREEN}All set! Your Simaju Core Framework is ready.${NC}"
echo -e "Location: $(pwd)"
echo -e "Run server: ${BLUE}./mji run dev${NC}\n"
