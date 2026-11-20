# 06 — Panduan Setup & Penggunaan Remotion untuk Tim (`@se.lab.filkom`)

Dokumen ini menjelaskan cara agar **Bagas, Hanifah, Lidia, Aurel**, dan asisten lab berikutnya bisa menggunakan mesin video 3D Remotion tanpa ribet—baik tanpa install coding sama sekali maupun dengan setup di laptop sendiri / PC Lab.

---

## Pilih Jalur yang Paling Cocok untuk Tim

### Jalur 1 — Tanpa Install Coding (Paling Direkomendasikan untuk Tim Konten!)
**Cocok untuk:** Anggota tim yang fokus di penulisan naskah, ideasi, Feeds, dan review.

1. **Cukup kerja dari Google Sheets (`SE_Lab_Content_Hub`):**
   - Pilih ide dari tab `Katalog_Reels_Remotion` atau tulis ide baru.
   - Isi naskah di `Pipeline_Produksi` / Google Docs Brief (`Hook`, `Isi Cerita`, `CTA`, `Tema_Visual`: `light` atau `dark`).
   - Ubah status menjadi **`Ready_To_Render`**.
2. **Mesin Remotion hanya jalan di 1 PC Pusat** (laptop Raditya atau **1 PC Lab RPL di F8.3 / F8.5**):
   - Operator menjalankan export JSON dari Google Sheets → menjalankan `node automation/batch-render.mjs queue.json` → video `.mp4` otomatis jadi lalu masuk ke folder Google Drive `03_Final_Output`.
3. **Preview Bareng lewat Wi-Fi Lab (Tanpa Install):**
   - Saat PC Lab / laptop Raditya menjalankan `npm run dev` di `video-studio/`, Remotion Studio membuka alamat **Network URL** (contoh yang muncul di terminal: `http://<IP-LOKAL>:3000`).
   - Teman-teman di Wi-Fi yang sama bisa membuka URL tersebut langsung dari browser laptop/HP mereka untuk preview, ubah teks di panel **Props**, dan melihat hasilnya secara *live*!

---

### Jalur 2 — Setup di PC Lab / Laptop Baru (Untuk Operator Render atau Developer)
**Cocok untuk:** Memasang engine Remotion di komputer Lab RPL (F8.3/F8.5) atau laptop anggota yang ingin ikut mengembangkan template 3D.

#### Prasyarat
- **Node.js** versi `20+` atau `24+` (termasuk `npm`).
- **Git** (jika clone dari GitHub/GitLab lab).

#### Langkah Setup (Sekali Saja, ~5 Menit)
1. **Clone / Copy folder project** ke PC target, lalu buka terminal di folder `video-studio/`:
   ```powershell
   cd "SOCIAL MEDIA MANAGEMENT LAB RPL/video-studio"
   ```
2. **Install seluruh package:**
   ```powershell
   npm install
   ```
3. **Download browser renderer bawaan Remotion (satu kali):**
   ```powershell
   npx remotion browser ensure
   ```
4. **Pastikan aset audio & font sudah siap** *(sudah ikut di folder `public/assets/`, `public/fonts/`, `public/audio/` — jika perlu regenerasi jalankan)*:
   ```powershell
   npm run gen:audio-kit
   npm run gen:vo
   ```
5. **Uji kompilasi & jalankan Remotion Studio:**
   ```powershell
   npm run typecheck
   npm run dev
   ```
   Buka **`http://localhost:3000`** di browser.

#### Cara Render Video Penuh (`.mp4`)
- Render episode default (`ApaItuRpl3D`):
  ```powershell
  npm run render:rpl
  ```
- Render versi tema `dark`:
  ```powershell
  npm run render:rpl:dark
  ```
- Render massal dari file antrean JSON hasil export Google Sheets (dari folder root project):
  ```powershell
  node automation/batch-render.mjs automation/sample-queue.json
  ```

---

### Jalur 3 — Opsi Lanjutan Fase 2 (Web UI Mini / Render via GitHub Actions)
Jika suatu saat tim ingin men-trigger render dari mana saja tanpa harus datang ke PC Lab:
- **Opsi A (Mini Web Form di PC Lab):** Buat 1 halaman web sederhana di lab tempat tim cukup paste naskah + klik tombol *Render* (menjalankan `batch-render.mjs` di server lab).
- **Opsi B (GitHub Actions):** Push repo ini ke GitHub (file berat seperti `node_modules/`, `.remotion/`, dan `out/*.mp4` sudah otomatis dikecualikan di `.gitignore`), lalu buat workflow GitHub Actions untuk render saat ada file JSON baru di `automation/queue.json` *(catatan: render 3D WebGL di CPU cloud tanpa GPU jauh lebih lambat dibanding PC lokal dengan `--gl=angle`)*.
