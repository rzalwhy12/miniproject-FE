import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Ticket {
  id: number;
  name: string;
  price: number;
  quota: number;
  descriptionTicket: string;
  benefit: string;
}

export interface Voucher {
  discount: number;
  startDate: string;
  endDate: string;
}

export interface EditEventState {
  eventId: number | null;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  description: string;
  syaratKetentuan: string;
  imageUrl: string;
  tickets: Ticket[];
  vouchers: Voucher[];
  loading: boolean;
  message: string;
}

const initialState: EditEventState = {
  eventId: null,
  name: '',
  startDate: '',
  endDate: '',
  location: '',
  category: '',
  description: '',
  syaratKetentuan: '',
  imageUrl: '',
  tickets: [],
  vouchers: [],
  loading: false,
  message: ''
};

const editEventSlice = createSlice({
  name: 'editEvent',
  initialState,
  reducers: {
    setEditEventForm: (
      state,
      action: PayloadAction<Partial<EditEventState>>
    ) => {
      Object.assign(state, action.payload);
    },
    resetEditEventForm: () => initialState,
    updateEditTicket: (
      state,
      action: PayloadAction<{
        id: number;
        field: keyof Ticket;
        value: string | number;
      }>
    ) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.id);
      if (ticket) {
        ticket[action.payload.field] = action.payload.value as never;
      }
    },
    updateEditVoucher: (
      state,
      action: PayloadAction<{
        index: number;
        field: keyof Voucher;
        value: string | number;
      }>
    ) => {
      const voucher = state.vouchers[action.payload.index];
      if (voucher) {
        voucher[action.payload.field] = action.payload.value as never;
      }
    },
    addEditTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets.push(action.payload);
    },
    removeEditTicket: (state, action: PayloadAction<number>) => {
      state.tickets = state.tickets.filter(
        (ticket) => ticket.id !== action.payload
      );
    },
    addEditVoucher: (state, action: PayloadAction<Voucher>) => {
      state.vouchers.push(action.payload);
    },
    removeEditVoucher: (state, action: PayloadAction<number>) => {
      state.vouchers.splice(action.payload, 1);
    },
    setEditEventLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setEditEventMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
    updateEditEventField: (
      state,
      action: PayloadAction<{
        field: keyof Omit<
          EditEventState,
          'tickets' | 'vouchers' | 'loading' | 'message'
        >;
        value: string | number | null;
      }>
    ) => {
      const { field, value } = action.payload;
      (state as any)[field] = value;
    }
  }
});

export const {
  setEditEventForm,
  resetEditEventForm,
  updateEditTicket,
  updateEditVoucher,
  addEditTicket,
  removeEditTicket,
  addEditVoucher,
  removeEditVoucher,
  setEditEventLoading,
  setEditEventMessage,
  updateEditEventField
} = editEventSlice.actions;

export default editEventSlice.reducer;
