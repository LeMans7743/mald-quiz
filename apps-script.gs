/**
 * 軍學科題庫｜Google Apps Script
 * 放在「軍學科題庫｜題庫與紀錄」試算表：擴充功能 → Apps Script，整段貼上後部署成網頁應用程式。
 *  - GET  ：回傳「題庫」工作表（網站讀題目用）
 *  - POST ：把網站送來的使用紀錄寫進「紀錄」工作表
 * 這支程式只會「讀題庫」和「新增紀錄」，不會把紀錄回傳給任何人。
 */
const SHEET_BANK = '題庫';
const SHEET_LOG = '紀錄';

function doGet(e) {
  const sh = SpreadsheetApp.getActive().getSheetByName(SHEET_BANK);
  const values = sh.getDataRange().getDisplayValues();
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    if (!r[0] || !r[2]) continue;               // 沒有科目或題目就跳過
    if (!r[11]) {                                // 新題目自動補 ID
      r[11] = 'q-' + Utilities.getUuid().slice(0, 8);
      sh.getRange(i + 1, 12).setValue(r[11]);
    }
    rows.push(r.slice(0, 12));
  }
  return json_({ rows: rows, updated: new Date().toISOString() });
}

function doPost(e) {
  let d = {};
  try { d = JSON.parse(e.postData.contents || '{}'); } catch (err) { return json_({ ok: false }); }
  const safe = function (x) {
    if (x === null || x === undefined) return '';
    if (typeof x === 'number') return x;
    x = String(x).slice(0, 3000);
    return /^[=+\-@]/.test(x) ? "'" + x : x;   // 防止被當成公式
  };
  const lock = LockService.getScriptLock();
  lock.tryLock(5000);
  try {
    SpreadsheetApp.getActive().getSheetByName(SHEET_LOG).appendRow([
      new Date(), safe(d.event), safe(d.name), safe(d.score), safe(d.n), safe(d.subjects),
      safe(d.mc), safe(d.sa), safe(d.detail), safe(d.ip), safe(d.os), safe(d.browser),
      safe(d.device), safe(d.screen), safe(d.lang), safe(d.tz), safe(d.vid)
    ]);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
