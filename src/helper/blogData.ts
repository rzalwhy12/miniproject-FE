// Simple local blog data source. Replace with API calls when backend is ready.

export interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    content: string[]; // paragraphs
    date: string; // ISO
    author: string;
    tags: string[];
    coverImage: string; // public path
}

export const blogPosts: BlogPost[] = [
    {
        id: 1,
        slug: 'tips-beli-tiket-konser-aman',
        title: '5 Tips Beli Tiket Konser Secara Aman',
        excerpt: 'Hindari penipuan dan pastikan pengalaman nonton konsermu lancar dengan 5 tips praktis ini.',
        content: [
            'Membeli tiket konser bisa jadi tricky, terutama jika hype sedang tinggi. Pastikan kamu selalu membeli dari platform resmi dan menghindari tautan mencurigakan.',
            'Gunakan metode pembayaran yang memiliki proteksi, simpan bukti transaksi, dan cek ulang detail event seperti tanggal, lokasi, dan ketentuan refund.',
            'Jika tiket berbentuk e-ticket, jangan bagikan QR code ke media sosial. Simpan hanya untuk penggunaan pribadi saat check-in.',
        ],
        date: '2025-08-10T09:00:00.000Z',
        author: 'Loka Adicara Team',
        tags: ['Tips', 'Konser', 'Ticketing'],
        coverImage: '/images/banner/1.png',
    },
    {
        id: 2,
        slug: 'panduan-event-organizer-pemula',
        title: 'Panduan Singkat untuk Event Organizer Pemula',
        excerpt: 'Mulai dari perencanaan hingga eksekusi—panduan ringkas agar event pertamamu berjalan mulus.',
        content: [
            'Langkah awal yang penting adalah menentukan tujuan event dan target audiens. Dari sini, susun anggaran, timeline, dan daftar kebutuhan.',
            'Jangan lupakan perizinan, keamanan, dan manajemen risiko. Manfaatkan tools digital untuk ticketing, check-in, dan reporting.',
            'Setelah event selesai, lakukan evaluasi untuk mengukur kesuksesan dan pembelajaran ke depannya.',
        ],
        date: '2025-08-15T10:30:00.000Z',
        author: 'Event Ops',
        tags: ['Organizer', 'Panduan'],
        coverImage: '/images/banner/2.png',
    },
    {
        id: 3,
        slug: 'tren-konser-2025',
        title: 'Tren Konser 2025: Intim tapi Immersive',
        excerpt: 'Konser skala kecil dengan pengalaman imersif semakin digemari—ini alasan dan dampaknya untuk industri.',
        content: [
            'Dengan teknologi AR/VR yang makin terjangkau, banyak promotor mulai bereksperimen menghadirkan pengalaman baru.',
            'Venue berkapasitas terbatas memberikan kedekatan yang sulit ditandingi oleh stadion raksasa, meningkatkan engagement penggemar.',
            'Brand activation kini lebih kreatif, memadukan instalasi interaktif dan konten UGC untuk memperluas jangkauan.',
        ],
        date: '2025-08-20T14:00:00.000Z',
        author: 'Editorial',
        tags: ['Tren', 'Industri'],
        coverImage: '/images/banner/3.png',
    },
];
