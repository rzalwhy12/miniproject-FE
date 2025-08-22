# Global Loading System Documentation

Sistem loading global ini memungkinkan Anda untuk menampilkan loading screen di seluruh aplikasi dengan mudah. Sistem ini menggunakan Context API dan custom hooks untuk memberikan pengalaman loading yang konsisten.

## Komponen Utama

### 1. GlobalLoadingContext
Context yang menyediakan state loading global dan fungsi untuk mengontrolnya.

### 2. GlobalLoadingOverlay
Komponen overlay yang menampilkan loading screen dengan animasi dan pesan custom.

### 3. useAsyncWithLoading Hook
Custom hook yang memudahkan penggunaan loading untuk operasi async.

## Cara Penggunaan

### 1. Penggunaan Dasar dengan useAsyncWithLoading

```tsx
import { useAsyncWithLoading } from '@/hooks/useAsyncWithLoading';

const MyComponent = () => {
  const { executeWithLoading } = useAsyncWithLoading();

  const handleSubmit = async () => {
    const submitData = async () => {
      // Operasi async Anda di sini
      const response = await apiCall.post('/api/data', data);
      return response;
    };

    await executeWithLoading(submitData, 'Saving data...');
  };

  return (
    <button onClick={handleSubmit}>
      Submit
    </button>
  );
};
```

### 2. Penggunaan dengan Pesan Custom dan Success State

```tsx
import { useAsyncWithLoading } from '@/hooks/useAsyncWithLoading';

const MyComponent = () => {
  const { executeWithCustomLoading } = useAsyncWithLoading();

  const handleLogin = async () => {
    const loginProcess = async () => {
      const response = await apiCall.post('/auth/login', credentials);
      // Process login response
      return response;
    };

    await executeWithCustomLoading(loginProcess, {
      startMessage: 'Signing in...',
      successMessage: 'Login successful!',
      showSuccess: true,
      successDuration: 1500
    });
  };

  return (
    <button onClick={handleLogin}>
      Login
    </button>
  );
};
```

### 3. Kontrol Manual Loading

```tsx
import { useGlobalLoading } from '@/context/GlobalLoadingContext';

const MyComponent = () => {
  const { showLoading, hideLoading, setLoadingMessage } = useGlobalLoading();

  const handleComplexOperation = async () => {
    try {
      showLoading('Initializing...');
      await step1();
      
      setLoadingMessage('Processing data...');
      await step2();
      
      setLoadingMessage('Finalizing...');
      await step3();
      
    } catch (error) {
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  return (
    <button onClick={handleComplexOperation}>
      Complex Operation
    </button>
  );
};
```

### 4. Penggunaan di Page Components

```tsx
import { useAsyncWithLoading } from '@/hooks/useAsyncWithLoading';
import { useEffect } from 'react';

const MyPage = () => {
  const { executeWithLoading } = useAsyncWithLoading();

  useEffect(() => {
    const loadPageData = async () => {
      // Fetch data untuk page
      const data = await apiCall.get('/api/page-data');
      return data;
    };

    executeWithLoading(loadPageData, 'Loading page...');
  }, [executeWithLoading]);

  return (
    <div>
      {/* Page content */}
    </div>
  );
};
```

## Best Practices

### 1. Gunakan executeWithLoading untuk operasi sederhana
```tsx
await executeWithLoading(asyncFunction, 'Loading...');
```

### 2. Gunakan executeWithCustomLoading untuk operasi yang membutuhkan feedback lebih detail
```tsx
await executeWithCustomLoading(asyncFunction, {
  startMessage: 'Processing...',
  successMessage: 'Success!',
  showSuccess: true
});
```

### 3. Gunakan kontrol manual untuk operasi complex dengan multiple steps
```tsx
showLoading('Step 1...');
await step1();
setLoadingMessage('Step 2...');
await step2();
hideLoading();
```

### 4. Selalu handle error dengan proper try-catch
```tsx
try {
  await executeWithLoading(asyncFunction, 'Loading...');
} catch (error) {
  // Handle error
  console.error(error);
}
```

## Contoh Implementasi Lengkap

### Form Submit dengan Loading
```tsx
'use client';
import { useAsyncWithLoading } from '@/hooks/useAsyncWithLoading';
import { apiCall } from '@/helper/apiCall';
import { toast } from 'sonner';

const CreateEventForm = () => {
  const { executeWithCustomLoading } = useAsyncWithLoading();

  const handleSubmit = async (formData: FormData) => {
    try {
      const createEvent = async () => {
        const response = await apiCall.post('/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response;
      };

      await executeWithCustomLoading(createEvent, {
        startMessage: 'Creating event...',
        successMessage: 'Event created successfully!',
        showSuccess: true,
        successDuration: 2000
      });

      toast.success('Event created!');
      // Redirect or reset form
      
    } catch (error) {
      toast.error('Failed to create event');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit">Create Event</button>
    </form>
  );
};
```

### Data Fetching dengan Loading
```tsx
'use client';
import { useAsyncWithLoading } from '@/hooks/useAsyncWithLoading';
import { useEffect, useState } from 'react';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const { executeWithLoading } = useAsyncWithLoading();

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await apiCall.get('/events');
      setEvents(response.data.result.data);
    };

    executeWithLoading(fetchEvents, 'Loading events...');
  }, [executeWithLoading]);

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>{event.name}</div>
      ))}
    </div>
  );
};
```

## API Reference

### useAsyncWithLoading Hook

#### executeWithLoading
```tsx
executeWithLoading<T>(
  asyncFunction: () => Promise<T>,
  loadingMessage?: string
): Promise<T>
```

#### executeWithCustomLoading
```tsx
executeWithCustomLoading<T>(
  asyncFunction: () => Promise<T>,
  options?: {
    startMessage?: string;
    successMessage?: string;
    errorMessage?: string;
    showSuccess?: boolean;
    successDuration?: number;
  }
): Promise<T>
```

### useGlobalLoading Hook

#### showLoading
```tsx
showLoading(message?: string): void
```

#### hideLoading
```tsx
hideLoading(): void
```

#### setLoadingMessage
```tsx
setLoadingMessage(message: string): void
```

## Tips

1. **Performance**: Sistem loading ini sudah dioptimasi untuk performa dengan useCallback dan memoization
2. **Accessibility**: Loading overlay memiliki proper z-index dan blur background
3. **Mobile Responsive**: Loading animation responsive untuk semua ukuran layar
4. **Error Handling**: Selalu gunakan try-catch saat menggunakan loading hooks
5. **User Experience**: Gunakan pesan loading yang descriptive dan relevant dengan aksi yang sedang dilakukan
