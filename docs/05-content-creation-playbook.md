# 05 — Master Playbook Produksi Konten 3D (`@se.lab.filkom`)

> **UNTUK AI ASSISTANT & TIM SE LAB:** Baca dokumen ini + [02-design-system.md](02-design-system.md) + [AUDIT-LOG.md](AUDIT-LOG.md) **sebelum** membuat naskah, aset 3D, atau komposisi Remotion baru. Dokumen ini merangkum seluruh hasil eksperimen konten pertama (`ApaItuRpl3D`) agar konten berikutnya **langsung jadi rapi tanpa banyak revisi**.

---

## 1. Spesifikasi Baku Setiap Reels Edukasi 3D

| Aspek | Standar Wajib | Referensi File |
| :--- | :--- | :--- |
| **Resolusi & FPS** | `1080 × 1920` (9:16), `30 fps`, renderer `--gl=angle` | [se-lab-tokens.json](../design-tokens/se-lab-tokens.json) |
| **Safe-Zone IG Reels** | `top: 220px`, `bottom: 340px`, `left: 72px`, `right: 140px` | [StoryOverlay.tsx](../video-studio/src/components/ui/StoryOverlay.tsx) |
| **Tema Panggung** | Bergantian adaptif: `light` (*Clean Lab Stage*) atau `dark` (*Deep Tech Stage*) sesuai topik | [theme.ts](../video-studio/src/theme.ts) |
| **Font Lokal (Offline)** | `Plus Jakarta Sans` (judul & body) + `Days One` (wordmark) dari `public/fonts/` | [theme.ts](../video-studio/src/theme.ts) |
| **Voiceover (VO)** | **Wajib Bahasa Indonesia natural**, suara Male `id-ID-ArdiNeural` (`msedge-tts`), sinkron 100% dengan teks layar | [generate-vo-id.mjs](../video-studio/scripts/generate-vo-id.mjs) |
| **Audio Bed & SFX** | **Wajib pakai `<SceneAudioBed />`**: BGM adaptif tema dengan *auto-ducking* (`0.12` saat VO, `0.30` saat jeda) + 5 SFX standar | [SceneAudioBed.tsx](../video-studio/src/components/audio/SceneAudioBed.tsx) |
| **Kualitas 3D** | **High-Poly** (`RoundedBoxGeometry` bevel 6 segmen, `ExtrudeGeometry`, `TubeGeometry` 48 segmen, `48–64` segmen) + `MeshPhysicalMaterial` (`clearcoat`) | [LabProps3D.tsx](../video-studio/src/components/3d/LabProps3D.tsx) |
| **Sosok Narator** | **Wajib ada `NarratorCharacter3D`** dengan *mouth sync* (`isNarratorSpeaking`), kedip mata, dan gestur menunjuk per babak | [NarratorCharacter3D.tsx](../video-studio/src/components/3d/NarratorCharacter3D.tsx) |
| **Branding & Outro** | Layar lega saat cerita (watermark `@se.lab.filkom` jelas: ikon `40×44px`, teks `28px`); **Outro wajib menampilkan 3 Logo Lengkap (UB + FILKOM + SE)** ukuran `60–68px` + wordmark `40px` + **CTA interaktif ajak komentar** | [StoryOverlay.tsx](../video-studio/src/components/ui/StoryOverlay.tsx) |

---

## 2. Aturan Penulisan Naskah & Struktur 4 Babak

Setiap video edukasi 3D memakai struktur **4 Babak** dalam **Bahasa Indonesia yang natural & mengalir**:
1. **Babak 1 — Hook (3–6 detik):** Pertanyaan pancingan atau mitos umum (`6 kata` maksimal + 1 *highlight pill* `#00024f` di mode `light` atau `#f29f47` di mode `dark`).
2. **Babak 2 — Masalah / Analogi Visual (6–8 detik):** Bandingkan kondisi salah vs benar secara spasial 3D (contoh: tumpukan berantakan roboh vs struktur rapi).
3. **Babak 3 — Inti Materi (3–4 Poin / Stasiun, ~6–7 detik per poin):**
   - Gunakan istilah **Bahasa Indonesia yang enak didengar** saat diucapkan VO (contoh: gunakan *Analisis Kebutuhan*, hindari kata asing yang terasa janggal saat dilafalkan TTS).
   - Setiap poin punya stasiun/objek 3D tersendiri yang terhubung jalur kabel/paket data.
4. **Babak 4 — Outro Interaktif (~6–10 detik):**
   - Hero Kubus 3D SE Lab berotasi di `-Math.PI / 4` agar huruf **`S`** (kiri) dan **`E`** (kanan) terlihat bersamaan.
   - Tampilkan **3 Logo Lengkap (UB + FILKOM + SE Lab)** + footer strip `#00024f` bertuliskan `se.lab.filkom` (pastikan tidak typo `fiilkom`).
   - **Wajib tutup dengan CTA interaktif** mengajak penonton menulis di kolom komentar (misal memilih topik episode berikutnya).

---

## 3. Aturan Teknis Anti-Bug (Pelajaran dari Eksperimen #1)

1. **Audio-Driven Timeline:** Jangan menebak jumlah frame secara manual! Selalu generate VO lebih dulu agar `vo-manifest.json` menghitung `chapterStartFrame`, `chapterEndFrame`, `audioStartFrame`, dan `totalFrames` otomatis tanpa suara bertabrakan.
2. **Kontrol Kamera R3F:** Selalu gerakkan kamera aktif melalui `useThree((s) => s.camera)` di `<CameraController />`, bukan merender tag `<perspectiveCamera>` terpisah.
3. **Animasi Deterministik Remotion:** Semua animasi 3D wajib dihitung dari `useCurrentFrame()` / `interpolate()` / `spring()`. **Jangan** gunakan `useFrame()` milik R3F.
4. **Orientasi Primitif Mulut Karakter:** `capsuleGeometry` bawaan Three.js berorientasi vertikal—selalu putar `rotation={[0, 0, Math.PI / 2]}` agar mulut narator horizontal.
5. **Kontras Ikon Watermark:** Gunakan `assets/se-logo.png` (berwarna) pada background `light`, dan `assets/se-logo-vector.svg` (putih) pada background `dark` atau footer strip `#00024f`.

---

## 4. Alur Eksekusi Cepat Membuat Konten Baru (6 Langkah)

1. **Ambil Brief dari Google Sheets:** Ambil topik, pillar, tema (`light`/`dark`), dan naskah dari tab `Pipeline_Produksi`.
2. **Siapkan Naskah & Props:** Isi teks layar & teks VO Bahasa Indonesia yang selaras.
3. **Generate VO & Audio Kit:**
   ```powershell
   cd video-studio
   npm run gen:vo          # Generate VO id-ID-ArdiNeural + update vo-manifest.json
   # npm run gen:audio-kit # Jalankan hanya jika butuh regenerasi SFX/BGM
   ```
4. **Rangkai Scene 3D & Audio:** Pasang `<SceneAudioBed />`, `<NarratorCharacter3D />`, objek dari `LabProps3D.tsx`, dan `<StoryOverlay />`.
5. **Pre-Flight QA Wajib (Sebelum Render Final / Review):**
   - Jalankan `npm run typecheck` (`0` error).
   - Render 4 frame perwakilan (`babak1`, `babak2`, `step`, `outro`) dengan `--gl=angle` lalu **inspeksi visual** untuk memastikan tidak ada teks terpotong *safe-zone*, ukuran logo/font jelas, dan objek 3D terbingkai pas.
6. **Preview & Render MP4:**
   - Preview interaktif: `npm run dev` → buka `http://localhost:3000`.
   - Render final: `npx remotion render src/index.ts <CompositionId> out/<nama-file>.mp4 --gl=angle`.
   - Upload hasil MP4 ke folder `03_Final_Output` di Google Drive dan jadwalkan di Meta Business Suite.
