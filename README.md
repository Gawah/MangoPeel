# MangoPeel

[![GitHub downloads](https://img.shields.io/github/downloads/Gawah/MangoPeel/total?color=green&logo=github)](https://github.com/Gawah/MangoPeel/releases)
[![GitHub forks](https://img.shields.io/github/forks/Gawah/MangoPeel?color=green&logo=github)](https://github.com/Gawah/MangoPeel/forks)

[简体中文](README_CN.md) | [English](README.md)

MangoPeel is a Steam Deck plugin used for [decky-loader](https://github.com/SteamDeckHomebrew/decky-loader). It allows users to configure their preferred MangoApp styles to override Steam's default five styles. Its functionality is based on finding the MangoApp configuration file and quickly configuring various MangoApp parameters through a shortcut menu UI, which is then written to the configuration file. Additionally, it uses [pyinotify](https://pypi.org/project/pyinotify/) to monitor the configuration file in real time, achieving a customized MangoApp style.

## Plugin effect screenshots

![](assets/20230527214708_1.jpg)
![](assets/20230527214713_1.jpg)

## Known issues
- If the CPU usage is too high, it may cause the pyinotify to stop working. At this time, switching Steam styles may not replace the custom style. Simply switch Steam styles again when the CPU usage is normal.
- If the font ratio adjustment of MangoApp is too large, it may cause abnormal layout intervals. This is a bug in [mangohud](https://github.com/flightlessmango/MangoHud) and can be fixed by waiting for a patch. 
- Some parameters, such as colors and corner radius, can be configured in real time in MangoHud, but changing them after MangoApp has started will not take effect. Therefore, they have not been added to the shortcut menu frontend yet. Waiting for [mangohud](https://github.com/flightlessmango/MangoHud) to fix this issue, or finding another way to make changes effective, before adding them to the configuration list.

## Future goals

- [x]Custom text format
- [ ]Add various color modification parameters
- [ ]Allow adding custom parameters

## issues
   If you encounter any problems, please submit them through [issues](https://github.com/Gawah/MangoPeel/issues).