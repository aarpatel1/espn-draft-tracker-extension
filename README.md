# ESPN Fantasy Football Draft Tracker

A Chrome extension that monitors the ESPN Fantasy Football draft board in real time using a MutationObserver.

## What it does:
- Watches for changes in the draft board DOM
- Extracts names of drafted players
- Logs them to the browser console

## Setup

1. Go to `chrome://extensions` and enable **Developer Mode**
2. Click **"Load Unpacked"** and select this folder
3. Navigate to your ESPN draft room
4. Open **DevTools > Console** to see drafted players log in real time

## TODOs

- Test ESPN selectors to see if live updates work
- Optionally display suggestions via floating UI
- Connect to a backend AI for live recommendations
