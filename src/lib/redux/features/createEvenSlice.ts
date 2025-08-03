import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
export interface Ticket {
  id: string;
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

export interface EventFormState {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  description: string;
  syaratKetentuan: string;
  image: File | null;
  tickets: Ticket[];
  vouchers: Voucher[];
  loading: boolean;
  message: string;
}

const initialState: EventFormState = {
  name: '',
  startDate: '',
  endDate: '',
  location: '',
  category: '',
  description: '',
  syaratKetentuan: '',
  image: null,
  tickets: [],
  vouchers: [],
  loading: false,
  message: ''
};

const eventFormSlice = createSlice({
  name: 'createEvent',
  initialState,
  reducers: {
    createEventForm: (
      state,
      action: PayloadAction<Partial<EventFormState>>
    ) => {
      Object.assign(state, action.payload);
    },
    resetEventForm: () => initialState,

    addTicket: (state) => {
      state.tickets.push({
        id: nanoid(),
        name: '',
        price: 20000,
        quota: 1,
        descriptionTicket: '',
        benefit: ''
      });
    },
    updateTicket: (
      state,
      action: PayloadAction<{
        id: string;
        field: keyof Ticket;
        value: string | number;
      }>
    ) => {
      const ticket = state.tickets.find((t) => t.id === action.payload.id);
      if (ticket) {
        ticket[action.payload.field] = action.payload.value as never;
      }
    },
    removeTicketById: (state, action: PayloadAction<string>) => {
      state.tickets = state.tickets.filter((t) => t.id !== action.payload);
    },

    addVoucher: (state) => {
      state.vouchers.push({
        discount: 0,
        startDate: '',
        endDate: ''
      });
    },
    updateVoucher: (
      state,
      action: PayloadAction<{
        index: number;
        field: keyof Voucher;
        value: string | number;
      }>
    ) => {
      const { index, field, value } = action.payload;
      if (state.vouchers[index]) {
        state.vouchers[index][field] = value as never;
      }
    },
    removeVoucher: (state, action: PayloadAction<number>) => {
      state.vouchers.splice(action.payload, 1);
    }
  }
});

export const {
  createEventForm,
  resetEventForm,
  addTicket,
  updateTicket,
  removeTicketById,
  addVoucher,
  updateVoucher,
  removeVoucher
} = eventFormSlice.actions;

export default eventFormSlice.reducer;
