// types.ts

export interface Voucher {
    discount: number;
    startDate: string;
    endDate: string;
}

export interface EventForm {
    name: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    statusEvent: string; // Akan dipetakan ke eventStatus di EventDetail
    category: string;
    syaratKetentuan: string;
    image: File | null;
    vouchers?: Voucher[];
}

export interface Ticket {
  id: number;
  name: string;
  price: string;
  quota: number;
  descriptionTicket: string | null;
  benefit: string | null;
}

export interface StatusOption {
    value: string;
    label: string;
}

export interface CategoryOption {
    value: string;
    label: string;
}

// =========================================================================
// REVISI UNTUK EventDetail agar konsisten dengan Ticket, StatusOption, CategoryOption
// =========================================================================
export interface EventDetail {
    id: number;
    name: string;
    slug: string;
    banner?: string; // Asumsi ini URL banner, bukan File
    description: string | null;
    syaratKetentuan: string | null;
    startDate: string; // ISO 8601 string
    endDate: string;   // ISO 8601 string
    location: string;
    organizer?: string; // Asumsi organizer bisa jadi opsional atau string ID/Name
    ticketTypes: Ticket[]; // Menggunakan interface Ticket yang Anda berikan
    category: string; // Menggunakan string yang sesuai dengan value di CategoryOption
    eventStatus: string; // Menggunakan string yang sesuai dengan value di StatusOption
    vouchers?: Voucher[];
}

export interface Review {
    id: number;
    user: {
        name: string;
        avatar?: string;
    };
    rating: number;
    comment: string;
}

export interface Suggestion {
    id: number;
    slug: string;
    name: string;
    banner: string;
    location: string;
    startDate: string;
}

export const categoryOptions: CategoryOption[] = [
    { value: 'CONFERENCE', label: 'Conference' },
    { value: 'WORKSHOP', label: 'Workshop' },
    { value: 'SEMINAR', label: 'Seminar' },
    { value: 'BOOTCAMP', label: 'Bootcamp' },
    { value: 'COMPETITION', label: 'Competition' },
    { value: 'FESTIVAL', label: 'Festival' },
    { value: 'MUSIC', label: 'Music' },
    { value: 'SPORTS', label: 'Sports' },
    { value: 'TECH', label: 'Tech' },
    { value: 'ART', label: 'Art' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'CHARITY', label: 'Charity' },
    { value: 'LAINNYA', label: 'Lainnya' }
];

export const statusOptions: StatusOption[] = [
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'DRAFT', label: 'Draft' },
    { value: 'CANCELLED', label: 'Cancelled' }
];

