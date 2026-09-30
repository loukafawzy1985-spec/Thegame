const fs = require('fs');
const path = require('path');

const assets = JSON.parse(fs.readFileSync(path.join(__dirname, '../assets-base64.json'), 'utf8'));

const boardImgBase64 = assets.board;
const titleImgBase64 = assets.title;
const avatarImgBase64 = assets.avatar;

const rawBoardUrl = "https://raw.githubusercontent.com/cs0028monglish-cmd/pictures-for-my-site-/main/snakes%20and%20Ladder.png";
const rawTitleUrl = "https://raw.githubusercontent.com/cs0028monglish-cmd/pictures-for-my-site-/main/title%20for%20snakes%20and%20ladder%20.png";
const rawAvatarUrl = "https://raw.githubusercontent.com/cs0028monglish-cmd/pictures-for-my-site-/main/snakes%20and%20ladder%203.png";

const htmlContent = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Snakes and Ladder</title>
  <meta name="description" content="An interactive educational Snakes and Ladder learning game featuring 1-5 players, CPU mode, customizable questions, 3D dice, and sound effects.">
  <meta property="og:title" content="Snakes and Ladder">
  <meta property="og:description" content="An interactive educational Snakes and Ladder learning game featuring 1-5 players, CPU mode, customizable questions, 3D dice, and sound effects.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <style>
    /* CSS Reset & Base */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --navy-deep: #050d24;
      --navy-mid: #0b1a42;
      --navy-royal: #0c2b75;
      --blue-accent: #0876ed;
      --cyan-glow: #00d2ff;
      --cyan-bright: #40e8ff;
      --gold-primary: #ffd85b;
      --gold-deep: #d4a017;
      --gold-halo: rgba(255, 216, 91, 0.45);
      
      --color-p1: #ff5d66; /* Coral */
      --color-p2: #1878ee; /* Blue */
      --color-p3: #18a75b; /* Green */
      --color-p4: #8a4de1; /* Purple */
      --color-p5: #ef8b20; /* Orange */

      --font-rounded: "Trebuchet MS", "Arial Rounded MT Bold", system-ui, -apple-system, sans-serif;
    }

    body {
      font-family: var(--font-rounded);
      background: radial-gradient(circle at 50% 20%, #0f2c6e 0%, #0a1b44 45%, #050c20 100%);
      background-attachment: fixed;
      color: #ffffff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow-x: hidden;
      line-height: 1.4;
      -webkit-font-smoothing: antialiased;
    }

    /* Skip link for accessibility */
    .skip-link {
      position: absolute;
      top: -60px;
      left: 10px;
      background: var(--gold-primary);
      color: #050d24;
      padding: 8px 16px;
      font-weight: bold;
      border-radius: 8px;
      z-index: 1000;
      transition: top 0.2s ease;
      text-decoration: none;
    }
    .skip-link:focus {
      top: 10px;
    }

    /* Focus styling */
    :focus-visible {
      outline: 3px solid var(--gold-primary);
      outline-offset: 3px;
    }

    /* App container */
    .app-wrapper {
      width: 100%;
      max-width: 1320px;
      margin: 0 auto;
      padding: 12px 18px 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* Header Bar */
    header.game-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0 16px;
    }

    .header-title-container {
      display: flex;
      align-items: center;
    }

    .header-title-img {
      width: min(72vw, 720px);
      height: 120px;
      object-fit: cover;
      object-position: left 40%;
      filter: drop-shadow(0 6px 16px rgba(2, 20, 60, 0.9));
      display: block;
    }

    @media (max-width: 480px) {
      .header-title-img {
        width: min(64vw, 250px);
        height: 46px;
      }
    }

    .header-sound-btn {
      background: linear-gradient(135deg, #10337c 0%, #0a2055 100%);
      color: #ffffff;
      border: 2px solid var(--cyan-bright);
      padding: 8px 16px;
      border-radius: 30px;
      font-size: clamp(13px, 1.8vw, 15px);
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);
      transition: all 0.2s ease;
      user-select: none;
      white-space: nowrap;
    }
    .header-sound-btn:hover {
      background: linear-gradient(135deg, #1848b0 0%, #0e2e77 100%);
      box-shadow: 0 0 12px var(--cyan-glow), 0 4px 12px rgba(0, 0, 0, 0.5);
      transform: translateY(-1px);
    }
    .header-sound-btn:active {
      transform: translateY(1px);
    }

    /* Screen management */
    .screen-section {
      width: 100%;
      display: none;
    }
    .screen-section.active {
      display: block;
    }

    /* SETTINGS SCREEN */
    .settings-container {
      width: 100%;
      max-width: 820px;
      margin: 0 auto;
      background: linear-gradient(180deg, rgba(11, 26, 66, 0.92) 0%, rgba(5, 13, 36, 0.96) 100%);
      border: 3px solid var(--cyan-bright);
      box-shadow: 0 0 35px rgba(0, 210, 255, 0.35), 0 14px 40px rgba(0, 0, 0, 0.7);
      border-radius: 24px;
      padding: clamp(18px, 4vw, 36px);
      backdrop-filter: blur(10px);
    }

    .settings-heading {
      font-size: clamp(24px, 4vw, 34px);
      font-weight: 800;
      color: var(--gold-primary);
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7), 0 0 20px var(--gold-halo);
      text-align: center;
      margin-bottom: 6px;
    }

    .settings-subtitle {
      font-size: clamp(14px, 2vw, 17px);
      color: #d8e5ff;
      text-align: center;
      margin-bottom: 24px;
    }

    .settings-group {
      margin-bottom: 24px;
    }

    .group-label {
      font-size: 16px;
      font-weight: 700;
      color: var(--cyan-bright);
      margin-bottom: 12px;
      display: block;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    /* Mode selection cards */
    .mode-cards-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    @media (max-width: 580px) {
      .mode-cards-grid {
        grid-template-columns: 1fr;
      }
    }

    .mode-card {
      background: linear-gradient(135deg, rgba(16, 51, 124, 0.6) 0%, rgba(8, 26, 70, 0.8) 100%);
      border: 2px solid rgba(64, 232, 255, 0.4);
      border-radius: 16px;
      padding: 18px 20px;
      cursor: pointer;
      text-align: left;
      color: #ffffff;
      font-family: inherit;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
      transition: all 0.25s ease;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .mode-card:hover {
      border-color: var(--cyan-glow);
      background: linear-gradient(135deg, rgba(24, 72, 176, 0.7) 0%, rgba(12, 38, 102, 0.9) 100%);
      box-shadow: 0 0 16px rgba(0, 210, 255, 0.4);
      transform: translateY(-2px);
    }

    .mode-card[aria-pressed="true"] {
      border: 3px solid var(--gold-primary);
      background: linear-gradient(135deg, rgba(30, 80, 190, 0.85) 0%, rgba(15, 45, 115, 0.95) 100%);
      box-shadow: 0 0 20px rgba(255, 216, 91, 0.5), inset 0 0 14px rgba(64, 232, 255, 0.3);
      transform: scale(1.02);
    }

    .mode-card-title {
      font-size: 19px;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .mode-card[aria-pressed="true"] .mode-card-title {
      color: var(--gold-primary);
    }

    .mode-card-desc {
      font-size: 13px;
      color: #c0d4ff;
    }

    /* Player Count Buttons */
    .player-count-row {
      display: flex;
      gap: 10px;
      margin-top: 14px;
      align-items: center;
    }

    .count-btn {
      flex: 1;
      padding: 10px 14px;
      border-radius: 12px;
      background: #092055;
      border: 2px solid rgba(64, 232, 255, 0.35);
      color: #ffffff;
      font-family: inherit;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .count-btn:hover {
      border-color: var(--cyan-glow);
      background: #103482;
    }
    .count-btn[aria-pressed="true"] {
      background: var(--blue-accent);
      border-color: var(--gold-primary);
      box-shadow: 0 0 14px rgba(255, 216, 91, 0.5);
      color: #ffffff;
      transform: scale(1.05);
    }

    /* Player Names section */
    .player-names-inputs {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .name-input-row {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(8, 22, 58, 0.7);
      border: 1px solid rgba(64, 232, 255, 0.25);
      padding: 8px 14px;
      border-radius: 14px;
    }

    .player-dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.5);
      flex-shrink: 0;
    }

    .name-input {
      flex: 1;
      background: transparent;
      border: none;
      color: #ffffff;
      font-family: inherit;
      font-size: 15px;
      font-weight: 600;
      outline: none;
      padding: 4px;
    }
    .name-input::placeholder {
      color: #8da4d0;
      font-weight: 400;
    }
    .name-input:focus {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 6px;
    }

    .save-names-bar {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-top: 14px;
    }

    .save-names-btn {
      background: linear-gradient(135deg, #18a75b 0%, #0d6e3a 100%);
      border: 2px solid #54e899;
      color: #ffffff;
      padding: 9px 20px;
      border-radius: 12px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      transition: all 0.2s ease;
      white-space: nowrap;
    }
    .save-names-btn:hover {
      background: linear-gradient(135deg, #1fce71 0%, #118c4b 100%);
      box-shadow: 0 0 14px rgba(34, 197, 94, 0.5);
    }

    .names-status-msg {
      font-size: 14px;
      font-weight: 600;
      color: #92ecba;
    }
    .names-status-msg.unsaved {
      color: #ffb866;
    }

    /* Question Editor Details */
    details.question-editor-details {
      background: rgba(8, 22, 60, 0.7);
      border: 2px solid rgba(64, 232, 255, 0.35);
      border-radius: 16px;
      padding: 14px 18px;
      margin-top: 18px;
      margin-bottom: 24px;
      transition: border-color 0.2s ease;
    }
    details.question-editor-details[open] {
      border-color: var(--cyan-bright);
      background: rgba(10, 28, 76, 0.85);
    }
    summary.question-editor-summary {
      font-size: 17px;
      font-weight: 700;
      color: var(--gold-primary);
      cursor: pointer;
      user-select: none;
      outline: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    summary.question-editor-summary:hover {
      color: #ffffff;
      text-shadow: 0 0 10px var(--gold-primary);
    }

    .editor-body {
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .bulk-editor-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    @media (max-width: 600px) {
      .bulk-editor-grid {
        grid-template-columns: 1fr;
      }
    }

    .editor-label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: var(--cyan-bright);
      margin-bottom: 6px;
    }

    .bulk-textarea {
      width: 100%;
      height: 120px;
      background: #040d24;
      border: 1.5px solid rgba(64, 232, 255, 0.4);
      border-radius: 10px;
      padding: 10px;
      color: #ffffff;
      font-family: inherit;
      font-size: 13px;
      resize: vertical;
      line-height: 1.5;
    }
    .bulk-textarea:focus {
      border-color: var(--gold-primary);
    }

    .bulk-btn-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .import-btn {
      background: linear-gradient(135deg, #0876ed 0%, #054894 100%);
      border: 2px solid var(--cyan-bright);
      color: #ffffff;
      padding: 9px 20px;
      border-radius: 10px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .import-btn:hover {
      box-shadow: 0 0 14px var(--cyan-glow);
    }

    .single-square-editor {
      background: rgba(4, 14, 38, 0.6);
      border: 1px solid rgba(64, 232, 255, 0.3);
      padding: 16px;
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .square-select-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .square-select {
      background: #061842;
      color: #ffffff;
      border: 1.5px solid var(--cyan-bright);
      padding: 6px 12px;
      border-radius: 8px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      outline: none;
    }

    .single-input-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    @media (max-width: 540px) {
      .single-input-row {
        grid-template-columns: 1fr;
      }
    }

    .single-text-input {
      width: 100%;
      background: #040d24;
      border: 1.5px solid rgba(64, 232, 255, 0.35);
      border-radius: 8px;
      padding: 8px 10px;
      color: #ffffff;
      font-family: inherit;
      font-size: 13px;
    }
    .single-text-input:focus {
      border-color: var(--gold-primary);
    }

    .single-btns-row {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .btn-small {
      padding: 7px 14px;
      border-radius: 8px;
      font-family: inherit;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }
    .btn-save-sq {
      background: #18a75b;
      color: #ffffff;
      border: 1.5px solid #48e28f;
    }
    .btn-save-sq:hover {
      box-shadow: 0 0 10px rgba(72, 226, 143, 0.6);
    }
    .btn-clear-sq {
      background: #a82435;
      color: #ffffff;
      border: 1.5px solid #ff7b8c;
    }
    .btn-clear-sq:hover {
      box-shadow: 0 0 10px rgba(255, 123, 140, 0.6);
    }

    .editor-status-text {
      font-size: 13px;
      font-weight: 600;
    }
    .editor-status-text.success { color: #54e899; }
    .editor-status-text.error { color: #ff7b8c; }

    /* Start Game Big Button */
    .start-game-btn {
      width: 100%;
      background: linear-gradient(135deg, #18a75b 0%, #117841 100%);
      border: 3px solid #54e899;
      color: #ffffff;
      font-family: inherit;
      font-size: clamp(19px, 3vw, 24px);
      font-weight: 800;
      padding: 16px;
      border-radius: 18px;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5), 0 0 24px rgba(34, 197, 94, 0.45);
      transition: all 0.25s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .start-game-btn:hover {
      background: linear-gradient(135deg, #1fce71 0%, #159b54 100%);
      box-shadow: 0 8px 26px rgba(0, 0, 0, 0.6), 0 0 35px rgba(34, 197, 94, 0.7);
      transform: translateY(-2px);
    }
    .start-game-btn:active {
      transform: translateY(1px);
    }

    /* GAME SCREEN */
    .game-layout {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    /* Navigation toolbar above board */
    .game-nav-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-bottom: 2px;
    }

    .nav-btn {
      background: linear-gradient(135deg, #10337c 0%, #091f52 100%);
      border: 2px solid var(--cyan-bright);
      color: #ffffff;
      padding: 9px 18px;
      border-radius: 14px;
      font-family: inherit;
      font-size: clamp(13px, 1.8vw, 15px);
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .nav-btn:hover {
      background: linear-gradient(135deg, #184ab6 0%, #0d2c77 100%);
      box-shadow: 0 0 14px var(--cyan-glow);
      transform: translateY(-1px);
    }

    /* Main two-column container */
    .game-main-container {
      display: grid;
      grid-template-columns: 1fr 310px;
      gap: clamp(16px, 2.5vw, 26px);
      align-items: start;
    }

    @media (max-width: 850px) {
      .game-main-container {
        grid-template-columns: 1fr;
      }
    }

    /* BOARD COLUMN */
    .board-column {
      display: flex;
      flex-direction: column;
      gap: 14px;
      width: 100%;
    }

    /* Board Frame */
    .board-frame {
      position: relative;
      width: 100%;
      /* 5 columns by 4 rows aspect ratio */
      aspect-ratio: 5 / 4;
      background: #03102c;
      border-radius: 22px;
      overflow: hidden;
      /* Layered frame styling with cyan rings and golden glow */
      padding: 0;
      border: 4px solid #40e8ff;
      outline: 5px solid #0876ed;
      box-shadow: 
        0 0 28px var(--gold-halo),
        0 0 45px rgba(8, 118, 237, 0.6),
        inset 0 0 20px rgba(64, 232, 255, 0.65),
        0 14px 35px rgba(0, 0, 0, 0.85);
      user-select: none;
    }

    /* Board Picture: exact alignment matching final edition */
    .board-bg-img {
      position: absolute;
      left: 49.5%;
      top: 52.8%;
      width: 120%;
      height: 123%;
      transform: translate(-50%, -50%);
      object-fit: fill;
      pointer-events: none;
      user-select: none;
      z-index: 1;
    }

    /* 5x4 Grid Overlay for Hit Areas & Tokens */
    .board-grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: repeat(4, 1fr);
      z-index: 2;
    }

    .square-hit-area {
      position: relative;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: auto;
    }

    /* Question mark buttons on squares */
    .q-btn {
      position: absolute;
      top: 11%;
      right: 7%;
      width: clamp(20px, 3.2vw, 32px);
      height: clamp(20px, 3.2vw, 32px);
      border-radius: 50%;
      border: 2px solid #ffffff;
      color: #ffffff;
      font-family: inherit;
      font-weight: 900;
      font-size: clamp(12px, 1.8vw, 17px);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
      transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
      z-index: 5;
      padding: 0;
      line-height: 1;
    }

    /* Square 10 question icon override: right 24% to not cover number 10 */
    .q-btn-sq-10 {
      right: 24% !important;
    }

    .q-btn:hover {
      transform: scale(1.18);
      box-shadow: 0 0 12px #ffffff, 0 4px 8px rgba(0, 0, 0, 0.6);
    }
    .q-btn:active {
      transform: scale(0.95);
    }

    /* Column-based colors for question buttons */
    .q-btn.col-0 { background: #18a75b; } /* Green */
    .q-btn.col-1 { background: #1878ee; } /* Blue */
    .q-btn.col-2 { background: #8a4de1; } /* Purple */
    .q-btn.col-3 { background: #ff5d66; } /* Coral */
    .q-btn.col-4 { background: #ef8b20; } /* Orange */

    /* When a question is saved for the square: bright green + soft green glow */
    .q-btn.has-question {
      background: #18a75b !important;
      box-shadow: 0 0 12px #22c55e, 0 2px 6px rgba(0, 0, 0, 0.5) !important;
    }

    /* Tokens Layer (Placed absolute on board wrapper) */
    .tokens-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
    }

    .player-token {
      position: absolute;
      width: clamp(24px, 4vw, 42px);
      height: clamp(24px, 4vw, 42px);
      border-radius: 50%;
      border: 2.5px solid #ffffff;
      color: #ffffff;
      font-weight: 900;
      font-size: clamp(12px, 2vw, 18px);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 
        0 5px 12px rgba(0, 0, 0, 0.65),
        inset 0 2px 4px rgba(255, 255, 255, 0.7),
        inset 0 -2px 4px rgba(0, 0, 0, 0.4);
      transform: translate(-50%, -50%);
      transition: left 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
      user-select: none;
      pointer-events: auto;
    }

    .player-token.hopping {
      animation: tokenHop 0.28s ease-in-out;
    }

    @keyframes tokenHop {
      0% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -85%) scale(1.22); filter: brightness(1.2); }
      100% { transform: translate(-50%, -50%) scale(1); }
    }

    /* STARTING DOCK */
    .starting-dock {
      width: 100%;
      min-height: 64px;
      background: linear-gradient(180deg, #091d4e 0%, #050f2c 100%);
      border: 2.5px solid rgba(64, 232, 255, 0.5);
      border-radius: 16px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      position: relative;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5), inset 0 0 12px rgba(8, 118, 237, 0.3);
    }

    .dock-label {
      font-size: clamp(11px, 1.5vw, 13px);
      font-weight: 800;
      color: var(--cyan-bright);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      background: rgba(0, 210, 255, 0.15);
      padding: 4px 10px;
      border-radius: 8px;
      margin-right: 14px;
      white-space: nowrap;
    }

    .dock-tokens-zone {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .dock-token-item {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.08);
      padding: 4px 10px 4px 6px;
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .dock-token-circle {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      color: #ffffff;
      font-weight: 800;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.4);
    }
    .dock-token-name {
      font-size: 12px;
      font-weight: 700;
      color: #e0ecff;
    }

    /* RIGHT CONTROL COLUMN */
    .control-column {
      display: flex;
      flex-direction: column;
      gap: 16px;
      position: sticky;
      top: 16px;
    }
    @media (max-width: 850px) {
      .control-column {
        position: static;
        width: 100%;
        max-width: 480px;
        margin: 0 auto;
      }
    }

    /* Cream Control Panel */
    .control-panel {
      background: linear-gradient(180deg, #fdfbf7 0%, #f6f1e5 100%);
      border: 3px solid #00d2ff;
      outline: 3px solid #0b4db7;
      border-radius: 20px;
      padding: 20px 16px;
      color: #0c1c45;
      box-shadow: 0 12px 36px rgba(4, 15, 45, 0.65), 0 0 18px rgba(0, 210, 255, 0.25);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 14px;
    }

    .turn-header-title {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #55678f;
      text-transform: uppercase;
    }

    .active-player-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 25px;
      font-size: 18px;
      font-weight: 800;
      color: #ffffff;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .turn-status-text {
      font-size: 14px;
      font-weight: 700;
      color: #102657;
      min-height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1.3;
      padding: 0 6px;
    }

    /* Dice and Avatar Stage */
    .dice-avatar-stage {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      width: 100%;
      margin: 4px 0 8px;
    }

    /* Avatar Side Box */
    .avatar-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
    }

    /* 3 Animated Question Marks ABOVE the Avatar */
    .avatar-question-marks {
      display: flex;
      gap: 6px;
      margin-bottom: 4px;
      height: 20px;
      align-items: center;
    }

    .avatar-qmark {
      font-size: 16px;
      font-weight: 900;
      color: var(--gold-deep);
      text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
      display: inline-block;
      animation: questionBounce 1.4s infinite ease-in-out;
    }
    .avatar-qmark:nth-child(2) {
      animation-delay: 0.25s;
      color: #1878ee;
    }
    .avatar-qmark:nth-child(3) {
      animation-delay: 0.5s;
      color: #18a75b;
    }

    @keyframes questionBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-7px); }
    }

    .avatar-img-box {
      width: 90px;
      height: 90px;
      border-radius: 16px;
      overflow: hidden;
      border: 3px solid #0876ed;
      box-shadow: 0 4px 12px rgba(8, 118, 237, 0.35);
      background: #091c4d;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* EXACT 3D CSS DICE */
    .dice-button {
      width: 96px;
      height: 96px;
      background: transparent;
      border: none;
      perspective: 450px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      outline: none;
      user-select: none;
      position: relative;
    }

    .dice-cube {
      width: 76px;
      height: 76px;
      position: relative;
      transform-style: preserve-3d;
      transform: rotateX(-12deg) rotateY(16deg);
      transition: transform 1s cubic-bezier(0.2, 0.8, 0.3, 1);
    }

    .dice-cube.rolling {
      /* Animation handled via JS transform to guarantee continuous angle progression */
    }

    .dice-face {
      position: absolute;
      width: 76px;
      height: 76px;
      border-radius: 15px;
      border: 2.5px solid var(--gold-primary);
      background: linear-gradient(135deg, #32dfff 0%, #087cf4 35%, #0a439f 70%, #061c52 100%);
      box-shadow: inset 0 0 10px rgba(50, 223, 255, 0.4), 0 0 12px rgba(8, 124, 244, 0.5);
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: repeat(3, 1fr);
      padding: 9px;
      box-sizing: border-box;
      backface-visibility: hidden;
    }

    /* Dice Face Transforms (76px cube -> 38px translateZ) */
    .face-1 { transform: rotateY(0deg) translateZ(38px); }
    .face-6 { transform: rotateY(180deg) translateZ(38px); }
    .face-2 { transform: rotateY(90deg) translateZ(38px); }
    .face-5 { transform: rotateY(-90deg) translateZ(38px); }
    .face-3 { transform: rotateX(90deg) translateZ(38px); }
    .face-4 { transform: rotateX(-90deg) translateZ(38px); }

    /* Glowing Recessed Golden Pips */
    .pip {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: radial-gradient(circle at 35% 35%, #fff7b2 20%, #ffd700 65%, #b8860b 100%);
      box-shadow: 0 0 6px #ffe066, inset 0 1px 2px rgba(0, 0, 0, 0.6);
      align-self: center;
      justify-self: center;
    }

    /* Pip arrangements in 3x3 grid */
    .pos-tl { grid-area: 1 / 1; }
    .pos-tc { grid-area: 1 / 2; }
    .pos-tr { grid-area: 1 / 3; }
    .pos-ml { grid-area: 2 / 1; }
    .pos-mc { grid-area: 2 / 2; }
    .pos-mr { grid-area: 2 / 3; }
    .pos-bl { grid-area: 3 / 1; }
    .pos-bc { grid-area: 3 / 2; }
    .pos-br { grid-area: 3 / 3; }

    /* Move Button (shown after human roll) */
    .move-action-btn {
      width: 100%;
      background: linear-gradient(135deg, #18a75b 0%, #0d6e3a 100%);
      border: 2px solid #54e899;
      color: #ffffff;
      padding: 11px 16px;
      border-radius: 14px;
      font-family: inherit;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(24, 167, 91, 0.45);
      animation: pulseMoveBtn 1.6s infinite ease-in-out;
      display: none;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .move-action-btn:hover {
      background: linear-gradient(135deg, #1fce71 0%, #118c4b 100%);
      box-shadow: 0 0 18px rgba(34, 197, 94, 0.7);
    }
    @keyframes pulseMoveBtn {
      0%, 100% { transform: scale(1); box-shadow: 0 4px 14px rgba(24, 167, 91, 0.45); }
      50% { transform: scale(1.03); box-shadow: 0 0 20px rgba(34, 197, 94, 0.7); }
    }

    /* Player list in control panel */
    .players-list-panel {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 4px;
    }

    .player-list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-radius: 12px;
      background: #ffffff;
      border: 1.5px solid #d4deee;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }
    .player-list-item.active-player {
      border: 2.5px solid;
      box-shadow: 0 0 12px rgba(8, 118, 237, 0.4);
      background: #f1f7ff;
      transform: scale(1.02);
    }

    .pli-left {
      display: flex;
      align-items: center;
      gap: 8px;
      overflow: hidden;
    }

    .pli-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1.5px solid #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      flex-shrink: 0;
    }

    .pli-name {
      font-size: 14px;
      font-weight: 700;
      color: #0b1a42;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: left;
    }

    .pli-trophy {
      font-size: 13px;
      font-weight: 800;
      color: #b8860b;
      white-space: nowrap;
    }

    /* FOOTER SIGNATURE: Under the right control box, outside the box */
    .game-footer-signature {
      text-align: center;
      margin-top: 8px;
      padding: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
    }

    .signature-name {
      font-size: 16px;
      font-weight: 800;
      color: var(--gold-primary);
      text-shadow: 0 0 10px rgba(255, 216, 91, 0.5);
      letter-spacing: 0.5px;
    }

    .signature-title {
      font-size: 13px;
      font-weight: 600;
      color: #e5ddca;
      letter-spacing: 0.2px;
    }

    /* MODAL: Question Dialog */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(4, 12, 34, 0.82);
      backdrop-filter: blur(6px);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal-backdrop.open {
      display: flex;
    }

    .modal-card {
      background: linear-gradient(180deg, #0d2258 0%, #061234 100%);
      border: 3px solid var(--cyan-bright);
      box-shadow: 0 0 35px rgba(0, 210, 255, 0.4), 0 16px 40px rgba(0, 0, 0, 0.8);
      border-radius: 22px;
      width: 100%;
      max-width: 520px;
      padding: 24px;
      color: #ffffff;
      animation: modalPop 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }
    @keyframes modalPop {
      0% { transform: scale(0.9) translateY(16px); opacity: 0; }
      100% { transform: scale(1) translateY(0); opacity: 1; }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1.5px solid rgba(64, 232, 255, 0.3);
      padding-bottom: 12px;
      margin-bottom: 16px;
    }

    .modal-title {
      font-size: 20px;
      font-weight: 800;
      color: var(--gold-primary);
    }

    .modal-close-icon-btn {
      background: transparent;
      border: none;
      color: #a0b6e4;
      font-size: 22px;
      font-weight: 700;
      cursor: pointer;
      line-height: 1;
      padding: 4px;
    }
    .modal-close-icon-btn:hover {
      color: #ffffff;
    }

    .modal-question-box {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(64, 232, 255, 0.25);
      border-radius: 12px;
      padding: 14px;
      font-size: 17px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 16px;
      line-height: 1.45;
    }

    .modal-input-label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: var(--cyan-bright);
      margin-bottom: 6px;
    }

    .modal-answer-input {
      width: 100%;
      background: #040e28;
      border: 2px solid rgba(64, 232, 255, 0.4);
      border-radius: 12px;
      padding: 12px 14px;
      color: #ffffff;
      font-family: inherit;
      font-size: 16px;
      font-weight: 600;
      outline: none;
      margin-bottom: 14px;
    }
    .modal-answer-input:focus {
      border-color: var(--gold-primary);
      box-shadow: 0 0 10px rgba(255, 216, 91, 0.4);
    }

    .modal-feedback {
      min-height: 24px;
      font-size: 14px;
      font-weight: 700;
      margin-bottom: 14px;
    }
    .modal-feedback.success { color: #54e899; }
    .modal-feedback.error { color: #ff7b8c; }
    .modal-feedback.info { color: var(--gold-primary); }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .btn-modal-close {
      background: #142a5c;
      border: 1.5px solid rgba(64, 232, 255, 0.3);
      color: #d0e0ff;
      padding: 10px 18px;
      border-radius: 10px;
      font-family: inherit;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-modal-close:hover {
      background: #1e3c80;
    }

    .btn-modal-check {
      background: linear-gradient(135deg, #18a75b 0%, #10723e 100%);
      border: 2px solid #54e899;
      color: #ffffff;
      padding: 10px 22px;
      border-radius: 10px;
      font-family: inherit;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(24, 167, 91, 0.4);
    }
    .btn-modal-check:hover {
      background: linear-gradient(135deg, #20cd71 0%, #148d4c 100%);
    }

    /* SNAKE CRYING OVERLAY */
    .snake-crying-overlay {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.5);
      font-size: clamp(80px, 15vw, 150px);
      z-index: 120;
      pointer-events: none;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }
    .snake-crying-overlay.show {
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 1;
    }

    /* TOAST ALERT */
    .game-toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: rgba(6, 18, 48, 0.95);
      border: 2px solid var(--cyan-bright);
      color: #ffffff;
      padding: 12px 24px;
      border-radius: 14px;
      font-weight: 700;
      font-size: 15px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(0, 210, 255, 0.4);
      z-index: 150;
      opacity: 0;
      transition: all 0.3s cubic-bezier(0.2, 0.8, 0.3, 1);
      pointer-events: none;
      text-align: center;
      max-width: 90vw;
    }
    .game-toast.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    /* VICTORY OVERLAY */
    .victory-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(5, 18, 55, 0.94);
      backdrop-filter: blur(10px);
      z-index: 200;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
    }
    .victory-overlay.open {
      display: flex;
    }

    .victory-trophy-large {
      font-size: clamp(80px, 14vw, 130px);
      filter: drop-shadow(0 0 25px rgba(255, 216, 91, 0.8));
      animation: trophyFloat 2s infinite ease-in-out;
    }
    @keyframes trophyFloat {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-12px) scale(1.05); }
    }

    .victory-title {
      font-size: clamp(36px, 7vw, 64px);
      font-weight: 900;
      color: var(--gold-primary);
      text-shadow: 0 0 30px var(--gold-halo), 0 4px 12px rgba(0, 0, 0, 0.8);
      margin: 8px 0;
      letter-spacing: 1.5px;
    }

    .victory-winner-name {
      font-size: clamp(22px, 4.5vw, 36px);
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 8px;
    }

    .victory-reason {
      font-size: clamp(16px, 3vw, 22px);
      color: #a0d4ff;
      margin-bottom: 28px;
    }

    .play-again-btn {
      background: linear-gradient(135deg, #ffd85b 0%, #d4a017 100%);
      border: 3px solid #ffffff;
      color: #050d24;
      font-family: inherit;
      font-size: clamp(18px, 3vw, 22px);
      font-weight: 900;
      padding: 14px 38px;
      border-radius: 18px;
      cursor: pointer;
      box-shadow: 0 6px 25px rgba(255, 216, 91, 0.5), 0 4px 12px rgba(0, 0, 0, 0.5);
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .play-again-btn:hover {
      transform: scale(1.06);
      box-shadow: 0 0 35px rgba(255, 216, 91, 0.8);
    }

    /* Confetti pieces */
    .confetti-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      pointer-events: none;
    }

    .confetti-piece {
      position: absolute;
      width: 10px;
      height: 18px;
      opacity: 0.85;
      animation: confettiFall linear infinite;
    }
    @keyframes confettiFall {
      0% {
        transform: translateY(-20px) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(105vh) rotate(720deg);
        opacity: 0;
      }
    }

    /* Responsive adjustments */
    @media (max-width: 480px) {
      .app-wrapper {
        padding: 8px 10px 24px;
      }
      .board-frame {
        border-radius: 16px;
      }
      .control-panel {
        padding: 14px 12px;
      }
      .dice-avatar-stage {
        gap: 10px;
      }
      .avatar-img-box {
        width: 72px;
        height: 72px;
      }
    }

    /* Accessibility prefers-reduced-motion */
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
      .dice-cube {
        transition: none !important;
      }
    }
  </style>
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to game content</a>

  <!-- ARIA Live Regions for Status & Alerts -->
  <div id="live-polite-region" class="sr-only" aria-live="polite" style="position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0);"></div>
  <div id="live-assertive-region" class="sr-only" aria-live="assertive" style="position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0,0,0,0);"></div>

  <div class="app-wrapper">
    <!-- Header -->
    <header class="game-header">
      <div class="header-title-container">
        <img 
          src="${titleImgBase64}" 
          onerror="this.src='${rawTitleUrl}'"
          alt="SNAKES AND LADDER" 
          class="header-title-img"
          width="720"
          height="120"
        >
      </div>
      <button id="sound-toggle-btn" class="header-sound-btn" aria-label="Toggle sound effects" aria-pressed="true">
        🔊 Sound on
      </button>
    </header>

    <main id="main-content" style="width: 100%;">
      <!-- 1. SETTINGS SCREEN -->
      <section id="settings-screen" class="screen-section active" aria-labelledby="settings-heading">
        <div class="settings-container">
          <h1 id="settings-heading" class="settings-heading">Set up your game</h1>
          <p class="settings-subtitle">Choose how to play, save the player names, and add your learning questions.</p>

          <!-- Play Modes -->
          <div class="settings-group">
            <span class="group-label">Choose Play Mode</span>
            <div class="mode-cards-grid" role="radiogroup" aria-label="Play Mode">
              <button 
                type="button" 
                id="mode-card-cpu" 
                class="mode-card" 
                role="radio" 
                aria-checked="true" 
                aria-pressed="true"
              >
                <div class="mode-card-title">🤖 Versus computer</div>
                <div class="mode-card-desc">One human player competing against an automated CPU opponent.</div>
              </button>

              <button 
                type="button" 
                id="mode-card-local" 
                class="mode-card" 
                role="radio" 
                aria-checked="false" 
                aria-pressed="false"
              >
                <div class="mode-card-title">👥 Various players</div>
                <div class="mode-card-desc">2 to 5 local players taking turns on this same screen or device.</div>
              </button>
            </div>

            <!-- Player Count Buttons (Visible in Local Mode) -->
            <div id="local-count-group" style="display: none; margin-top: 14px;">
              <span class="group-label" style="font-size: 13px;">Number of Local Players</span>
              <div class="player-count-row" role="group" aria-label="Number of players">
                <button type="button" class="count-btn" data-count="2" aria-pressed="true">2 Players</button>
                <button type="button" class="count-btn" data-count="3" aria-pressed="false">3 Players</button>
                <button type="button" class="count-btn" data-count="4" aria-pressed="false">4 Players</button>
                <button type="button" class="count-btn" data-count="5" aria-pressed="false">5 Players</button>
              </div>
            </div>
          </div>

          <!-- Player Names -->
          <div class="settings-group">
            <span class="group-label">Player Names (Optional)</span>
            <div id="player-names-container" class="player-names-inputs">
              <!-- Dynamically populated rows -->
            </div>

            <div class="save-names-bar">
              <button type="button" id="save-names-btn" class="save-names-btn">Save player names</button>
              <span id="save-names-status" class="names-status-msg" aria-live="polite"></span>
            </div>
          </div>

          <!-- Question Editor -->
          <details class="question-editor-details">
            <summary class="question-editor-summary">
              <span>Add or edit my questions</span>
            </summary>
            
            <div class="editor-body">
              <!-- Bulk textareas -->
              <div>
                <span class="group-label" style="font-size: 13px;">Bulk Import (1 to 20 lines)</span>
                <div class="bulk-editor-grid">
                  <div>
                    <label for="bulk-questions" class="editor-label">Questions, one per line</label>
                    <textarea id="bulk-questions" class="bulk-textarea" placeholder="What is 5 + 5?&#10;What is the capital of France?&#10;Which planet is closest to the Sun?"></textarea>
                  </div>
                  <div>
                    <label for="bulk-answers" class="editor-label">Answers, one per line</label>
                    <textarea id="bulk-answers" class="bulk-textarea" placeholder="10&#10;Paris&#10;Mercury"></textarea>
                  </div>
                </div>
                <div class="bulk-btn-row" style="margin-top: 10px;">
                  <button type="button" id="bulk-import-btn" class="import-btn">Import Questions</button>
                  <span id="bulk-status" class="editor-status-text" aria-live="polite"></span>
                </div>
              </div>

              <!-- Single Square Editor -->
              <div class="single-square-editor">
                <span class="group-label" style="font-size: 13px;">Single Square Question Editor</span>
                <div class="square-select-row">
                  <label for="square-selector" class="editor-label" style="margin-bottom:0;">Select Square:</label>
                  <select id="square-selector" class="square-select">
                    <!-- 1 to 20 -->
                  </select>
                </div>

                <div class="single-input-row">
                  <div>
                    <label for="single-q-input" class="editor-label">Question:</label>
                    <input type="text" id="single-q-input" class="single-text-input" placeholder="Type question for this square...">
                  </div>
                  <div>
                    <label for="single-a-input" class="editor-label">Exact Answer:</label>
                    <input type="text" id="single-a-input" class="single-text-input" placeholder="Type answer for this square...">
                  </div>
                </div>

                <div class="single-btns-row">
                  <button type="button" id="single-save-btn" class="btn-small btn-save-sq">Save this square</button>
                  <button type="button" id="single-clear-btn" class="btn-small btn-clear-sq">Clear this square</button>
                  <span id="single-status" class="editor-status-text" aria-live="polite"></span>
                </div>
              </div>
            </div>
          </details>

          <!-- Start Button -->
          <button type="button" id="start-game-btn" class="start-game-btn">
            Start the game ▶
          </button>
        </div>
      </section>

      <!-- 2. GAME SCREEN -->
      <section id="game-screen" class="screen-section" aria-label="Game board and controls">
        <div class="game-layout">
          <!-- Top bar with Back to settings & Restart -->
          <div class="game-nav-bar">
            <button type="button" id="back-to-settings-btn" class="nav-btn">
              ← Back to settings
            </button>
            <button type="button" id="restart-game-btn" class="nav-btn">
              ↻ Restart game
            </button>
          </div>

          <!-- Main 2-column container -->
          <div class="game-main-container">
            <!-- Left: Board and Starting Dock -->
            <div class="board-column">
              <div id="board-frame" class="board-frame" role="region" aria-label="Snakes and Ladder Game Board">
                <!-- Mandatory Background Image with exact positioning -->
                <img 
                  id="board-img"
                  src="${boardImgBase64}" 
                  onerror="this.src='${rawBoardUrl}'"
                  alt="Game Board Artwork" 
                  class="board-bg-img"
                  width="1000"
                  height="800"
                >

                <!-- 5x4 Grid Overlay for Hit Areas and Question Buttons -->
                <div id="board-grid" class="board-grid-overlay">
                  <!-- Generated by JS with 20 serpentine squares -->
                </div>

                <!-- Tokens Layer inside Board Frame -->
                <div id="tokens-layer" class="tokens-container">
                  <!-- Animated tokens positioned dynamically -->
                </div>
              </div>

              <!-- Starting Dock -->
              <div id="starting-dock" class="starting-dock" role="region" aria-label="Starting dock for position zero">
                <span class="dock-label">Starting Dock</span>
                <div id="dock-tokens-zone" class="dock-tokens-zone">
                  <!-- Tokens at position 0 appear here -->
                </div>
              </div>
            </div>

            <!-- Right: Cream Control Column -->
            <aside class="control-column" aria-label="Player turn and game controls">
              <div class="control-panel">
                <div class="turn-header-title">CURRENT TURN</div>
                <div id="active-player-badge" class="active-player-badge" style="background: var(--color-p1);">
                  Player 1
                </div>

                <div id="turn-status-text" class="turn-status-text">
                  Click the dice to roll.
                </div>

                <!-- Dice & Avatar Stage -->
                <div class="dice-avatar-stage">
                  <!-- Side Avatar with 3 animated bouncing question marks above -->
                  <div class="avatar-wrapper">
                    <div class="avatar-question-marks" aria-hidden="true">
                      <span class="avatar-qmark">?</span>
                      <span class="avatar-qmark">?</span>
                      <span class="avatar-qmark">?</span>
                    </div>
                    <div class="avatar-img-box">
                      <img 
                        src="${avatarImgBase64}" 
                        onerror="this.src='${rawAvatarUrl}'"
                        alt="Game Mascot Snake Avatar" 
                        class="avatar-img"
                        width="90"
                        height="90"
                      >
                    </div>
                  </div>

                  <!-- Stationary 96x96px Button with 3D CSS Cube inside -->
                  <button 
                    type="button" 
                    id="dice-btn" 
                    class="dice-button" 
                    aria-label="Roll the dice" 
                    title="Click to roll dice"
                  >
                    <div id="dice-cube" class="dice-cube">
                      <!-- Face 1 -->
                      <div class="dice-face face-1">
                        <div class="pip pos-mc"></div>
                      </div>
                      <!-- Face 2 -->
                      <div class="dice-face face-2">
                        <div class="pip pos-tl"></div>
                        <div class="pip pos-br"></div>
                      </div>
                      <!-- Face 3 -->
                      <div class="dice-face face-3">
                        <div class="pip pos-tl"></div>
                        <div class="pip pos-mc"></div>
                        <div class="pip pos-br"></div>
                      </div>
                      <!-- Face 4 -->
                      <div class="dice-face face-4">
                        <div class="pip pos-tl"></div>
                        <div class="pip pos-tr"></div>
                        <div class="pip pos-bl"></div>
                        <div class="pip pos-br"></div>
                      </div>
                      <!-- Face 5 -->
                      <div class="dice-face face-5">
                        <div class="pip pos-tl"></div>
                        <div class="pip pos-tr"></div>
                        <div class="pip pos-mc"></div>
                        <div class="pip pos-bl"></div>
                        <div class="pip pos-br"></div>
                      </div>
                      <!-- Face 6 -->
                      <div class="dice-face face-6">
                        <div class="pip pos-tl"></div>
                        <div class="pip pos-ml"></div>
                        <div class="pip pos-bl"></div>
                        <div class="pip pos-tr"></div>
                        <div class="pip pos-mr"></div>
                        <div class="pip pos-br"></div>
                      </div>
                    </div>
                  </button>
                </div>

                <!-- Glowing Move Button for Human Turn -->
                <button type="button" id="move-action-btn" class="move-action-btn">
                  Move 1 space
                </button>

                <!-- Player list with trophies -->
                <div id="players-list-panel" class="players-list-panel" role="list" aria-label="Players and trophies">
                  <!-- Populated dynamically -->
                </div>
              </div>

              <!-- EXACT FOOTER SIGNATURE OUTSIDE AND UNDER THE CONTROL BOX -->
              <footer class="game-footer-signature">
                <div class="signature-name">Dr.Abir Wafa</div>
                <div class="signature-title">Head of EdTech at Edulixa</div>
              </footer>
            </aside>
          </div>
        </div>
      </section>
    </main>
  </div>

  <!-- Modal Dialog for Question -->
  <div id="question-modal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-sq-title">
    <div class="modal-card">
      <div class="modal-header">
        <h2 id="modal-sq-title" class="modal-title">Square 1 question</h2>
        <button type="button" id="modal-close-x" class="modal-close-icon-btn" aria-label="Close question modal">&times;</button>
      </div>
      <div id="modal-question-text" class="modal-question-box">
        <!-- Question prompt text -->
      </div>
      <label for="modal-answer-input" class="modal-input-label">Your answer:</label>
      <input type="text" id="modal-answer-input" class="modal-answer-input" placeholder="Type your answer here..." autocomplete="off">
      <div id="modal-feedback" class="modal-feedback" aria-live="polite"></div>
      <div class="modal-actions">
        <button type="button" id="modal-close-btn" class="btn-modal-close">Close</button>
        <button type="button" id="modal-check-btn" class="btn-modal-check">Check my answer</button>
      </div>
    </div>
  </div>

  <!-- Snake Crying Emoji Overlay -->
  <div id="snake-crying-overlay" class="snake-crying-overlay" aria-hidden="true">
    😭
  </div>

  <!-- Accessible Toast Alert -->
  <div id="game-toast" class="game-toast" role="status" aria-live="polite"></div>

  <!-- Fullscreen Victory Overlay -->
  <div id="victory-overlay" class="victory-overlay" role="dialog" aria-modal="true" aria-labelledby="victory-heading">
    <div class="confetti-container" id="confetti-container" aria-hidden="true"></div>
    <div class="victory-trophy-large" aria-hidden="true">🏆</div>
    <h2 id="victory-heading" class="victory-title">Victory!</h2>
    <div id="victory-winner-name" class="victory-winner-name">Player 1</div>
    <div id="victory-reason" class="victory-reason">Reached square 20!</div>
    <button type="button" id="play-again-btn" class="play-again-btn">
      Play again
    </button>
  </div>

  <!-- COMPLETE GAME JAVASCRIPT -->
  <script>
    /* GAME LOGIC, WEB AUDIO, AND STATE MANAGEMENT */
    (function() {
      'use strict';

      // 1. Color Palette & Constants
      const PLAYER_COLORS = ['#ff5d66', '#1878ee', '#18a75b', '#8a4de1', '#ef8b20'];
      const DEFAULT_NAMES = ['P1', 'P2', 'P3', 'P4', 'P5'];
      
      // Ladders: 2->9, 7->14, 12->19
      const LADDERS = { 2: 9, 7: 14, 12: 19 };
      // Snakes: 11->10, 13->8, 15->6
      const SNAKES = { 11: 10, 13: 8, 15: 6 };

      // Exact Serpentine Grid:
      // Row 0: 20, 19, 18, 17, 16
      // Row 1: 11, 12, 13, 14, 15
      // Row 2: 10, 9, 8, 7, 6
      // Row 3: 1, 2, 3, 4, 5
      const GRID_SQUARES = [
        [20, 19, 18, 17, 16],
        [11, 12, 13, 14, 15],
        [10, 9, 8, 7, 6],
        [1, 2, 3, 4, 5]
      ];

      // Cube Resting Orientations for values 1-6 (incorporating base tilt -12deg X, 16deg Y)
      const DICE_TILT_ROTATIONS = {
        1: { x: -12, y: 16 },
        2: { x: -12, y: -74 },
        3: { x: -102, y: 16 },
        4: { x: 78, y: 16 },
        5: { x: -12, y: 106 },
        6: { x: -12, y: 196 }
      };

      // 2. Structured State
      const state = {
        mode: 'cpu', // 'cpu' or 'local'
        playerCount: 2,
        savedNames: ['', '', '', '', ''],
        players: [],
        activeIdx: 0,
        rolledValue: 0,
        diceTotalRotX: -12,
        diceTotalRotY: 16,
        isBusy: false,
        soundEnabled: true,
        questions: Array.from({ length: 20 }, () => ({ q: '', a: '' })),
        openSquareNum: null,
        gameOver: false,
        cpuTimeoutId: null
      };

      // 3. Audio Engine with Web Audio API
      let audioCtx = null;

      function getAudioContext() {
        if (!audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            audioCtx = new AudioContextClass();
          }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        return audioCtx;
      }

      function playTone(freq, duration, type = 'sine', gainVal = 0.2, detune = 0) {
        if (!state.soundEnabled) return;
        const ctx = getAudioContext();
        if (!ctx) return;
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          if (detune) osc.detune.setValueAtTime(detune, ctx.currentTime);

          gain.gain.setValueAtTime(gainVal, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + duration);
        } catch (e) {
          console.error(e);
        }
      }

      const Sounds = {
        roll() {
          if (!state.soundEnabled) return;
          const ctx = getAudioContext();
          if (!ctx) return;
          // Rapid dice rattle clicks
          for (let i = 0; i < 6; i++) {
            setTimeout(() => {
              playTone(280 + Math.random() * 160, 0.04, 'triangle', 0.15);
            }, i * 90);
          }
        },
        step(sq) {
          // Pitch rises gently with square number
          const freq = 340 + (sq || 1) * 20;
          playTone(freq, 0.12, 'sine', 0.25);
        },
        blocked() {
          // Low wood thud
          playTone(130, 0.25, 'triangle', 0.3);
        },
        ladder() {
          // Cheerful ascending arpeggio
          const notes = [261.6, 329.6, 392.0, 523.3, 659.3];
          notes.forEach((freq, idx) => {
            setTimeout(() => playTone(freq, 0.2, 'sine', 0.22), idx * 80);
          });
        },
        snake() {
          if (!state.soundEnabled) return;
          const ctx = getAudioContext();
          if (!ctx) return;
          try {
            // Descending slide
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(450, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.6);

            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.6);
          } catch(e) {}
        },
        wrong() {
          // Dissonant buzzer
          playTone(135, 0.35, 'sawtooth', 0.2);
          playTone(142, 0.35, 'sawtooth', 0.2);
        },
        correct() {
          // Bright chime chord
          const notes = [440, 554.4, 659.3, 880];
          notes.forEach((freq, idx) => {
            setTimeout(() => playTone(freq, 0.25, 'sine', 0.2), idx * 60);
          });
        },
        trophy() {
          // Shimmering arpeggio
          const notes = [587.3, 739.99, 880, 1174.66];
          notes.forEach((freq, idx) => {
            setTimeout(() => playTone(freq, 0.3, 'sine', 0.25), idx * 75);
          });
        },
        victory() {
          // Celebratory fanfare
          const notes = [392, 523.3, 659.3, 784, 1046.5];
          notes.forEach((freq, idx) => {
            setTimeout(() => playTone(freq, 0.45, 'triangle', 0.3), idx * 140);
          });
        },
        save() {
          playTone(587.3, 0.1, 'sine', 0.2);
          setTimeout(() => playTone(880, 0.15, 'sine', 0.2), 90);
        }
      };

      // 4. Persistence Helpers
      function loadStorage() {
        try {
          const namesRaw = localStorage.getItem('snakeTrailNames');
          if (namesRaw) {
            const parsed = JSON.parse(namesRaw);
            if (Array.isArray(parsed)) {
              state.savedNames = parsed.slice(0, 5).map(n => String(n || '').slice(0, 22));
              while (state.savedNames.length < 5) state.savedNames.push('');
            }
          }
        } catch (e) {
          console.warn('Storage read error for names:', e);
        }

        try {
          const qsRaw = localStorage.getItem('snakeTrailQuestions');
          if (qsRaw) {
            const parsed = JSON.parse(qsRaw);
            if (Array.isArray(parsed)) {
              for (let i = 0; i < 20; i++) {
                if (parsed[i]) {
                  state.questions[i] = {
                    q: String(parsed[i].q || ''),
                    a: String(parsed[i].a || '')
                  };
                }
              }
            }
          }
        } catch (e) {
          console.warn('Storage read error for questions:', e);
        }
      }

      function saveNamesToStorage() {
        try {
          localStorage.setItem('snakeTrailNames', JSON.stringify(state.savedNames));
        } catch (e) {
          console.error(e);
        }
      }

      function saveQuestionsToStorage() {
        try {
          localStorage.setItem('snakeTrailQuestions', JSON.stringify(state.questions));
        } catch (e) {
          console.error(e);
        }
      }

      // 5. DOM References
      const soundToggleBtn = document.getElementById('sound-toggle-btn');
      const settingsScreen = document.getElementById('settings-screen');
      const gameScreen = document.getElementById('game-screen');
      const modeCardCpu = document.getElementById('mode-card-cpu');
      const modeCardLocal = document.getElementById('mode-card-local');
      const localCountGroup = document.getElementById('local-count-group');
      const countBtns = document.querySelectorAll('.count-btn');
      const playerNamesContainer = document.getElementById('player-names-container');
      const saveNamesBtn = document.getElementById('save-names-btn');
      const saveNamesStatus = document.getElementById('save-names-status');
      const startGameBtn = document.getElementById('start-game-btn');
      const backToSettingsBtn = document.getElementById('back-to-settings-btn');
      const restartGameBtn = document.getElementById('restart-game-btn');
      
      const bulkQuestionsInput = document.getElementById('bulk-questions');
      const bulkAnswersInput = document.getElementById('bulk-answers');
      const bulkImportBtn = document.getElementById('bulk-import-btn');
      const bulkStatus = document.getElementById('bulk-status');

      const squareSelector = document.getElementById('square-selector');
      const singleQInput = document.getElementById('single-q-input');
      const singleAInput = document.getElementById('single-a-input');
      const singleSaveBtn = document.getElementById('single-save-btn');
      const singleClearBtn = document.getElementById('single-clear-btn');
      const singleStatus = document.getElementById('single-status');

      const boardFrame = document.getElementById('board-frame');
      const boardGrid = document.getElementById('board-grid');
      const tokensLayer = document.getElementById('tokens-layer');
      const dockTokensZone = document.getElementById('dock-tokens-zone');
      
      const activePlayerBadge = document.getElementById('active-player-badge');
      const turnStatusText = document.getElementById('turn-status-text');
      const diceBtn = document.getElementById('dice-btn');
      const diceCube = document.getElementById('dice-cube');
      const moveActionBtn = document.getElementById('move-action-btn');
      const playersListPanel = document.getElementById('players-list-panel');

      const questionModal = document.getElementById('question-modal');
      const modalSqTitle = document.getElementById('modal-sq-title');
      const modalQuestionText = document.getElementById('modal-question-text');
      const modalAnswerInput = document.getElementById('modal-answer-input');
      const modalFeedback = document.getElementById('modal-feedback');
      const modalCloseX = document.getElementById('modal-close-x');
      const modalCloseBtn = document.getElementById('modal-close-btn');
      const modalCheckBtn = document.getElementById('modal-check-btn');

      const snakeCryingOverlay = document.getElementById('snake-crying-overlay');
      const gameToast = document.getElementById('game-toast');
      const victoryOverlay = document.getElementById('victory-overlay');
      const victoryWinnerName = document.getElementById('victory-winner-name');
      const victoryReason = document.getElementById('victory-reason');
      const playAgainBtn = document.getElementById('play-again-btn');
      const confettiContainer = document.getElementById('confetti-container');

      const livePoliteRegion = document.getElementById('live-polite-region');
      const liveAssertiveRegion = document.getElementById('live-assertive-region');

      function announce(msg, assertive = false) {
        if (assertive && liveAssertiveRegion) {
          liveAssertiveRegion.textContent = msg;
        } else if (livePoliteRegion) {
          livePoliteRegion.textContent = msg;
        }
      }

      function showToast(msg) {
        if (!gameToast) return;
        gameToast.textContent = msg;
        gameToast.classList.add('show');
        announce(msg);
        setTimeout(() => {
          gameToast.classList.remove('show');
        }, 3200);
      }

      // 6. UI Building: Grid & Inputs
      function buildBoardGrid() {
        boardGrid.innerHTML = '';
        // 4 rows x 5 columns
        for (let row = 0; row < 4; row++) {
          for (let col = 0; col < 5; col++) {
            const sqNum = GRID_SQUARES[row][col];
            const cell = document.createElement('div');
            cell.className = 'square-hit-area';
            cell.dataset.square = sqNum;
            cell.id = 'square-cell-' + sqNum;

            // Question button
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'q-btn col-' + col;
            if (sqNum === 10) {
              btn.classList.add('q-btn-sq-10');
            }
            btn.setAttribute('aria-label', 'Open question for square ' + sqNum);
            btn.textContent = '?';
            btn.dataset.square = sqNum;
            
            // Check if question exists
            if (state.questions[sqNum - 1] && state.questions[sqNum - 1].q.trim()) {
              btn.classList.add('has-question');
            }

            btn.addEventListener('click', (e) => {
              e.stopPropagation();
              handleQuestionIconClick(sqNum);
            });

            cell.appendChild(btn);
            boardGrid.appendChild(cell);
          }
        }
      }

      function updateQuestionButtonIcons() {
        for (let i = 1; i <= 20; i++) {
          const btn = document.querySelector('.q-btn[data-square="' + i + '"]');
          if (btn) {
            if (state.questions[i - 1] && state.questions[i - 1].q.trim()) {
              btn.classList.add('has-question');
            } else {
              btn.classList.remove('has-question');
            }
          }
        }
      }

      function populateSquareSelector() {
        squareSelector.innerHTML = '';
        for (let i = 1; i <= 20; i++) {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = 'Square ' + i;
          squareSelector.appendChild(opt);
        }
        loadSelectedSquareInEditor(1);
      }

      function loadSelectedSquareInEditor(sqNum) {
        const item = state.questions[sqNum - 1] || { q: '', a: '' };
        singleQInput.value = item.q;
        singleAInput.value = item.a;
        singleStatus.textContent = '';
      }

      function renderPlayerNameInputs() {
        playerNamesContainer.innerHTML = '';
        const count = state.mode === 'cpu' ? 2 : state.playerCount;

        for (let i = 0; i < count; i++) {
          const row = document.createElement('div');
          row.className = 'name-input-row';

          const dot = document.createElement('div');
          dot.className = 'player-dot';
          dot.style.background = PLAYER_COLORS[i];

          const input = document.createElement('input');
          input.type = 'text';
          input.className = 'name-input';
          input.maxLength = 22;
          input.dataset.index = i;

          if (state.mode === 'cpu' && i === 1) {
            input.value = 'CPU';
            input.disabled = true;
            input.style.opacity = '0.75';
            input.style.cursor = 'not-allowed';
            input.setAttribute('aria-label', 'Player 2: CPU opponent (locked)');
          } else {
            input.placeholder = 'Player ' + (i + 1) + ' (' + DEFAULT_NAMES[i] + ')';
            input.value = state.savedNames[i] || '';
            input.setAttribute('aria-label', 'Player ' + (i + 1) + ' custom name');
            input.addEventListener('input', (e) => {
              state.savedNames[i] = e.target.value;
              saveNamesStatus.textContent = 'Unsaved changes';
              saveNamesStatus.className = 'names-status-msg unsaved';
            });
          }

          row.appendChild(dot);
          row.appendChild(input);
          playerNamesContainer.appendChild(row);
        }
      }

      // 7. Settings Actions
      function setPlayMode(mode) {
        state.mode = mode;
        if (mode === 'cpu') {
          modeCardCpu.setAttribute('aria-pressed', 'true');
          modeCardCpu.setAttribute('aria-checked', 'true');
          modeCardLocal.setAttribute('aria-pressed', 'false');
          modeCardLocal.setAttribute('aria-checked', 'false');
          localCountGroup.style.display = 'none';
        } else {
          modeCardLocal.setAttribute('aria-pressed', 'true');
          modeCardLocal.setAttribute('aria-checked', 'true');
          modeCardCpu.setAttribute('aria-pressed', 'false');
          modeCardCpu.setAttribute('aria-checked', 'false');
          localCountGroup.style.display = 'block';
        }
        renderPlayerNameInputs();
      }

      function setLocalPlayerCount(count) {
        state.playerCount = count;
        countBtns.forEach(btn => {
          const isSelected = parseInt(btn.dataset.count, 10) === count;
          btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        });
        renderPlayerNameInputs();
      }

      // 8. Question Editor Logic
      bulkImportBtn.addEventListener('click', () => {
        const qLines = bulkQuestionsInput.value.split('\\n').map(l => l.trim()).filter(Boolean);
        const aLines = bulkAnswersInput.value.split('\\n').map(l => l.trim()).filter(Boolean);

        if (qLines.length === 0 || aLines.length === 0) {
          bulkStatus.textContent = 'Please enter at least 1 question and answer.';
          bulkStatus.className = 'editor-status-text error';
          return;
        }

        if (qLines.length !== aLines.length) {
          bulkStatus.textContent = 'Question count (' + qLines.length + ') must equal answer count (' + aLines.length + ').';
          bulkStatus.className = 'editor-status-text error';
          return;
        }

        if (qLines.length > 20) {
          bulkStatus.textContent = 'Maximum 20 questions accepted (provided ' + qLines.length + ').';
          bulkStatus.className = 'editor-status-text error';
          return;
        }

        for (let i = 0; i < qLines.length; i++) {
          state.questions[i] = { q: qLines[i], a: aLines[i] };
        }
        saveQuestionsToStorage();
        updateQuestionButtonIcons();
        loadSelectedSquareInEditor(parseInt(squareSelector.value, 10));

        bulkStatus.textContent = '✓ ' + qLines.length + ' questions imported successfully!';
        bulkStatus.className = 'editor-status-text success';
        Sounds.save();
      });

      squareSelector.addEventListener('change', (e) => {
        loadSelectedSquareInEditor(parseInt(e.target.value, 10));
      });

      singleSaveBtn.addEventListener('click', () => {
        const sqNum = parseInt(squareSelector.value, 10);
        const qText = singleQInput.value.trim();
        const aText = singleAInput.value.trim();

        state.questions[sqNum - 1] = { q: qText, a: aText };
        saveQuestionsToStorage();
        updateQuestionButtonIcons();

        singleStatus.textContent = '✓ Square ' + sqNum + ' saved.';
        singleStatus.className = 'editor-status-text success';
        Sounds.save();
      });

      singleClearBtn.addEventListener('click', () => {
        const sqNum = parseInt(squareSelector.value, 10);
        state.questions[sqNum - 1] = { q: '', a: '' };
        singleQInput.value = '';
        singleAInput.value = '';
        saveQuestionsToStorage();
        updateQuestionButtonIcons();

        singleStatus.textContent = 'Square ' + sqNum + ' cleared.';
        singleStatus.className = 'editor-status-text info';
        Sounds.save();
      });

      saveNamesBtn.addEventListener('click', () => {
        const inputs = playerNamesContainer.querySelectorAll('.name-input');
        inputs.forEach(input => {
          const idx = parseInt(input.dataset.index, 10);
          if (state.mode === 'cpu' && idx === 1) {
            state.savedNames[1] = 'CPU';
          } else {
            state.savedNames[idx] = input.value.trim().slice(0, 22);
          }
        });
        saveNamesToStorage();
        const filled = state.savedNames.filter(Boolean).length;
        saveNamesStatus.textContent = '✓ ' + filled + ' names saved';
        saveNamesStatus.className = 'names-status-msg';
        Sounds.save();
      });

      // 9. Game Initialization
      function initGame() {
        if (state.cpuTimeoutId) {
          clearTimeout(state.cpuTimeoutId);
          state.cpuTimeoutId = null;
        }

        state.isBusy = false;
        state.gameOver = false;
        state.activeIdx = 0;
        state.rolledValue = 0;
        state.players = [];

        const total = state.mode === 'cpu' ? 2 : state.playerCount;
        for (let i = 0; i < total; i++) {
          let name = (state.savedNames[i] || '').trim();
          if (!name) {
            name = DEFAULT_NAMES[i];
          }
          if (state.mode === 'cpu' && i === 1) {
            name = 'CPU';
          }

          state.players.push({
            id: i + 1,
            name: name,
            color: PLAYER_COLORS[i],
            position: 0,
            trophies: 0,
            earnedSquares: new Set(),
            isCpu: state.mode === 'cpu' && i === 1
          });
        }

        renderPlayerScoresList();
        renderTokens();
        updateTurnDisplay();

        settingsScreen.classList.remove('active');
        gameScreen.classList.add('active');
        victoryOverlay.classList.remove('open');
        questionModal.classList.remove('open');
      }

      function renderPlayerScoresList() {
        playersListPanel.innerHTML = '';
        state.players.forEach((p, idx) => {
          const item = document.createElement('div');
          item.className = 'player-list-item' + (idx === state.activeIdx ? ' active-player' : '');
          item.id = 'player-list-item-' + idx;
          if (idx === state.activeIdx) {
            item.style.borderColor = p.color;
          }

          const left = document.createElement('div');
          left.className = 'pli-left';

          const dot = document.createElement('div');
          dot.className = 'pli-dot';
          dot.style.background = p.color;

          const nameEl = document.createElement('span');
          nameEl.className = 'pli-name';
          nameEl.textContent = p.name;

          left.appendChild(dot);
          left.appendChild(nameEl);

          const trophyEl = document.createElement('span');
          trophyEl.className = 'pli-trophy';
          trophyEl.id = 'player-trophy-' + idx;
          trophyEl.textContent = '🏆 ' + p.trophies + '/5';

          item.appendChild(left);
          item.appendChild(trophyEl);
          playersListPanel.appendChild(item);
        });
      }

      function updateTurnDisplay() {
        const activePlayer = state.players[state.activeIdx];
        if (!activePlayer) return;

        activePlayerBadge.textContent = activePlayer.name;
        activePlayerBadge.style.background = activePlayer.color;

        // Highlight player in list
        document.querySelectorAll('.player-list-item').forEach((item, idx) => {
          if (idx === state.activeIdx) {
            item.classList.add('active-player');
            item.style.borderColor = activePlayer.color;
          } else {
            item.classList.remove('active-player');
            item.style.borderColor = '#d4deee';
          }
        });

        moveActionBtn.style.display = 'none';

        if (activePlayer.isCpu) {
          turnStatusText.textContent = 'CPU is thinking...';
          announce('CPU turn. Rolling dice.');
          state.isBusy = true;
          // Trigger CPU roll after short readable delay
          state.cpuTimeoutId = setTimeout(() => {
            cpuRollAndMove();
          }, 850);
        } else {
          turnStatusText.textContent = 'Click the dice to roll.';
          announce(activePlayer.name + "'s turn. Click the dice to roll.");
          state.isBusy = false;
        }
      }

      // 10. Token Rendering and Mathematical Centering
      function renderTokens() {
        // Group players by position
        const byPos = {};
        state.players.forEach(p => {
          if (!byPos[p.position]) byPos[p.position] = [];
          byPos[p.position].push(p);
        });

        // Clear dock tokens zone
        dockTokensZone.innerHTML = '';
        if (byPos[0] && byPos[0].length > 0) {
          byPos[0].forEach(p => {
            const item = document.createElement('div');
            item.className = 'dock-token-item';
            
            const circle = document.createElement('div');
            circle.className = 'dock-token-circle';
            circle.style.background = p.color;
            circle.textContent = p.id;

            const name = document.createElement('span');
            name.className = 'dock-token-name';
            name.textContent = p.name;

            item.appendChild(circle);
            item.appendChild(name);
            dockTokensZone.appendChild(item);
          });
        }

        // On the board frame
        const frameRect = boardFrame.getBoundingClientRect();
        if (frameRect.width === 0) return; // not rendered yet

        // Clear existing tokens in layer
        tokensLayer.innerHTML = '';

        Object.keys(byPos).forEach(posStr => {
          const pos = parseInt(posStr, 10);
          if (pos === 0) return; // in dock

          const cell = document.getElementById('square-cell-' + pos);
          if (!cell) return;

          const cellRect = cell.getBoundingClientRect();
          // Geometric center relative to board frame
          const centerX = cellRect.left - frameRect.left + cellRect.width / 2;
          const centerY = cellRect.top - frameRect.top + cellRect.height / 2;

          const group = byPos[pos];
          const count = group.length;

          // Token offset distance scales with cell width
          const r = Math.min(cellRect.width, cellRect.height) * 0.22;

          group.forEach((p, idx) => {
            let offsetX = 0;
            let offsetY = 0;

            if (count === 1) {
              // Exactly geometric center: 0px offset on both axes!
              offsetX = 0;
              offsetY = 0;
            } else if (count === 2) {
              offsetX = idx === 0 ? -r : r;
              offsetY = 0;
            } else if (count === 3) {
              if (idx === 0) { offsetX = -r * 0.9; offsetY = -r * 0.75; }
              else if (idx === 1) { offsetX = r * 0.9; offsetY = -r * 0.75; }
              else { offsetX = 0; offsetY = r * 0.85; }
            } else if (count === 4) {
              offsetX = (idx % 2 === 0 ? -1 : 1) * r * 0.85;
              offsetY = (idx < 2 ? -1 : 1) * r * 0.85;
            } else if (count === 5) {
              if (idx === 0) { offsetX = -r; offsetY = -r; }
              else if (idx === 1) { offsetX = r; offsetY = -r; }
              else if (idx === 2) { offsetX = -r; offsetY = r; }
              else if (idx === 3) { offsetX = r; offsetY = r; }
              else { offsetX = 0; offsetY = 0; }
            }

            const token = document.createElement('div');
            token.className = 'player-token';
            token.id = 'token-player-' + p.id;
            token.style.background = p.color;
            token.style.left = (centerX + offsetX) + 'px';
            token.style.top = (centerY + offsetY) + 'px';
            token.textContent = p.id;
            token.setAttribute('aria-label', p.name + ' token on square ' + pos);

            tokensLayer.appendChild(token);
          });
        });
      }

      window.addEventListener('resize', () => {
        if (gameScreen.classList.contains('active')) {
          renderTokens();
        }
      });

      // 11. Dice Rolling Mechanism
      function rollDiceValue() {
        return Math.floor(Math.random() * 6) + 1;
      }

      function animateDiceToValue(val, callback) {
        Sounds.roll();
        const target = DICE_TILT_ROTATIONS[val];
        
        // Add multiple 360-degree spins to create a vigorous rolling effect
        state.diceTotalRotX += 720;
        state.diceTotalRotY += 1080;

        // Apply landing angles incorporating base tilt
        const finalX = state.diceTotalRotX + target.x;
        const finalY = state.diceTotalRotY + target.y;

        diceCube.style.transform = 'rotateX(' + finalX + 'deg) rotateY(' + finalY + 'deg)';

        setTimeout(() => {
          if (callback) callback();
        }, 1050);
      }

      // Dice Click Handler (Human)
      diceBtn.addEventListener('click', () => {
        if (state.isBusy || state.gameOver) return;
        const player = state.players[state.activeIdx];
        if (player.isCpu) return;

        state.isBusy = true;
        const roll = rollDiceValue();
        state.rolledValue = roll;
        turnStatusText.textContent = player.name + ' is rolling...';

        animateDiceToValue(roll, () => {
          turnStatusText.textContent = player.name + ' rolled a ' + roll + '!';
          announce(player.name + ' rolled a ' + roll);

          // Check if overshoot
          if (player.position + roll > 20) {
            turnStatusText.textContent = player.name + ' needs an exact roll. The token stays put.';
            announce(player.name + ' needs an exact roll. The token stays put.');
            Sounds.blocked();
            setTimeout(() => {
              nextTurn();
            }, 1800);
          } else {
            // Show Move button
            moveActionBtn.textContent = 'Move ' + roll + (roll === 1 ? ' space' : ' spaces');
            moveActionBtn.style.display = 'block';
            moveActionBtn.focus();
            state.isBusy = false;
          }
        });
      });

      moveActionBtn.addEventListener('click', () => {
        if (state.isBusy || state.gameOver) return;
        moveActionBtn.style.display = 'none';
        state.isBusy = true;
        const player = state.players[state.activeIdx];
        executeMovementSequence(player, state.rolledValue);
      });

      // CPU Automation
      function cpuRollAndMove() {
        if (state.gameOver) return;
        const player = state.players[state.activeIdx];
        if (!player || !player.isCpu) return;

        const roll = rollDiceValue();
        state.rolledValue = roll;
        turnStatusText.textContent = 'CPU is rolling...';

        animateDiceToValue(roll, () => {
          turnStatusText.textContent = 'CPU rolled a ' + roll + '!';
          announce('CPU rolled a ' + roll);

          if (player.position + roll > 20) {
            setTimeout(() => {
              turnStatusText.textContent = 'CPU needs an exact roll. The token stays put.';
              announce('CPU needs an exact roll. The token stays put.');
              Sounds.blocked();
              setTimeout(() => {
                nextTurn();
              }, 1800);
            }, 500);
          } else {
            setTimeout(() => {
              executeMovementSequence(player, roll);
            }, 1000);
          }
        });
      }

      // 12. Stepwise Movement, Ladders, Snakes
      function executeMovementSequence(player, steps) {
        let currentStep = 0;
        const startPos = player.position;

        function stepOnce() {
          if (state.gameOver) return;
          if (currentStep < steps) {
            currentStep++;
            player.position = startPos + currentStep;
            renderTokens();
            Sounds.step(player.position);

            const tokenEl = document.getElementById('token-player-' + player.id);
            if (tokenEl) {
              tokenEl.classList.remove('hopping');
              void tokenEl.offsetWidth; // force reflow
              tokenEl.classList.add('hopping');
            }

            if (player.position === 20) {
              // Reached 20 exactly: IMMEDIATE WIN!
              setTimeout(() => {
                triggerVictory(player, 'reached square 20!');
              }, 400);
              return;
            }

            setTimeout(stepOnce, 320);
          } else {
            // Completed ordinary steps. Now check snakes / ladders
            setTimeout(() => {
              handleSnakeOrLadder(player);
            }, 350);
          }
        }

        stepOnce();
      }

      function handleSnakeOrLadder(player) {
        const pos = player.position;

        // Check Ladder
        if (LADDERS[pos]) {
          const dest = LADDERS[pos];
          turnStatusText.textContent = 'Ladder! ' + player.name + ' climbs to square ' + dest + '.';
          announce('Ladder! ' + player.name + ' climbs to square ' + dest);
          Sounds.ladder();

          setTimeout(() => {
            player.position = dest;
            renderTokens();
            if (player.position === 20) {
              setTimeout(() => triggerVictory(player, 'climbed a ladder to square 20!'), 400);
              return;
            }
            setTimeout(nextTurn, 1500);
          }, 600);
          return;
        }

        // Check Snake
        if (SNAKES[pos]) {
          const dest = SNAKES[pos];
          turnStatusText.textContent = 'Oh no! A snake bites ' + player.name + ' and slides the token down to square ' + dest + '.';
          announce('Oh no! A snake bites ' + player.name + ' and slides the token down to square ' + dest);
          Sounds.snake();

          // Briefly show crying face emoji overlay
          snakeCryingOverlay.classList.add('show');
          setTimeout(() => {
            snakeCryingOverlay.classList.remove('show');
          }, 1100);

          setTimeout(() => {
            player.position = dest;
            renderTokens();
            setTimeout(nextTurn, 1500);
          }, 850);
          return;
        }

        // Normal square landing
        nextTurn();
      }

      function nextTurn() {
        if (state.gameOver) return;
        state.isBusy = false;
        state.activeIdx = (state.activeIdx + 1) % state.players.length;
        updateTurnDisplay();
      }

      // 13. Questions, Answers, and Trophies
      function handleQuestionIconClick(sqNum) {
        if (state.isBusy || state.gameOver) return;
        const activePlayer = state.players[state.activeIdx];
        if (activePlayer.isCpu) return;

        const record = state.questions[sqNum - 1];
        if (!record || !record.q.trim()) {
          showToast('No question is saved for square ' + sqNum + ' yet. Add it in settings.');
          Sounds.blocked();
          return;
        }

        // Open modal for this square
        state.openSquareNum = sqNum;
        modalSqTitle.textContent = 'Square ' + sqNum + ' question';
        modalQuestionText.textContent = record.q;
        modalAnswerInput.value = '';
        modalFeedback.textContent = '';
        modalFeedback.className = 'modal-feedback';

        questionModal.classList.add('open');
        modalAnswerInput.focus();
      }

      function normalizeAnswer(str) {
        return (str || '')
          .toLowerCase()
          .trim()
          .replace(/\\s+/g, ' ');
      }

      function checkModalAnswer() {
        if (!state.openSquareNum) return;
        const sqNum = state.openSquareNum;
        const record = state.questions[sqNum - 1];
        if (!record) return;

        const userAns = normalizeAnswer(modalAnswerInput.value);
        const correctAns = normalizeAnswer(record.a);
        const player = state.players[state.activeIdx];

        if (userAns !== correctAns) {
          modalFeedback.textContent = 'Not quite—try again. Check spelling and spacing.';
          modalFeedback.className = 'modal-feedback error';
          Sounds.wrong();
          return;
        }

        // Correct!
        if (player.earnedSquares.has(sqNum)) {
          modalFeedback.textContent = 'Correct! You already earned the trophy for this square.';
          modalFeedback.className = 'modal-feedback info';
          Sounds.correct();
          return;
        }

        // Award Trophy!
        player.earnedSquares.add(sqNum);
        player.trophies++;
        
        // Update display
        const trophyEl = document.getElementById('player-trophy-' + state.activeIdx);
        if (trophyEl) trophyEl.textContent = '🏆 ' + player.trophies + '/5';

        Sounds.trophy();
        modalFeedback.textContent = 'Correct! Trophy earned! ✨🏆';
        modalFeedback.className = 'modal-feedback success';

        // Check 5-Trophy Win condition
        if (player.trophies >= 5) {
          setTimeout(() => {
            questionModal.classList.remove('open');
            player.position = 20;
            renderTokens();
            triggerVictory(player, 'collected five trophies!');
          }, 900);
        }
      }

      modalCheckBtn.addEventListener('click', checkModalAnswer);
      modalAnswerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          checkModalAnswer();
        } else if (e.key === 'Escape') {
          questionModal.classList.remove('open');
        }
      });

      function closeModal() {
        questionModal.classList.remove('open');
        state.openSquareNum = null;
      }
      modalCloseBtn.addEventListener('click', closeModal);
      modalCloseX.addEventListener('click', closeModal);
      questionModal.addEventListener('click', (e) => {
        if (e.target === questionModal) closeModal();
      });

      // 14. Victory Celebration
      function triggerVictory(winner, reason) {
        state.gameOver = true;
        state.isBusy = true;
        if (state.cpuTimeoutId) clearTimeout(state.cpuTimeoutId);

        victoryWinnerName.textContent = winner.name + ' wins!';
        victoryWinnerName.style.color = winner.color;
        victoryReason.textContent = 'Reason: ' + reason;

        // Generate ~90 colorful confetti
        confettiContainer.innerHTML = '';
        const confettiColors = ['#ffd85b', '#ff5d66', '#1878ee', '#18a75b', '#8a4de1', '#40e8ff', '#ffffff'];
        for (let i = 0; i < 90; i++) {
          const piece = document.createElement('div');
          piece.className = 'confetti-piece';
          piece.style.left = (Math.random() * 100) + '%';
          piece.style.top = (-20 - Math.random() * 100) + 'px';
          piece.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
          piece.style.animationDuration = (2.2 + Math.random() * 2.8) + 's';
          piece.style.animationDelay = (Math.random() * 1.5) + 's';
          piece.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
          confettiContainer.appendChild(piece);
        }

        victoryOverlay.classList.add('open');
        Sounds.victory();
        announce('Game Over. ' + winner.name + ' won! ' + reason, true);
      }

      playAgainBtn.addEventListener('click', () => {
        victoryOverlay.classList.remove('open');
        initGame();
      });

      // 15. Header Sound Toggle & Nav Buttons
      soundToggleBtn.addEventListener('click', () => {
        state.soundEnabled = !state.soundEnabled;
        soundToggleBtn.setAttribute('aria-pressed', state.soundEnabled ? 'true' : 'false');
        if (state.soundEnabled) {
          soundToggleBtn.textContent = '🔊 Sound on';
          Sounds.save();
        } else {
          soundToggleBtn.textContent = '🔇 Sound off';
        }
      });

      startGameBtn.addEventListener('click', () => {
        // Save current name input values if any
        const inputs = playerNamesContainer.querySelectorAll('.name-input');
        inputs.forEach(input => {
          const idx = parseInt(input.dataset.index, 10);
          if (state.mode === 'cpu' && idx === 1) {
            state.savedNames[1] = 'CPU';
          } else {
            state.savedNames[idx] = input.value.trim().slice(0, 22);
          }
        });
        saveNamesToStorage();
        initGame();
      });

      backToSettingsBtn.addEventListener('click', () => {
        if (state.cpuTimeoutId) clearTimeout(state.cpuTimeoutId);
        gameScreen.classList.remove('active');
        settingsScreen.classList.add('active');
        victoryOverlay.classList.remove('open');
        questionModal.classList.remove('open');
      });

      restartGameBtn.addEventListener('click', () => {
        initGame();
      });

      modeCardCpu.addEventListener('click', () => setPlayMode('cpu'));
      modeCardLocal.addEventListener('click', () => setPlayMode('local'));
      countBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          setLocalPlayerCount(parseInt(btn.dataset.count, 10));
        });
      });

      // 16. Bootstrap
      loadStorage();
      buildBoardGrid();
      populateSquareSelector();
      renderPlayerNameInputs();
      setPlayMode('cpu');

    })();
  </script>
</body>
</html>
`;

// Write to standalone file and to index.html
fs.writeFileSync(path.join(__dirname, '../snake-learning-game-latest-edition.html'), htmlContent, 'utf8');
fs.writeFileSync(path.join(__dirname, '../index.html'), htmlContent, 'utf8');

console.log("Successfully generated snake-learning-game-latest-edition.html and index.html");
