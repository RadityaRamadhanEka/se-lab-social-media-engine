/**
 * SE Lab FILKOM UB (@se.lab.filkom) - Social Media Management Engine (Fase 1)
 * Pasang script ini di Google Sheets -> Extensions -> Apps Script.
 */

const CONFIG = {
  // Folder ID Google Drive utama (SE_Lab_Social_Media)
  ROOT_DRIVE_FOLDER_ID: '1M2IH_Yzhav4o7OJrOZpgJBbxCvjRpO7W',
  // Opsional: ID Google Docs template brief; kosongkan ('') jika ingin dibuatkan Doc baru otomatis
  BRIEF_TEMPLATE_DOC_ID: '',
  // Nama tab di Google Sheets
  SHEETS: {
    CALENDAR: 'Master_Kalender_Harian',
    PIPELINE: 'Pipeline_Produksi',
  },
};

/**
 * Membuat menu kustom saat Google Sheets dibuka.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('SE Lab Engine')
    .addItem('1. Provision Folder Drive & Brief (Baris Aktif)', 'provisionSelectedContent')
    .addItem('2. Generate Morning Brief WhatsApp', 'generateWhatsAppMorningBrief')
    .addItem('3. Export JSON Props (Reels Ready_To_Render)', 'exportReadyReelsPropsJson')
    .addToUi();
}

/**
 * Membuat folder terstruktur di Google Drive + file Google Docs Brief
 * untuk baris konten yang sedang dipilih di tab Pipeline_Produksi.
 */
function provisionSelectedContent() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (sheet.getName() !== CONFIG.SHEETS.PIPELINE) {
    ui.alert(`Pilih baris konten di tab "${CONFIG.SHEETS.PIPELINE}" terlebih dahulu.`);
    return;
  }

  if (!CONFIG.ROOT_DRIVE_FOLDER_ID || CONFIG.ROOT_DRIVE_FOLDER_ID.includes('PASTE_')) {
    ui.alert('Isi terlebih dahulu CONFIG.ROOT_DRIVE_FOLDER_ID di Apps Script dengan ID folder Drive Lab.');
    return;
  }

  const row = sheet.getActiveRange().getRow();
  if (row < 2) {
    ui.alert('Pilih baris data konten (baris 2 ke bawah), bukan header.');
    return;
  }

  // Struktur kolom Pipeline_Produksi (1-based index):
  // A=1:ID, B=2:Tanggal, C=3:Format, D=4:Pillar, E=5:Judul, F=6:PIC, G=7:Status,
  // H=8:Tema, I=9:Hook, J=10:Isi, K=11:CTA, M=13:Link_Folder_Drive, N=14:Link_Brief_Doc
  const values = sheet.getRange(row, 1, 1, 15).getValues()[0];
  const id = String(values[0] || '').trim();
  const rawDate = values[1];
  const format = String(values[2] || 'Reels').trim();
  const title = String(values[4] || '').trim();
  const pic = String(values[5] || '').trim();

  if (!id || !title) {
    ui.alert('Kolom ID (A) dan Judul_Topik (E) wajib diisi sebelum provisioning.');
    return;
  }

  const existingDriveUrl = String(values[12] || '').trim();
  if (existingDriveUrl) {
    ui.alert(
      `Folder untuk ${id} sudah pernah dibuat!\n\nLink: ${existingDriveUrl}\n\nHapus isi kolom Link_Folder_Drive (M) terlebih dahulu jika memang ingin membuat folder baru.`
    );
    return;
  }

  const datePrefix = formatDateYmd_(rawDate);
  const safeTitle = title.replace(/[^\w\s-]/g, '').trim().slice(0, 40);
  const folderName = `${datePrefix}_${id}_${format}_${safeTitle}`;

  const rootFolder = DriveApp.getFolderById(CONFIG.ROOT_DRIVE_FOLDER_ID);
  const contentFolder = rootFolder.createFolder(folderName);
  contentFolder.createFolder('01_Raw_Assets');
  contentFolder.createFolder('02_Audio_VO');
  contentFolder.createFolder('03_Final_Output');

  const docUrl = createBriefDoc_(contentFolder, {
    id,
    datePrefix,
    format,
    pillar: String(values[3] || ''),
    title,
    pic,
    theme: String(values[7] || 'light'),
    hook: String(values[8] || ''),
    story: String(values[9] || ''),
    cta: String(values[10] || ''),
  });

  sheet.getRange(row, 13).setValue(contentFolder.getUrl());
  sheet.getRange(row, 14).setValue(docUrl);

  ui.alert(`Berhasil!\nFolder Drive & Brief Doc untuk ${id} sudah dibuat dan link otomatis terisi.`);
}

/**
 * Menghasilkan ringkasan Morning Brief hari ini & besok siap copy-paste ke grup WhatsApp.
 */
function generateWhatsAppMorningBrief() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const calSheet = ss.getSheetByName(CONFIG.SHEETS.CALENDAR);

  if (!calSheet) {
    ui.alert(`Tab "${CONFIG.SHEETS.CALENDAR}" tidak ditemukan.`);
    return;
  }

  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const todayStr = formatDateYmd_(today);
  const tomorrowStr = formatDateYmd_(tomorrow);

  const rows = calSheet.getDataRange().getValues();
  const findRowByDate = (targetYmd) => {
    for (let i = 1; i < rows.length; i++) {
      if (formatDateYmd_(rows[i][0]) === targetYmd) return rows[i];
    }
    return null;
  };

  const todayRow = findRowByDate(todayStr);
  const tomorrowRow = findRowByDate(tomorrowStr);

  const lines = [
    '*[SE LAB @se.lab.filkom] Morning Content Brief*',
    `Tanggal: ${todayStr}`,
    '',
  ];

  if (todayRow) {
    lines.push('*HARI INI:*');
    lines.push(`• Konten Utama (${todayRow[3] || '-'}): *${todayRow[4] || '-'}*`);
    lines.push(`  Status: ${todayRow[5] || '-'} | PIC: ${todayRow[6] || '-'}`);
    lines.push(`• Snapgram: *${todayRow[7] || '-'}* (${todayRow[8] || '-'})`);
    lines.push(`  Status: ${todayRow[10] || '-'} | PIC: ${todayRow[9] || '-'}`);
  } else {
    lines.push(`*HARI INI (${todayStr}):* Belum ada slot terjadwal di ${CONFIG.SHEETS.CALENDAR}.`);
  }

  lines.push('');

  if (tomorrowRow) {
    lines.push(`*PERSIAPAN BESOK (${tomorrowStr}):*`);
    lines.push(`• ${tomorrowRow[3] || '-'}: *${tomorrowRow[4] || '-'}* (PIC: ${tomorrowRow[6] || '-'}, Status: ${tomorrowRow[5] || '-'})`);
    lines.push(`• Snapgram: *${tomorrowRow[7] || '-'}* (PIC: ${tomorrowRow[9] || '-'})`);
  }

  lines.push('');
  lines.push('Silakan update status di Google Sheets jika aset sudah masuk Drive. Semangat!');

  const message = lines.join('\n');
  showCopyModal_('Morning Brief WhatsApp', message);
}

/**
 * Mengekspor seluruh baris Reels dengan status "Ready_To_Render"
 * menjadi array JSON props siap pakai untuk Remotion CLI / local script.
 */
function exportReadyReelsPropsJson() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEETS.PIPELINE);

  if (!sheet) {
    ui.alert(`Tab "${CONFIG.SHEETS.PIPELINE}" tidak ditemukan.`);
    return;
  }

  const rows = sheet.getDataRange().getValues();
  const queue = [];

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const format = String(r[2] || '').trim();
    const status = String(r[6] || '').trim();

    if (format === 'Reels' && status === 'Ready_To_Render') {
      queue.push({
        id: String(r[0] || '').trim(),
        publishDate: formatDateYmd_(r[1]),
        pillar: String(r[3] || '').trim(),
        title: String(r[4] || '').trim(),
        pic: String(r[5] || '').trim(),
        theme: String(r[7] || 'light').trim().toLowerCase() === 'dark' ? 'dark' : 'light',
        hook: String(r[8] || '').trim(),
        storyOutline: String(r[9] || '').trim(),
        cta: String(r[10] || '').trim(),
        caption: String(r[11] || '').trim(),
        driveFolderUrl: String(r[12] || '').trim(),
      });
    }
  }

  if (queue.length === 0) {
    ui.alert('Tidak ada baris Reels dengan status "Ready_To_Render".');
    return;
  }

  showCopyModal_(`Queue Render Remotion (${queue.length} Reels)`, JSON.stringify(queue, null, 2));
}

/**
 * Membuat Google Docs Brief di dalam folder produksi konten.
 */
function createBriefDoc_(folder, meta) {
  const docTitle = `Brief_${meta.id}_${meta.title}`;
  let docFile;

  if (CONFIG.BRIEF_TEMPLATE_DOC_ID) {
    const templateFile = DriveApp.getFileById(CONFIG.BRIEF_TEMPLATE_DOC_ID);
    docFile = templateFile.makeCopy(docTitle, folder);
    return docFile.getUrl();
  }

  const doc = DocumentApp.create(docTitle);
  const body = doc.getBody();
  body.appendParagraph(`CONTENT BRIEF — ${meta.id}`).setHeading(DocumentApp.ParagraphHeading.HEADING1);
  body.appendParagraph(`Judul: ${meta.title}`);
  body.appendParagraph(`Format: ${meta.format} | Pillar: ${meta.pillar} | Tema 3D: ${meta.theme}`);
  body.appendParagraph(`Target Tayang: ${meta.datePrefix} | PIC: ${meta.pic}`);
  body.appendParagraph('');
  body.appendParagraph('1. Hook (0–3 Detik)').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(meta.hook || '(Isi kalimat pembuka & visual 3D awal)');
  body.appendParagraph('');
  body.appendParagraph('2. Alur Cerita / Poin Slide (Babak 1–3)').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(meta.story || '(Isi alur cerita visual 3D atau poin per slide)');
  body.appendParagraph('');
  body.appendParagraph('3. CTA & Catatan Outro').setHeading(DocumentApp.ParagraphHeading.HEADING2);
  body.appendParagraph(meta.cta || 'Save & follow @se.lab.filkom!');
  doc.saveAndClose();

  docFile = DriveApp.getFileById(doc.getId());
  docFile.moveTo(folder);
  return docFile.getUrl();
}

function formatDateYmd_(value) {
  if (!value) return 'TBD';
  if (value instanceof Date && !isNaN(value.getTime())) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(value).trim();
}

function showCopyModal_(title, textContent) {
  const escaped = textContent
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const html = HtmlService.createHtmlOutput(
    `<div style="font-family:sans-serif;padding:8px;">
      <p style="margin:0 0 8px;">Salin teks di bawah ini:</p>
      <textarea style="width:100%;height:320px;font-family:monospace;font-size:12px;" readonly onclick="this.select()">${escaped}</textarea>
    </div>`
  )
    .setWidth(560)
    .setHeight(400);
  SpreadsheetApp.getUi().showModalDialog(html, title);
}
