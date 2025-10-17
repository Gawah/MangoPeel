#!/bin/bash

# MangoPeel Plugin Installer - Fixed for SteamOS 3.7+ and other Linux distros
# This script installs the fixed MangoPeel plugin that uses MangoHud presets instead of Steam overlay

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}MangoPeel Plugin Installer - Universal Linux Support${NC}"
echo "====================================================="
echo

# Check if MangoHud is installed
if ! command -v mangohud &> /dev/null; then
    echo -e "${RED}ERROR: MangoHud is not installed!${NC}"
    echo "Please install MangoHud first:"
    echo "  - Arch Linux/Manjaro: sudo pacman -S mangohud"
    echo "  - Ubuntu/Debian: sudo apt install mangohud"
    echo "  - Fedora: sudo dnf install mangohud"
    echo "  - OpenSUSE: sudo zypper install mangohud"
    echo "  - Gentoo: sudo emerge media-gfx/mangohud"
    echo "  - NixOS: nix-env -iA nixpkgs.mangohud"
    echo "  - Flatpak: flatpak install flathub org.freedesktop.Platform.VulkanLayer.MangoHud"
    echo "  - SteamOS: MangoHud should be pre-installed"
    exit 1
fi

echo -e "${GREEN}✓ MangoHud found${NC}"

# Check if Decky Loader is installed
# Allow manual override via environment variable
if [ -n "$DECKY_PLUGINS_DIR" ]; then
    echo -e "${YELLOW}Using custom DeckyLoader directory: $DECKY_PLUGINS_DIR${NC}"
    if [ ! -d "$DECKY_PLUGINS_DIR" ]; then
        echo -e "${RED}ERROR: Custom DeckyLoader directory does not exist: $DECKY_PLUGINS_DIR${NC}"
        exit 1
    fi
else
    # Try multiple common locations for DeckyLoader
    DECKY_PLUGINS_DIR=""
    POSSIBLE_DIRS=(
        "$HOME/homebrew/plugins"
        "$HOME/.local/share/Steam/steamapps/common/SteamDeck/homebrew/plugins"
        "$HOME/.steam/steam/steamapps/common/SteamDeck/homebrew/plugins"
        "/home/deck/homebrew/plugins"
    )

    for dir in "${POSSIBLE_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            DECKY_PLUGINS_DIR="$dir"
            break
        fi
    done
fi

if [ -z "$DECKY_PLUGINS_DIR" ]; then
    echo -e "${RED}ERROR: Decky Loader not found!${NC}"
    echo "Searched in the following locations:"
    for dir in "${POSSIBLE_DIRS[@]}"; do
        echo "  - $dir"
    done
    echo
    echo "Please install Decky Loader first: https://github.com/SteamDeckHomebrew/decky-loader"
    echo "Or manually set DECKY_PLUGINS_DIR environment variable to your plugins directory"
    exit 1
fi

echo -e "${GREEN}✓ Decky Loader found${NC}"

# Check if MangoPeel plugin directory exists
PLUGIN_DIR="$DECKY_PLUGINS_DIR/MangoPeel"
if [ ! -d "$PLUGIN_DIR" ]; then
    echo -e "${RED}ERROR: MangoPeel plugin not found!${NC}"
    echo "Please install the original MangoPeel plugin first from the Decky store."
    exit 1
fi

echo -e "${GREEN}✓ MangoPeel plugin found${NC}"

# Backup original main.py
if [ -f "$PLUGIN_DIR/main.py" ]; then
    echo -e "${YELLOW}Creating backup of original main.py...${NC}"
    cp "$PLUGIN_DIR/main.py" "$PLUGIN_DIR/main.py.backup.$(date +%Y%m%d_%H%M%S)"
    echo -e "${GREEN}✓ Backup created${NC}"
fi

# Install fixed main.py
echo -e "${YELLOW}Installing fixed main.py...${NC}"
if [ -f "./main.py" ]; then
    cp "./main.py" "$PLUGIN_DIR/main.py"
    echo -e "${GREEN}✓ Fixed main.py installed${NC}"
else
    echo -e "${RED}ERROR: main.py not found in current directory${NC}"
    exit 1
fi

# The plugin will auto-create presets.conf if it doesn't exist
echo -e "${YELLOW}Checking MangoHud configuration...${NC}"
MANGOHUD_CONFIG_DIR="$HOME/.config/MangoHud"
if [ ! -d "$MANGOHUD_CONFIG_DIR" ]; then
    mkdir -p "$MANGOHUD_CONFIG_DIR"
    echo -e "${GREEN}✓ Created MangoHud config directory${NC}"
fi

echo -e "${GREEN}✓ MangoHud configuration ready${NC}"

echo
echo -e "${GREEN}Installation completed successfully!${NC}"
echo
echo "What was fixed:"
echo "  • Plugin now uses your MangoHud presets instead of Steam overlay"
echo "  • Auto-creates default presets.conf if missing"
echo "  • Compatible with SteamOS 3.7+, Arch, Fedora, and other Linux distros"
echo "  • Improved DeckyLoader detection for various installation locations"
echo
echo "Next steps:"
echo "  1. Restart Steam or reload Decky Loader"
echo "  2. The plugin will automatically create ~/.config/MangoHud/presets.conf"
echo "  3. You can customize presets in that file"
echo "  4. Use the MangoPeel plugin as usual"
echo
echo -e "${YELLOW}Note: Your original main.py has been backed up${NC}"
echo "Location: $PLUGIN_DIR/main.py.backup.*"
echo