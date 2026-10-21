import React, { useState } from 'react';
import { useRestaurant } from '../../../context/RestaurantContext';
import { StaffMember, StaffRole } from '../../../types';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Trash2, 
  Clock, 
  Sparkles,
  X,
  AlertCircle
} from 'lucide-react';

export const AdminStaffPage: React.FC = () => {
  const { staff, addStaff, updateStaff, deleteStaff } = useRestaurant();
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState('');
  const [role, setRole] = useState<StaffRole>('waiter');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shift, setShift] = useState<'Morning' | 'Evening' | 'Full Day'>('Morning');
  const [assignedSection, setAssignedSection] = useState('Main Dining');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addStaff({
      name: name.trim(),
      role,
      phone: phone.trim() || '+91 98000 00000',
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@saffronpavilion.in`,
      shift,
      assignedSection,
      isActive: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    });

    setName('');
    setShowAddModal(false);
  };

  const roleLabels: Record<StaffRole, { title: string; color: string }> = {
    manager: { title: 'General Manager', color: 'bg-purple-950 text-purple-300 border-purple-800' },
    head_chef: { title: 'Head Chef', color: 'bg-amber-950 text-amber-300 border-amber-800' },
    waiter: { title: 'Lead Server / Waiter', color: 'bg-blue-950 text-blue-300 border-blue-800' },
    line_cook: { title: 'Line Cook', color: 'bg-orange-950 text-orange-300 border-orange-800' },
    bartender: { title: 'Mixologist', color: 'bg-pink-950 text-pink-300 border-pink-800' },
    host: { title: 'Dining Host', color: 'bg-teal-950 text-teal-300 border-teal-800' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-tight">
            Staff Records & Role Assignments
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            Manage floor waitstaff, culinary team, and duty shift allocations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Architectural Notice */}
      <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-start gap-3 text-xs text-stone-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-stone-200">Prepared for Auth Integration:</strong> These personnel records represent your team directory. When Phase 2 connects Supabase PostgreSQL with Row Level Security (RLS), these records map directly into secure JWT role claims (Admin, Staff, Kitchen).
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(member => {
          const roleBadge = roleLabels[member.role] || {
            title: member.role,
            color: 'bg-stone-800 text-stone-300',
          };

          return (
            <div
              key={member.id}
              className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-stone-700"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-white truncate">
                      {member.name}
                    </h3>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${roleBadge.color}`}
                    >
                      {roleBadge.title}
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-stone-400">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-stone-500" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>{member.shift} Shift • {member.assignedSection || 'General Floor'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Active on duty
                </span>

                <button
                  onClick={() => {
                    if (confirm(`Remove ${member.name} from staff roster?`)) {
                      deleteStaff(member.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                  title="Remove staff"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-stone-900 border border-stone-800 p-6 text-stone-100 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-800">
              <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Add Staff Member</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Verma"
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Role</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as StaffRole)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  <option value="waiter">Waiter / Server</option>
                  <option value="head_chef">Head Chef</option>
                  <option value="line_cook">Line Cook</option>
                  <option value="bartender">Bartender</option>
                  <option value="manager">Manager</option>
                  <option value="host">Host</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98450 11223"
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Shift</label>
                <select
                  value={shift}
                  onChange={e => setShift(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Morning">Morning Shift (11 AM - 4 PM)</option>
                  <option value="Evening">Evening Shift (5 PM - 11:30 PM)</option>
                  <option value="Full Day">Full Day</option>
                </select>
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
