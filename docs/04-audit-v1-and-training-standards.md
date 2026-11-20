# 04 — Audit Prototype v1 & Standar Training Produksi 3D (`@se.lab.filkom`)

Dokumen ini mencatat hasil audit teknis dan visual dari **Prototype v1 (`ApaItuRpl3D`)** beserta standar perbaikan yang diterapkan pada **v2**, untuk dijadikan pedoman (*training baseline*) bagi seluruh pembuatan video edukasi 3D berikutnya.

---

## 1. Ringkasan Temuan Audit Prototype v1

| Area Audit | Masalah di Prototype v1 | Dampak ke Penonton / Produksi | Standar Baru (v2 & Seterusnya) |
| :--- | :--- | :--- | :--- |
| **Audio & Voiceover (VO)** | Belum ada track suara; video hanya mengandalkan teks layar. | Retensi 3 detik pertama lemah, terasa sepi tanpa narator. | Wajib generate VO otomatis via `scripts/generate-vo.ps1` (Windows Male TTS `Microsoft David Desktop`) & sinkronisasi timeline otomatis lewat `vo-manifest.json`. |
| **Geometri & Poly Aset 3D** | Memakai primitif tajam bawaan (`boxGeometry`, `octahedronGeometry` 0 subdivisi, silinder 12–32 segmen). | Tepi objek tampak kaku (*blocky/low-poly*), pantulan cahaya kurang halus. | Wajib memakai `RoundedBoxGeometry` (bevel 6 segmen), `ExtrudeGeometry` ber-bevel, `TubeGeometry` (`CatmullRomCurve3` 48 segmen), silinder/kubah `48–64` segmen, serta `MeshPhysicalMaterial` (`clearcoat`). |
| **Sosok Narator 3D** | Hanya objek mati tanpa figur pemandu cerita. | Kurang terasa "bercerita" dan kurang ada koneksi manusiawi/maskot lab. | Menambahkan aset **`NarratorCharacter3D`** (maskot engineer SE Lab ber-hoodie biru, visor kaca, headset narator, kedip mata, mulut sinkron dengan `speaking`, dan pose menunjuk objek per babak). |
| **Kamera & Pembingkaian 9:16** | Pada iterasi awal v1, `<perspectiveCamera>` tidak mengganti kamera aktif R3F sehingga objek terpotong di tepi layar. | Objek keluar frame dan bertumpuk dengan kartu subtitle. | Wajib mengendalikan `useThree((s) => s.camera)` lewat `<CameraController />`, memisahkan zona spasial per babak (`x = -18`, `0..18`, `36`), dan mengunci `lookAt` di tengah area aman 9:16. |
| **Kontras Aset & Offline Fonts** | `se-logo-vector.svg` berwarna putih tak terlihat di pill background terang; Google Fonts butuh internet saat render. | Logo hilang di mode `light` & render gagal jika offline. | Mode `light` memakai `se-logo.png` berwarna, mode `dark`/footer navy memakai `se-logo-vector.svg` putih. Semua font disimpan lokal di `public/fonts/`. |

---

## 2. Catatan Penting Voiceover Windows TTS (Untuk Evaluasi Fase 2)

- Pada mesin Windows saat ini, voice bawaan bertipe **Male** yang terpasang adalah **`Microsoft David Desktop` (`en-US`, Male)**.
- Karena paket bahasa **`id-ID` (Indonesia)** belum terpasang di Windows Speech, skrip VO pada `scripts/generate-vo.ps1` menggunakan narasi **bahasa Inggris teknis yang singkat dan jelas** sementara *headline* dan *subtitle* di layar tetap memakai **bahasa Indonesia** (konsep *bilingual tech explainer*).
- **Opsi Upgrade ke Depan (Training Tim):**
  1. **Install Indonesian Speech Pack di Windows:** Buka *Settings → Time & Language → Speech → Add voices → Indonesian* jika ingin VO otomatis berbahasa Indonesia murni lewat `System.Speech`.
  2. **Rekaman Suara Anggota Tim (Human VO):** Raditya/Bagas/Hanifah/Lidia/Aurel cukup rekam `.wav` per babak dengan nama file sama di `public/audio/`, lalu sistem sinkronisasi `vo-manifest.json` tetap bisa dipakai.
  3. **Fase 2 AI TTS:** Bisa dihubungkan ke Gemini TTS / Edge TTS untuk suara berbahasa Indonesia yang natural.

---

## 3. Standar Teknis Wajib untuk Setiap Video 3D Baru (Checklist QA)

Sebelum sebuah Reels 3D dinyatakan `Ready` untuk di-render MP4 penuh:
1. **Audio-Driven Timeline:** Jalankan `npm run gen:vo` terlebih dahulu agar `src/audio/vo-manifest.json` mengukur durasi riil tiap klip dan memastikan antar-babak tidak tumpang tindih.
2. **High-Poly & Material Check:** Tidak ada kubus/silinder tajam tanpa bevel di objek utama; gunakan `RoundedBoxGeometry` atau `ExtrudeGeometry` + `MeshPhysicalMaterial` + *key/fill/rim lighting*.
3. **Narrator Sync:** Karakter narator (`NarratorCharacter3D`) hadir memandu minimal pada Hook, Penjelasan Utama, dan Outro, dengan `speaking={isNarratorSpeaking(frame)}`.
4. **Safe-Zone & Kontras Check:** Render 4 *still frame* perwakilan (`babak1`, `babak2`, `step`, `outro`) dan periksa visualnya sebelum render MP4 penuh (`npm run render:rpl`).
5. **Dual-Theme Ready:** Pastikan komposisi berjalan bersih baik pada `theme: "light"` maupun `theme: "dark"`.
