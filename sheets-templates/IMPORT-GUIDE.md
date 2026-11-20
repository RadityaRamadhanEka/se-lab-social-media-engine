# Panduan Setup Kilat Google Sheets (`SE_Lab_Content_Hub`) — 3 Menit

Pakai 3 file `.csv` di folder ini supaya kamu tidak perlu mengetik header, rumus `XLOOKUP`, dan contoh jadwal minggu pertama dari nol!

---

## Langkah 1: Buat Folder Google Drive Lab
1. Buka Google Drive lab, buat folder utama bernama **`SE_Lab_Social_Media`**.
2. Buka folder tersebut, lalu salin **Folder ID** dari URL browser (bagian setelah `/folders/`).

---

## Langkah 2: Import 3 File CSV ke Google Sheets
1. Buat 1 file Google Sheets baru bernama **`SE_Lab_Content_Hub`**.
2. Buat/ganti nama 3 tab persis seperti ini (**huruf besar/kecil harus sama persis** agar terbaca `Code.gs`):
   - Tab 1: **`Master_Kalender_Harian`**
   - Tab 2: **`Pipeline_Produksi`**
   - Tab 3: **`Bank_Ide_&_Evaluasi`**
3. Buka tiap tab → klik **File → Import → Upload**:
   - Di tab `Master_Kalender_Harian` → upload `01-Master_Kalender_Harian.csv` (*Import location: Replace current sheet*).
   - Di tab `Pipeline_Produksi` → upload `02-Pipeline_Produksi.csv` (*Import location: Replace current sheet*).
   - Di tab `Bank_Ide_&_Evaluasi` → upload `03-Bank_Ide_&_Evaluasi.csv` (*Import location: Replace current sheet*).

> *Tips:* Rumus `XLOOKUP` di `Master_Kalender_Harian` akan langsung menarik Judul, Status, dan PIC dari `Pipeline_Produksi` secara otomatis!

---

## Langkah 3: Pasang Dropdown Validasi (Opsional tapi Sangat Rapi)
Di tab **`Pipeline_Produksi`**:
- Kolom **C (`Format`)**: Dropdown `Reels`, `Feeds`
- Kolom **D (`Pillar`)**: Dropdown `P1 - Tech Bites`, `P2 - Lab Life`, `P3 - Showcase`, `P4 - Info`
- Kolom **F (`PIC_Owner`)**: Dropdown `Raditya`, `Bagas`, `Hanifah`, `Lidia`, `Aurel`
- Kolom **G (`Status`)**: Dropdown `Ide`, `Drafting`, `Aset_Shooting`, `Ready_To_Render`, `Editing_Review`, `Scheduled`, `Published`
- Kolom **H (`Tema_Visual`)**: Dropdown `light`, `dark`

---

## Langkah 4: Pasang Google Apps Script (`Code.gs`)
1. Di Google Sheets, klik **Extensions → Apps Script**.
2. Hapus kode bawaan, lalu copy-paste seluruh isi [Code.gs](../apps-script/Code.gs).
3. Ganti `PASTE_GOOGLE_DRIVE_FOLDER_ID_DISINI` pada `CONFIG.ROOT_DRIVE_FOLDER_ID` dengan Folder ID dari Langkah 1, lalu **Save** (`Ctrl+S`).
4. Tutup Apps Script dan **refresh** Google Sheets — menu **`SE Lab Engine`** akan muncul di toolbar atas!

---

## Langkah 5: Bagikan ke Tim (5 Orang)
1. Klik **Share** di Google Sheets → beri akses **Editor** ke **Bagas, Hanifah, Lidia, dan Aurel**.
2. Buat 1 **Google Form** untuk setor ide cepat (Nama Pengusul, Pillar, Format Saran, Ide Mentah, Link Referensi) dan arahkan responnya ke `SE_Lab_Content_Hub` (atau salin ke tab `Bank_Ide_&_Evaluasi`).
3. Setiap pagi, klik **`SE Lab Engine → 2. Generate Morning Brief WhatsApp`** lalu paste hasilnya ke grup WA tim!
