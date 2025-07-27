# AI Swing Stock Screener & Bot

This project has been transformed into a powerful suite of tools for stock analysis, consisting of:
1.  A **Desktop Application** built with Electron and React for scanning the market based on your strategy.
2.  A **Discord Bot** for on-demand stock evaluations directly within your Discord server.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (which includes npm)
- [Git](https://git-scm.com/)
- **Google Drive for Desktop** (if you want to use the snapshot feature)

## 1. Project Setup

First, clone the repository and install the necessary dependencies.

```bash
# Clone this repository
git clone <your-repo-url>
cd <your-repo-directory>

# Install dependencies for both the app and the bot
npm install
```
This will install `electron`, `discord.js`, and other required packages.

## 2. Environment Variables

You need to provide API keys for the Gemini AI and the Discord Bot. Create a file named `.env` in the root of the project directory and add the following content:

```env
# Your Google Gemini API Key
API_KEY="YOUR_GEMINI_API_KEY"

# Your Discord Bot Token (from Discord Developer Portal)
DISCORD_BOT_TOKEN="YOUR_DISCORD_BOT_TOKEN"
```
**Important**: Never commit your `.env` file or share your API keys publicly.

### How to get your Discord Bot Token:
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications).
2. Click "New Application". Give it a name (e.g., "Stock Evaluator Bot") and click "Create".
3. Go to the "Bot" tab on the left.
4. Click "Add Bot", then "Yes, do it!".
5. Under the bot's username, click "Reset Token" to reveal and copy your token. This is your `DISCORD_BOT_TOKEN`.
6. Enable the **MESSAGE CONTENT INTENT** under "Privileged Gateway Intents". This is required for the bot to read messages like `!eval AAPL`.
7. Go to the "OAuth2" -> "URL Generator" tab.
8. Select the `bot` scope.
9. In "Bot Permissions", select `Send Messages` and `Embed Links`.
10. Copy the generated URL at the bottom, paste it into your browser, and invite the bot to your server.


## 3. Running the Desktop Application

The desktop app allows you to run scans and save snapshots.

### To Start the App:
```bash
npm start
```
This command launches the Electron application. The first scan will run automatically.

### Features:
- **Scan Now**: Re-runs the AI market scan.
- **Save Snapshot**: After a scan completes, this button becomes active. It saves a JSON file of the current stock list to `G:\My Drive\Stock Reports\`.
  - **Note**: The folder path `G:\My Drive\Stock Reports` is hardcoded. You must have Google Drive for Desktop installed, and this folder must exist for the save to succeed. You can change this path in `main.js` if needed.
- **Evaluate a Ticker**: Get an on-demand analysis for any ticker without affecting the main scan list.

## 4. Running the Discord Bot

The Discord bot runs as a separate process. It will listen for commands in any channel it has access to.

### To Start the Bot:
```bash
npm run bot
```
You should see a message in your console confirming `Bot is online!`.

### How to Use:
In any channel on the Discord server where you invited the bot, type:
```
!eval <TICKER>
```
For example:
```
!eval TSLA
```
The bot will reply with an embedded "Stock Card" containing the AI's analysis based on your strategy.
