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
  statusEvent: string;
  category: string;
  syaratKetentuan: string;
  image: File | null;
  vouchers?: Voucher[];
}

export interface Ticket {
  id: number;
  name: string;
  price: string;
  description: string;
}

export interface StatusOption {
  value: string;
  label: string;
}

export interface CategoryOption {
  value: string;
  label: string;
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
