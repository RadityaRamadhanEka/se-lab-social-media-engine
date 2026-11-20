# Local Automation Pipeline (Fase 2 — `@se.lab.filkom`)

Folder ini berisi kerangka automasi lokal berbasis Node.js untuk menghubungkan data manajemen dari **Google Sheets** (`SE Lab Engine → 3. Export JSON Props`) langsung ke mesin render **Remotion 3D** (`video-studio/`).

---

## Cara Pakai `batch-render.mjs`

1. Di Google Sheets `SE_Lab_Content_Hub`, ubah status baris Reels yang naskahnya sudah final menjadi **`Ready_To_Render`**.
2. Klik menu **`SE Lab Engine → 3. Export JSON Props (Reels Ready_To_Render)`**, lalu simpan hasilnya ke `automation/queue.json` (atau uji dengan `automation/sample-queue.json`).
3. Uji *dry-run* terlebih dahulu (memverifikasi konversi props tanpa render berat):
   ```powershell
   node automation/batch-render.mjs automation/sample-queue.json --dry-run
   ```
4. Jalankan *batch render* penuh ke `video-studio/out/batch/`:
   ```powershell
   node automation/batch-render.mjs automation/sample-queue.json
   ```

---

## Rencana Pengembangan Lanjutan (Setelah Evaluasi Minggu 1–2)
- Menghubungkan Gemini API untuk otomatis memecah 1 kalimat ide di `Bank_Ide` menjadi JSON 4 babak lengkap + naskah VO Bahasa Indonesia.
- Menambahkan auto-generate VO per ID konten saat *batch render* berlangsung.
- Menghubungkan bot pengingat WhatsApp lokal untuk mengirim *Morning Brief* otomatis ke grup tim (`Raditya, Bagas, Hanifah, Lidia, Aurel`).
