import React, { useState } from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { RestaurantTable } from '../../../types';
import { TableQrModal } from '../components/TableQrModal';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Plus, 
  Grid3X3, 
  QrCode, 
  Printer, 
  Trash2, 
  Edit3, 
  ExternalLink,
  Users,
  CheckCircle2,
  X
} from 'lucide-react';

export const AdminTablesPage: React.FC = () => {
  const { tables, addTable, updateTable, deleteTable, settings } = useRestaurant();

  const [selectedTableForQr, setSelectedTableForQr] = useState<RestaurantTable | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrintSheet, setShowPrintSheet] = useState(false);

  // Form state
  const [tableNumber, setTableNumber] = useState('');
  const [code, setCode] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [section, setSection] = useState<'Main Dining' | 'Terrace Garden' | 'Private Lounge' | 'Bar Area'>('Main Dining');

  const handleOpenAdd = () => {
    const nextNum = (tables.length + 1).toString().padStart(2, '0');
    setTableNumber(nextNum);
    setCode(`T-${nextNum}`);
    setCapacity(4);
    setSection('Main Dining');
    setShowAddModal(true);
  };

  const handleSaveNewTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableNumber.trim() || !code.trim()) return;

    addTable({
      tableNumber: tableNumber.trim(),
      code: code.trim().toUpperCase(),
      capacity: Number(capacity) || 4,
      section,
      status: 'available',
    });

    setShowAddModal(false);
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800 no-print">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Dining Tables & QR Code Badges
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Generate contact-free QR codes, preview table tent cards, and manage dining room seating.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrintSheet(!showPrintSheet)}
            className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>{showPrintSheet ? 'Back to Table Grid' : 'Printable QR Badges'}</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Table</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet View */}
      {showPrintSheet ? (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs text-stone-300 no-print">
            <span>
              <strong>Print-Ready Layout:</strong> Displays all table tent cards formatted for printing.
            </span>
            <button
              onClick={handleTriggerPrint}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold flex items-center gap-1.5 shadow-md hover:bg-emerald-500"
            >
              <Printer className="w-4 h-4" />
              <span>Print All Table Cards</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tables.map(tbl => {
              const url = `${window.location.origin}/menu/${tbl.code}`;
              return (
                <div
                  key={tbl.id}
                  className="p-6 rounded-3xl bg-white text-stone-900 border-2 border-stone-900 shadow-md text-center flex flex-col items-center print-page-break"
                >
                  <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-800 mb-1">
                    {settings.name}
                  </span>
                  <h3 className="text-2xl font-serif font-black tracking-tight text-stone-950">
                    TABLE {tbl.tableNumber}
                  </h3>
                  <span className="text-xs text-stone-500 font-medium mb-3">
                    {tbl.section} • Capacity {tbl.capacity}
                  </span>

                  <div className="p-3 bg-white border border-stone-200 rounded-2xl shadow-inner mb-3">
                    <QRCodeSVG
                      value={url}
                      size={150}
                      level="H"
                      fgColor="#132E22"
                      bgColor="#FFFFFF"
                    />
                  </div>

                  <p className="text-xs font-bold text-stone-800">
                    Scan with Phone Camera to Order
                  </p>
                  <span className="text-[10px] text-stone-400 font-mono mt-0.5">
                    Code: {tbl.code}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Regular Management Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 no-print">
          {tables.map(table => {
            const isOccupied = table.status === 'occupied';

            return (
              <div
                key={table.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isOccupied
                    ? 'bg-stone-900/90 border-amber-600/60 shadow-xs'
                    : 'bg-stone-900/90 border-stone-800'
                }`}
              >
                <div>
                  {/* Top table header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center font-serif font-bold text-lg text-emerald-400">
                        {table.tableNumber}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">
                          Table {table.tableNumber}
                        </h3>
                        <span className="text-[11px] font-mono text-stone-400">
                          {table.code}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        isOccupied
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : table.status === 'reserved'
                          ? 'bg-indigo-950 text-indigo-400 border border-indigo-800'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      }`}
                    >
                      {table.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-stone-400 py-2 border-y border-stone-800/80">
                    <div className="flex justify-between">
                      <span>Dining Section</span>
                      <span className="text-stone-200 font-medium">{table.section}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seating Capacity</span>
                      <span className="text-stone-200 font-medium">{table.capacity} Guests</span>
                    </div>
                  </div>
                </div>

                {/* Table Actions */}
                <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedTableForQr(table)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View QR Badge</span>
                  </button>

                  <a
                    href={`/menu/${table.code}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
                    title="Open Live Guest Menu"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => {
                      if (confirm(`Delete Table ${table.tableNumber}?`)) {
                        deleteTable(table.id);
                      }
                    }}
                    className="p-1.5 rounded-xl bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 transition-colors"
                    title="Delete Table"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs no-print">
          <div className="w-full max-w-sm rounded-3xl bg-stone-900 border border-stone-800 p-6 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-800">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <Grid3X3 className="w-4 h-4 text-emerald-400" />
                <span>Create Restaurant Table</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewTable} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Table Number</label>
                <input
                  type="text"
                  required
                  value={tableNumber}
                  onChange={e => {
                    setTableNumber(e.target.value);
                    setCode(`T-${e.target.value}`);
                  }}
                  placeholder="e.g. 11"
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Unique QR Code ID</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="e.g. T-11"
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Section</label>
                <select
                  value={section}
                  onChange={e => setSection(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Main Dining">Main Dining</option>
                  <option value="Terrace Garden">Terrace Garden</option>
                  <option value="Private Lounge">Private Lounge</option>
                  <option value="Bar Area">Bar Area</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Seating Capacity</label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={capacity}
                  onChange={e => setCapacity(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors"
                >
                  Add Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Single Modal */}
      <TableQrModal
        table={selectedTableForQr}
        isOpen={!!selectedTableForQr}
        onClose={() => setSelectedTableForQr(null)}
      />
    </div>
  );
};
