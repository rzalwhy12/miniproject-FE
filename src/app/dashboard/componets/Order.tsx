'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import Image from 'next/image';
import { showError } from '@/helper/interceptor';
import { apiCall } from '@/helper/apiCall';
import { toast } from 'sonner';

interface TicketInfo {
  ticketTypeId: number;
  ticketTypeName: string;
  quantity: number;
  subTotal: number;
}

interface OrderItem {
  id: number;
  transactionCode: string;
  buyer: {
    id: number;
    name: string;
    email: string;
  };
  event: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
  };
  orderDate: string;
  ticketList: TicketInfo[];
  totalPrice: number;
  paymentProof: string;
  status: 'WAITING_CONFIRMATION' | 'DONE' | 'REJECTED';
}

const Order = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const getOrderList = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await apiCall.get('/transaction/order-list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.result.data);
    } catch (error) {
      showError(error);
    }
  };

  const handleStatusUpdate = async (
    transactionId: number,
    status: 'DONE' | 'REJECTED'
  ) => {
    const token = localStorage.getItem('token');
    try {
      setLoadingId(transactionId);
      await apiCall.patch(
        `/transaction/confirmation/${transactionId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      toast(`Transaksi berhasil di-${status === 'DONE' ? 'terima' : 'tolak'}`);

      await getOrderList();
    } catch (error) {
      showError(error);
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    getOrderList();
  }, []);

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Konfirmasi Order</h2>

          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Tidak ada order yang menunggu konfirmasi.
            </p>
          ) : (
            <Table>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Pembeli</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Tiket</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Bukti</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={order.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{order.event.name}</TableCell>
                    <TableCell>{order.buyer.name}</TableCell>
                    <TableCell>
                      {format(new Date(order.orderDate), 'dd MMM yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      {order.ticketList.map((ticket, i) => (
                        <div key={i}>
                          {ticket.ticketTypeName} x {ticket.quantity}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      Rp {order.totalPrice.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>
                      <div
                        className="w-20 h-12 overflow-hidden border rounded cursor-pointer hover:opacity-80"
                        onClick={() => {
                          setSelectedImage(order.paymentProof);
                          setIsModalOpen(true);
                        }}
                      >
                        <Image
                          src={order.paymentProof}
                          alt="Bukti Transfer"
                          width={80}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={loadingId === order.id}
                        onClick={() => handleStatusUpdate(order.id, 'DONE')}
                      >
                        {loadingId === order.id ? 'Processing...' : 'Accept'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={loadingId === order.id}
                        onClick={() => handleStatusUpdate(order.id, 'REJECTED')}
                      >
                        {loadingId === order.id ? 'Processing...' : 'Reject'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal Preview Bukti Transfer */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl p-6 space-y-4">
          <DialogTitle className="text-lg text-center">
            Bukti Transfer
          </DialogTitle>

          {selectedImage && (
            <div className="w-full max-h-[80vh] overflow-auto rounded border">
              <Image
                src={selectedImage}
                alt="Bukti Transfer"
                width={1000}
                height={800}
                className="w-full h-auto object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Order;
