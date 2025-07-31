import { EventForm, Ticket } from "@/types/event";

interface User {
    id: number;
    name: string;
    email?: string;
}

export const submitEvent = async (
    form: EventForm,
    tickets: Ticket[],
    user: User | null,
    setLoading: (loading: boolean) => void,
    setMessage: (message: string) => void,
    resetForm: () => void
) => {
    setLoading(true);
    setMessage("");

    try {
        // Validasi required fields
        if (!form.name || !form.description || !form.location || !form.startDate || !form.endDate) {
            setMessage("Mohon isi semua field yang wajib diisi!");
            setLoading(false);
            return;
        }

        // Validasi tanggal
        const startDate = new Date(form.startDate);
        const endDate = new Date(form.endDate);

        if (startDate >= endDate) {
            setMessage("Tanggal selesai harus setelah tanggal mulai!");
            setLoading(false);
            return;
        }

        // Validasi tickets
        if (tickets.length === 0) {
            setMessage("Minimal harus ada satu jenis tiket!");
            setLoading(false);
            return;
        }

        // Validasi setiap ticket
        for (const ticket of tickets) {
            if (!ticket.name.trim()) {
                setMessage("Nama tiket tidak boleh kosong!");
                setLoading(false);
                return;
            }
            if (!ticket.price || parseFloat(ticket.price) < 0) {
                setMessage("Harga tiket harus valid dan tidak boleh negatif!");
                setLoading(false);
                return;
            }
        }

        // Format tanggal untuk backend (ISO string)
        const formattedStartDate = startDate.toISOString();
        const formattedEndDate = endDate.toISOString();

        // Buat FormData untuk mengirim file dan data
        const formData = new FormData();

        // Tambahkan data event
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('startDate', formattedStartDate);
        formData.append('endDate', formattedEndDate);
        formData.append('location', form.location);
        formData.append('statusEvent', form.statusEvent);
        formData.append('category', form.category);
        formData.append('organizerId', user?.id?.toString() || '1'); // Use actual user ID or default
        formData.append('syaratKetentuan', form.syaratKetentuan);

        // Tambahkan ticket types sebagai JSON string
        formData.append('ticketTypes', JSON.stringify(tickets));

        // Tambahkan file image jika ada
        if (form.image) {
            formData.append('image', form.image);
            console.log('Image file added:', form.image.name, form.image.size);
        }

        console.log('Sending FormData with image:', form.image ? 'Yes' : 'No');

        // Get auth token from localStorage or context
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');

        if (!token) {
            setMessage("Anda harus login terlebih dahulu!");
            setLoading(false);
            return;
        }

        if (!user) {
            setMessage("Data user tidak ditemukan. Silakan login kembali!");
            setLoading(false);
            return;
        }

        const backendUrl = process.env.NEXT_PUBLIC_URL_DATABASE || 'http://localhost:4004';
        const endpoint = `${backendUrl}/events/create`;

        try {
            console.log(`Sending request to: ${endpoint}`);
            console.log('FormData contents:', {
                name: form.name,
                description: form.description,
                location: form.location,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                statusEvent: form.statusEvent,
                category: form.category,
                syaratKetentuan: form.syaratKetentuan,
                ticketTypes: tickets.length,
                hasImage: !!form.image
            });

            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Don't set Content-Type for FormData, let browser handle it
                },
                body: formData,
            });

            console.log(`Response status: ${res.status}`);

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`HTTP ${res.status}: ${errorText}`);

                if (res.status === 401) {
                    setMessage("Token tidak valid. Silakan login kembali!");
                    // Optionally redirect to login
                    localStorage.removeItem('token');
                    localStorage.removeItem('authToken');
                } else if (res.status === 404) {
                    setMessage("Endpoint tidak ditemukan. Pastikan backend server berjalan!");
                } else {
                    setMessage(`Error ${res.status}: ${errorText}`);
                }
                return;
            }

            const result = await res.json();
            console.log('Response data:', result);

            // Check for success in different response formats
            if (result.success || result.result?.success || res.status === 201) {
                setMessage("Event berhasil dibuat!");
                resetForm();
            } else {
                setMessage(result.message || result.result?.message || "Gagal membuat event");
            }

        } catch (error: any) {
            console.error('Network error:', error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                setMessage("Tidak dapat terhubung ke server. Pastikan backend server berjalan di " + backendUrl);
            } else {
                setMessage("Terjadi kesalahan jaringan: " + error.message);
            }
        }
    } catch (err) {
        console.error('Error:', err);
        setMessage("Terjadi kesalahan saat menghubungi server.");
    }
    setLoading(false);
};
