# MangoPeel Plugin - Fixed for SteamOS 3.7+

This is a fixed version of the MangoPeel plugin that works with SteamOS 3.7+ and uses MangoHud presets instead of Steam's overlay system.

## What was fixed

- **SteamOS 3.7+ compatibility**: Plugin now works with latest SteamOS updates
- **MangoHud presets support**: Uses your `~/.config/MangoHud/presets.conf` file instead of hardcoded Steam configs
- **Auto-creation**: Automatically creates default presets.conf if it doesn't exist
- **Arch Linux support**: Tested and working on Arch Linux systems

## Installation

### Prerequisites

1. **MangoHud** must be installed:
   - Arch Linux: `sudo pacman -S mangohud`
   - Ubuntu/Debian: `sudo apt install mangohud`
   - Fedora: `sudo dnf install mangohud`

2. **Decky Loader** must be installed
3. **Original MangoPeel plugin** must be installed from Decky store

### Quick Install

```bash
cd MangoPeel-Fixed
chmod +x install.sh
./install.sh
```

### Manual Install

1. Backup your original `main.py`:
   ```bash
   cp ~/homebrew/plugins/MangoPeel/main.py ~/homebrew/plugins/MangoPeel/main.py.backup
   ```

2. Copy the fixed `main.py`:
   ```bash
   cp main.py ~/homebrew/plugins/MangoPeel/main.py
   ```

3. Restart Steam or reload Decky Loader

## How it works

The plugin now:

1. **First** checks if you've set custom configs through the plugin UI
2. **Then** falls back to your MangoHud presets from `~/.config/MangoHud/presets.conf`
3. **Finally** uses the original Steam configs as a last resort

## Presets Configuration

The plugin will automatically create a `presets.conf` file with 5 presets (0-4) if it doesn't exist:

- **Preset 0**: No display (hidden overlay)
- **Preset 1**: FPS only (minimal display)
- **Preset 2**: Balanced (FPS, CPU, GPU, RAM with horizontal layout)
- **Preset 3**: Detailed (temperatures, VRAM, I/O, system info)
- **Preset 4**: Full (all available metrics)

You can customize these presets by editing `~/.config/MangoHud/presets.conf`.

### Example preset format:
```
[preset 1]
fps
gpu_stats
cpu_stats
ram
frametime
```

## Troubleshooting

### Plugin not working
- Check that MangoHud is installed: `which mangohud`
- Verify the plugin directory exists: `ls ~/homebrew/plugins/MangoPeel/`
- Check the log file: `tail -f /tmp/MangoPeel.log`

### Presets not loading
- Check if presets.conf exists: `ls ~/.config/MangoHud/presets.conf`
- Verify the format matches the example above
- Use the plugin's reload function

### Restore original
If you want to restore the original plugin:
```bash
cp ~/homebrew/plugins/MangoPeel/main.py.backup ~/homebrew/plugins/MangoPeel/main.py
```

## Files in this package

- `main.py` - Fixed plugin code
- `install.sh` - Automated installer script
- `plugin.json` - Plugin metadata
- `package.json` - Package information
- `LICENSE` - License file
- `dist/` - Built frontend assets (if available)

## Credits

- Original MangoPeel plugin by [yxx](https://github.com/Gawah/MangoPeel)
- SteamOS 3.7+ fix and MangoHud presets support added
- Tested on Arch Linux and SteamOS

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review the log file at `/tmp/MangoPeel.log`
3. Ensure all prerequisites are installed
4. Try the manual installation method