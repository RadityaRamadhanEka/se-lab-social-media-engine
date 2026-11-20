import {z} from 'zod';

export const StoryStepSchema = z.object({
  badge: z.string(),
  title: z.string(),
  subtitle: z.string(),
});

export const ApaItuRplPropsSchema = z.object({
  id: z.string(),
  theme: z.enum(['light', 'dark']),
  hookPrefix: z.string(),
  hookHighlight: z.string(),
  hookSuffix: z.string(),
  hookSubtitle: z.string(),
  analogyTitle: z.string(),
  analogySubtitle: z.string(),
  steps: z.array(StoryStepSchema).length(4),
  outroTagline: z.string(),
  outroCta: z.string(),
});

export type ApaItuRplProps = z.infer<typeof ApaItuRplPropsSchema>;

export const DEFAULT_APA_ITU_RPL_PROPS: ApaItuRplProps = {
  id: 'RPL-001',
  theme: 'light',
  hookPrefix: 'RPL = Cuma',
  hookHighlight: 'Ngoding',
  hookSuffix: 'Doang?',
  hookSubtitle: 'Banyak yang mengira Software Engineering itu cuma soal nulis baris kode.',
  analogyTitle: 'Koding vs Rekayasa',
  analogySubtitle:
    'Nulis kode tanpa rancangan itu seperti menumpuk bata tanpa cetak biru: cepat tinggi, tapi rawan roboh.',
  steps: [
    {
      badge: '01 · ANALISIS KEBUTUHAN',
      title: 'Pahami Masalah & Cetak Biru',
      subtitle: 'Software Engineer mulai dari kebutuhan user dan desain sistem sebelum menyentuh editor kode.',
    },
    {
      badge: '02 · ARSITEKTUR',
      title: 'Bangun Struktur Modular',
      subtitle: 'Kode disusun rapi per komponen agar tim bisa berkolaborasi dan mudah dikembangkan.',
    },
    {
      badge: '03 · QUALITY & TESTING',
      title: 'Uji Sebelum Rilis',
      subtitle: 'Setiap fitur dipindai dan diuji otomatis agar aman dari bug saat dipakai ribuan pengguna.',
    },
    {
      badge: '04 · DEPLOY & EVOLUSI',
      title: 'Rilis, Pantau, & Iterasi',
      subtitle: 'Software terus dirawat, diukur performanya, dan berevolusi mengikuti kebutuhan nyata.',
    },
  ],
  outroTagline: 'Beyond Coding: Building the Right Software.',
  outroCta: 'Drop di komen! Mau kita bahas topik RPL apa lagi selanjutnya?',
};
