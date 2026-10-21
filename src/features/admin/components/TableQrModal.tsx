import React, { useRef } from 'react';
import { RestaurantTable } from '../../../types';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Download, Sparkles, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRestaurant } from '../../../context/RestaurantContext';

interface TableQrModalProps {
  table: RestaurantTable | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TableQrModal: React.FC<TableQrModalProps> = ({ table, isOpen, onClose }) => {
  const { settings } = useRestaurant();
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !table) return null;

  // The actual dine-in URL that the QR code points to
  const origin = window.location.origin;
  const targetUrl = `${origin}/menu/${table.code}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-stone-900 border border-stone-800 text-stone-100 rounded-3xl shadow-2xl p-6 z-10 flex flex-col items-center"
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                Table QR Badge • {table.code}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Printable Card Preview (Physical table tent layout) */}
          <div
            ref={printRef}
            className="w-full max-w-xs p-6 rounded-3xl bg-[#FAF8F5] text-stone-900 border-2 border-[#132E22] shadow-xl text-center flex flex-col items-center my-2"
          >
            {/* Header Brand */}
            <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-800 mb-1">
              {settings.name}
            </span>
            <h4 className="text-xl font-serif font-black text-stone-900 tracking-tight">
              TABLE {table.tableNumber}
            </h4>
            <span className="text-xs text-stone-500 font-medium mb-4">
              {table.section} • Capacity {table.capacity}
            </span>

            {/* QR Code Container */}
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200/90 shadow-inner inline-block mb-3">
              <QRCodeSVG
                value={targetUrl}
                size={180}
                level="H"
                fgColor="#132E22"
                bgColor="#FFFFFF"
              />
            </div>

            {/* Instructions */}
            <p className="text-xs font-bold text-stone-800 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Scan to browse menu & order</span>
            </p>
            <span className="text-[10px] text-stone-400 block mt-1 font-mono break-all">
              {targetUrl}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="w-full mt-5 flex items-center justify-between gap-3 pt-3 border-t border-stone-800">
            <a
              href={`/menu/${table.code}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
            >
              Open Menu Link ↗
            </a>

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Table Badge</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
