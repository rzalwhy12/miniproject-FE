'use client';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Percent } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hook';
import {
  addVoucher,
  removeVoucher,
  updateVoucher
} from '@/lib/redux/features/createEvenSlice';
const VoucherSection: React.FC = () => {
  const { vouchers } = useAppSelector((state) => state.createEvent);
  const dispatch = useAppDispatch();

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl mt-8">
      <CardContent className="p-4 sm:p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-lg flex items-center justify-center mr-3">
              <Percent className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Voucher</h3>
          </div>
          <Button
            type="button"
            onClick={() => dispatch(addVoucher())}
            className="bg-gradient-to-r from-pink-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white border-0 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Voucher
          </Button>
        </div>
        {vouchers.length === 0 && (
          <div className="text-gray-400 text-sm">Belum ada voucher.</div>
        )}
        {vouchers.map((voucher, idx) => (
          <div key={idx} className="relative mb-6 last:mb-0">
            <div className="bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 hover:border-pink-300 transition-all duration-300 shadow-sm">
              {/* Voucher Number Badge */}
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {idx + 1}
              </div>
              <button
                type="button"
                onClick={() => dispatch(removeVoucher(idx))}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Hapus Voucher"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {/* Discount */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700 font-medium">
                    Discount (%)
                  </Label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={voucher.discount}
                    onChange={(e) =>
                      dispatch(
                        updateVoucher({
                          index: idx,
                          field: 'discount',
                          value: Number(e.target.value)
                        })
                      )
                    }
                    className="bg-white/90 border-gray-300 text-gray-800 placeholder:text-gray-500 focus:border-pink-500 focus:ring-pink-500/20 w-full rounded px-2 py-1"
                    placeholder="20"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700 font-medium">
                    Start Date
                  </Label>
                  <input
                    type="date"
                    value={voucher.startDate?.slice(0, 10) || ''}
                    onChange={(e) =>
                      dispatch(
                        updateVoucher({
                          index: idx,
                          field: 'startDate',
                          value: e.target.value
                        })
                      )
                    }
                    className="bg-white/90 border-gray-300 text-gray-800 focus:border-pink-500 focus:ring-pink-500/20 w-full rounded px-2 py-1"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-700 font-medium">
                    End Date
                  </Label>
                  <input
                    type="date"
                    value={voucher.endDate?.slice(0, 10) || ''}
                    onChange={(e) =>
                      dispatch(
                        updateVoucher({
                          index: idx,
                          field: 'endDate',
                          value: e.target.value
                        })
                      )
                    }
                    className="bg-white/90 border-gray-300 text-gray-800 focus:border-pink-500 focus:ring-pink-500/20 w-full rounded px-2 py-1"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default VoucherSection;
