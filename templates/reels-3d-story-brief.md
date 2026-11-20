# Template Content Brief & 3D Storyboard (Reels `@se.lab.filkom`)

Gunakan template ini saat mengisi Google Docs Brief atau menyusun alur cerita video edukasi 3D sebelum dirender di **Remotion (`@remotion/three`)**.

---

## Bagian A — Brief Ringkas (Diisi Content Owner)

- **ID Konten:** `RPL-___`
- **Judul Topik:** 
- **Content Pillar:** `P1 Tech Bites` / `P2 Lab Life` / `P3 Showcase` / `P4 Info`
- **PIC Content Owner:** `Raditya` / `Bagas` / `Hanifah` / `Lidia` / `Aurel`
- **Target Tanggal Tayang:** `YYYY-MM-DD`
- **Tema Panggung 3D:** `light` (Clean Lab Stage) / `dark` (Deep Tech Stage)

### 1. Hook (0–3 Detik)
- **Teks di Layar (Maks. 6 kata + 1 Highlight Pill):**  
  Contoh: `Kenapa [API] Sering Lemot?` *(kata dalam `[...]` pakai pill `#00024f`)*
- **Visual 3D Pembuka:**  
  Contoh: *Kamera zoom-in ke 3D Laptop mengirim puluhan kubus paket oranye menumpuk di depan pintu Server.*

### 2. Alur Cerita 3D (Babak 1 → 3)
*(Fokus menjelaskan konsep secara visual spasial, bukan sekadar teks jalan!)*

- **Babak 1 — Masalah / Analogi Nyata (Detik 3–12):**
  - *Narasi / Subtitle:* 
  - *Aksi Objek 3D & Gerak Kamera:* 
- **Babak 2 — Cara Kerja di Balik Layar (Detik 12–28):**
  - *Narasi / Subtitle:* 
  - *Aksi Objek 3D & Gerak Kamera:* 
- **Babak 3 — Solusi / Kesimpulan Kunci (Detik 28–40):**
  - *Narasi / Subtitle:* 
  - *Aksi Objek 3D & Gerak Kamera:* 

### 3. Outro & CTA (3 Detik Terakhir — Otomatis oleh Remotion)
- **Teks CTA:** Contoh: `Save biar nggak lupa! Follow @se.lab.filkom`
- **Visual Outro:** Otomatis menampilkan **3 Logo Lengkap (UB + FILKOM + SE Lab)** + kubus 3D SE + `SOFTWARE ENGINEERING LABORATORY`.

### 4. Caption & Hashtag
```text
[Paragraf 1: Hook singkat / pertanyaan pemantik diskusi]

[Paragraf 2: Ringkasan 2-3 poin penting dari video]

Menurut kalian paling sering ketemu kasus ini pas ngerjain matkul apa? Tulis di komentar!

#selab #selabfilkom #filkomub #softwareengineering #rpl #ngoding #mahasiswaIT
```

---

## Bagian B — Struktur JSON `inputProps` (Untuk Remotion 3D Engine)

Format inilah yang diekspor otomatis dari Google Sheets (`Code.gs`) atau di-generate AI di Fase 2 untuk langsung dirender Remotion:

```json
{
  "id": "RPL-001",
  "theme": "dark",
  "pillar": "P1",
  "title": "Kenapa API Bisa Lemot?",
  "highlightWord": "API",
  "ctaText": "Save postingan ini & follow @se.lab.filkom!",
  "scenes": [
    {
      "step": 1,
      "label": "Masalah",
      "headline": "Request Menumpuk",
      "subtitle": "Bayangkan 1000 user minta data sekaligus tanpa antrean atau cache.",
      "cameraPreset": "front-isometric",
      "focusObject": "traffic-jam-packets",
      "durationInSeconds": 9
    },
    {
      "step": 2,
      "label": "Mekanisme",
      "headline": "Tanpa Cache vs Pakai Cache",
      "subtitle": "Server harus bolak-balik ke Database setiap kali ada request yang sama.",
      "cameraPreset": "pan-right-close",
      "focusObject": "server-to-database-loop",
      "durationInSeconds": 14
    },
    {
      "step": 3,
      "label": "Solusi",
      "headline": "Caching Layer",
      "subtitle": "Dengan cache memory di depan server, respon turun dari detik ke milidetik.",
      "cameraPreset": "orbit-overview",
      "focusObject": "cache-shield-fast-route",
      "durationInSeconds": 11
    }
  ]
}
```
