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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
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
      <Card className="bg-white/30">
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
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-white/10 transition-colors"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDetailModalOpen(true);
                    }}
                  >
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
                        onClick={(e) => {
                          e.stopPropagation(); // cegah trigger modal detail
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
                    <TableCell className="text-center space-x-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={loadingId === order.id}
                        onClick={(e) => {
                          e.stopPropagation(); // cegah buka detail
                          handleStatusUpdate(order.id, 'DONE');
                        }}
                      >
                        {loadingId === order.id ? 'Processing...' : 'Accept'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={loadingId === order.id}
                        onClick={(e) => {
                          e.stopPropagation(); // cegah buka detail
                          handleStatusUpdate(order.id, 'REJECTED');
                        }}
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

      {/* Modal Detail Transaksi */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-xl p-6 space-y-6">
          <DialogTitle className="text-lg text-center mb-2 font-semibold text-gray-800">
            Detail Transaksi
          </DialogTitle>

          {selectedOrder && (
            <div className="text-sm text-gray-700 space-y-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div>
                  <span className="font-medium">Kode Transaksi:</span>
                  <div className="text-muted-foreground">
                    {selectedOrder.transactionCode}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <div className="capitalize">
                    {selectedOrder.status.toLowerCase()}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Pembeli:</span>
                  <div>{selectedOrder.buyer.name}</div>
                </div>
                <div>
                  <span className="font-medium">Email:</span>
                  <div className="text-muted-foreground">
                    {selectedOrder.buyer.email}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Event:</span>
                  <div>{selectedOrder.event.name}</div>
                </div>
                <div>
                  <span className="font-medium">Tanggal Order:</span>
                  <div>
                    {format(
                      new Date(selectedOrder.orderDate),
                      'dd MMM yyyy HH:mm'
                    )}
                  </div>
                </div>
              </div>

              <div>
                <span className="font-medium">Tiket:</span>
                <ul className="list-disc list-inside text-muted-foreground">
                  {selectedOrder.ticketList.map((ticket, i) => (
                    <li key={i}>
                      {ticket.ticketTypeName} x {ticket.quantity} — Rp{' '}
                      {ticket.subTotal.toLocaleString('id-ID')}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-medium">Total Harga:</span>
                <div className="text-primary font-bold text-base">
                  Rp {selectedOrder.totalPrice.toLocaleString('id-ID')}
                </div>
              </div>

              <div>
                <span className="font-medium">Bukti Pembayaran:</span>
                <div className="mt-2 rounded border overflow-hidden w-[300px] h-[180px]">
                  <Image
                    src={selectedOrder.paymentProof}
                    alt="Bukti Transfer"
                    width={300}
                    height={180}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Bukti Transfer */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={() => setSelectedImage(null)}
      >
        <DialogContent className="max-w-md p-4">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Bukti Transfer"
              width={500}
              height={300}
              className="rounded w-full h-auto object-cover"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Order;
