// Types untuk Event Creation
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
