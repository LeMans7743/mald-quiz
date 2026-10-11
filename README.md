# 軍學科題庫

軍學科自我測驗網站（GitHub Pages）。題庫放在 Google 試算表，網站自動讀取；每次進入與交卷的紀錄會寫回同一份試算表。

- `index.html`：網站本體。最上面 `CONFIG.SCRIPT_URL` 填 Apps Script 網址。
- `bank.json`：連不到試算表時用的內建題庫。
- `apps-script.gs`：貼到試算表的 Apps Script，部署成網頁應用程式。
