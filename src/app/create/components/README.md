# Create Event Components

Folder ini berisi komponen-komponen yang dipecah dari halaman Create Event untuk membuat kode lebih modular dan mudah di-maintain.

## Struktur Komponen

### 1. **EventImageUpload.tsx**
Komponen untuk upload gambar event.
- **Props:**
  - `image: File | null` - File gambar yang dipilih
  - `onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void` - Handler untuk perubahan gambar

### 2. **EventBasicInfo.tsx**
Komponen untuk informasi dasar event (nama, tanggal, lokasi, status, kategori).
- **Props:**
  - `form: EventForm` - Data form event
  - `onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void` - Handler untuk perubahan input

### 3. **TicketSection.tsx**
Komponen untuk mengelola tiket event.
- **Props:**
  - `tickets: Ticket[]` - Array tiket
  - `onTicketChange: (id: number, field: string, value: string) => void` - Handler untuk perubahan tiket
  - `onAddTicket: () => void` - Handler untuk menambah tiket
  - `onRemoveTicket: (id: number) => void` - Handler untuk menghapus tiket

### 4. **EventDescription.tsx**
Komponen untuk deskripsi event dan syarat & ketentuan.
- **Props:**
  - `description: string` - Deskripsi event
  - `syaratKetentuan: string` - Syarat dan ketentuan
  - `onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void` - Handler untuk perubahan textarea

### 5. **EventFormActions.tsx**
Komponen untuk tombol aksi dan pesan status.
- **Props:**
  - `loading: boolean` - Status loading
  - `message: string` - Pesan status
  - `onSubmit: (e: React.FormEvent) => void` - Handler untuk submit form

### 6. **BackgroundElements.tsx**
Komponen untuk elemen background animasi.
- **Props:** Tidak ada props (komponen stateless)

## Custom Hook dan Utils

### **useCreateEvent.ts** (di `/src/hooks/`)
Custom hook untuk mengelola state dan logic form create event.
- **Returns:**
  - `form` - State form event
  - `tickets` - State array tiket
  - `loading` - State loading
  - `message` - State pesan
  - `handleChange` - Handler untuk perubahan form
  - `handleTicketChange` - Handler untuk perubahan tiket
  - `addTicket` - Function untuk menambah tiket
  - `removeTicket` - Function untuk menghapus tiket
  - `resetForm` - Function untuk reset form

### **eventSubmission.ts** (di `/src/utils/`)
Utility function untuk submit event ke backend.
- **Parameters:**
  - `form: EventForm` - Data form event
  - `tickets: Ticket[]` - Array tiket
  - `setLoading: (loading: boolean) => void` - Setter untuk loading state
  - `setMessage: (message: string) => void` - Setter untuk message state
  - `resetForm: () => void` - Function untuk reset form

## Types

### **event.ts** (di `/src/types/`)
Type definitions untuk event-related interfaces:
- `EventForm` - Interface untuk form event
- `Ticket` - Interface untuk tiket
- `StatusOption` - Interface untuk opsi status
- `CategoryOption` - Interface untuk opsi kategori

## Cara Penggunaan

```tsx
import {
  EventImageUpload,
  EventBasicInfo,
  TicketSection,
  EventDescription,
  EventFormActions,
  BackgroundElements
} from "@/components/create-event";

// Atau import individual
import EventImageUpload from "@/components/create-event/EventImageUpload";
```

## Keuntungan Refactoring

1. **Modularitas**: Setiap komponen memiliki tanggung jawab yang jelas
2. **Reusability**: Komponen dapat digunakan kembali di tempat lain
3. **Maintainability**: Lebih mudah untuk debug dan update
4. **Testability**: Setiap komponen dapat ditest secara terpisah
5. **Code Organization**: Struktur kode lebih terorganisir
6. **Type Safety**: Menggunakan TypeScript interfaces untuk type safety
