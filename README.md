# Sudoku
Node.js Sudoku

Open source Sudoku implementation in Node.js

Contains a self-contained Node.js server that runs on port 8080 by default, but is configurable.
A JSON database of initial game configurations is included in gameConfigs.json.
When "New game" option is selected, a random game from gameConfigs.json is loaded.
On selecting "Save Game" option during game, the game is saved to content/db/savedGame.json.
Saved game can be loaded using "Load Game" option on home page.
Verify Game option specifies whether any Sudoku rules are violated in current gameplay.

Usage:
node index.js [port=<port>] [home=<dirname>] [mode=<default|admin>]
Default values: port=8080,home=./content,mode=default
Game home page: http://localhost:<port>/home

Third-party components:
* jQuery 2.1.3 (included in content/scripts)
