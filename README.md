# Minecraft Skin DB Generator

Source code for [Minecraft Skin DB](https://github.com/dinhero21/minecraft-skin-db)

## Installation

:warning: Make sure you have the TOR daemon installed and running (on port 9050). (`tord` on Linux and Tor Bundle on Windows).

1. Download the repo via `Code > Download ZIP` and *unzip* or `git clone https://github.com/dinhero21/minecraft-skin-db-generator`.
2. Open the directory in which the generator is located. (Should be `minecraft-skin-db-generator`)
3. Inside the `data` directory add `uuid_list.txt` with a list of UUIDs (plain or dashed) or usernames for the skins you want to download.
4. Run `npm install`.
5. Run `npm run build` to build (transpile) the project.
6. Run `npm run run` to start downloading the skins.

The program will then log the download progress, yellow (orange) and red messages are normal, if they are too frequent (>50%) that might mean that your internet connection is not fast enough and you will need to change the settings.

## Configuring

You can change project settings by editing the `settings.ts` file in `src`.

Remember to re-transpile (`npm run build`) the project after each file change.

You can automate this process by running `npm run watch` which will automatically re-transpile and run the project for you. Before running the command, make sure to install the development dependencies with `npm install --include=dev`.
