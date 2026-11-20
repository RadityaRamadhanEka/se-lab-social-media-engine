# Audit Log & Aturan Permanen Produksi Konten (`@se.lab.filkom`)

> **ATURAN WAJIB (TAKE NOTE):** Setiap temuan audit dan perbaikan yang dicatat di file ini **wajib dicek dan dipatuhi** sebelum merender atau mempublikasikan konten baru di `@se.lab.filkom`, agar kesalahan yang sama tidak pernah terulang.

---

## Log Audit #1 — Prototype v1 (`ApaItuRpl3D`)
**Masalah yang Ditemukan:**
1. Video tidak memiliki *voiceover* (bisu).
2. Objek 3D memakai primitif kotak/oktahedron tajam (*low-poly*) tanpa bevel & material studio.
3. Tidak ada karakter narator 3D yang memandu alur cerita.
4. Kamera `<perspectiveCamera>` tidak menggerakkan kamera aktif R3F sehingga objek terpotong.
5. Ikon SVG putih tidak terlihat pada background terang (`light` mode), dan font eksternal gagal saat render offline.

**Aturan Permanen:**
- Wajib ada track Voiceover tersinkronisasi melalui `vo-manifest.json` (durasi babak mengikuti durasi riil audio).
- Wajib memakai geometri **High-Poly** (`RoundedBoxGeometry`, `ExtrudeGeometry` ber-bevel, `TubeGeometry`, `48–64` segmen) dan `MeshPhysicalMaterial` (`clearcoat`).
- Wajib menghadirkan **`NarratorCharacter3D`** dengan *mouth sync* dan koreografi per babak.
- Wajib mengontrol kamera R3F melalui `useThree((s) => s.camera)` dan memisahkan zona spasial antar babak.
- Wajib membedakan ikon logo untuk mode `light` (`se-logo.png`) vs `dark` (`se-logo-vector.svg`), dan menyimpan font lokal di `public/fonts/`.

---

## Log Audit #2 — Review VO & Skala Branding (`ApaItuRpl3D` v2 → v3)
**Masalah yang Ditemukan:**
1. **VO berbahasa Inggris & suara robotik:** `System.Speech` SAPI5 bawaan Windows hanya punya `Microsoft David (en-US)`, sehingga VO terdengar seperti robot dan tidak memakai bahasa Indonesia sesuai naskah layar.
2. **Mulut narator vertikal & sudut kubus SE terbalik:** `capsuleGeometry` default vertikal menyebabkan mulut terlihat vertikal di wajah karakter, dan rotasi kubus outro menampilkan huruf yang terpisah.
3. **Logo SE Lab & font masih terlalu kecil:** Watermark `@se.lab.filkom`, pill 3 logo outro, wordmark `Days One`, dan subtitle perlu ukuran lebih besar agar terbaca nyaman di layar HP.

**Aturan Permanen (Berlaku Mulai v3 & Semua Konten Selanjutnya):**
- **VO Wajib Bahasa Indonesia Natural & Sesuai Naskah Layar:** Gunakan **`msedge-tts` (`id-ID-ArdiNeural` Male)** lewat [generate-vo-id.mjs](../video-studio/scripts/generate-vo-id.mjs) (`npm run gen:vo`), **BUKAN** robot SAPI5 `en-US`. Naskah audio harus selaras dengan teks layar berbahasa Indonesia.
- **Ukuran Logo & Tipografi Jelas di Layar Mobile (1080×1920):**
  - Watermark pill minimal ikon `40×44px` + teks `28px`.
  - Institutional Pill Outro minimal logo `60–68px`.
  - Wordmark Outro `Days One` minimal `40px`, subtitle utama minimal `33px`, footer strip teks `30px`.
- **Cek Visual Wajib Sebelum Finalisasi:** Selalu render dan inspeksi minimal 4 *still frame* (`babak1`, `babak2`, `step`, `outro`) untuk memastikan proporsi karakter, orientasi relief logo 3D (`S` di kiri, `E` di kanan), dan skala teks/logo sudah aman.

---

## Log Audit #3 — Bahasa Istilah & Outro Interaktif (`ApaItuRpl3D` v3 → v4)
**Masalah yang Ditemukan:**
1. Istilah `"Requirements"` terdengar janggal/aneh saat digabung dalam narasi VO & badge bahasa Indonesia.
2. Outro belum mengajak audiens berinteraksi langsung (sekadar ajakan *save/follow* pasif).

**Aturan Permanen (Berlaku Mulai v4 & Semua Konten Selanjutnya):**
- **Natural Indonesian Terminology:** Gunakan istilah berbahasa Indonesia yang natural untuk konsep yang diucapkan VO (contoh: *Requirements* → **Analisis Kebutuhan**), hindari kata asing yang terasa kaku saat dilafalkan TTS Indonesia.
- **Interactive Closing CTA:** Bagian Outro wajib menyertakan ajakan interaktif (contoh: ajak audiens *drop* di kolom komentar untuk memilih topik episode berikutnya) dengan visual *callout pill* yang menonjol.

---

## Log Audit #4 — Pustaka SFX & BGM Reusable (`audioKit.ts` + `SceneAudioBed`)
**Kebutuhan yang Ditambahkan:**
Konten 3D membutuhkan *sound design* (BGM & SFX) yang konsisten, bebas klaim hak cipta Instagram, dan bisa dipakai ulang untuk seluruh konten berikutnya.

**Aturan Permanen (Berlaku Mulai Sekarang & Semua Konten Selanjutnya):**
- **Gunakan Reusable Audio Kit (`src/audio/audioKit.ts` + `SceneAudioBed`):**
  - **BGM Adaptif Tema:** `bgm-tech-light.wav` untuk mode `light` dan `bgm-tech-dark.wav` untuk mode `dark` (100% original hasil sintesis [generate-audio-kit.mjs](../video-studio/scripts/generate-audio-kit.mjs), aman dari klaim hak cipta IG).
  - **Auto-Ducking Wajib:** Volume BGM otomatis turun halus ke `~0.12` saat narator VO aktif dan naik ke `~0.30` saat transisi agar suara narator tetap dominan dan jernih.
  - **SFX Standar:** Gunakan `sfx-pop.wav` untuk kemunculan card, `sfx-whoosh.wav` untuk perpindahan kamera antar babak, `sfx-chime.wav` untuk highlight poin, `sfx-collapse.wav` untuk analogi error/roboh, dan `sfx-outro-sting.wav` pada pembuka Outro.
