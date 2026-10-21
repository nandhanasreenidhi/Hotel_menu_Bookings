import React from 'react';
import { OrderStatus, PaymentStatus } from '../../types';
import { Clock, ChefHat, CheckCircle2, AlertCircle, Sparkles, Send, Ban } from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2',
  }[size];

  switch (status) {
    case 'placed':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 ${sizeClasses}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>New Order</span>
        </span>
      );

    case 'accepted':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800 ${sizeClasses}`}>
          <Send className="w-3.5 h-3.5" />
          <span>Accepted</span>
        </span>
      );

    case 'preparing':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 ${sizeClasses}`}>
          <ChefHat className="w-3.5 h-3.5 animate-pulse text-amber-600 dark:text-amber-400" />
          <span>In Kitchen</span>
        </span>
      );

    case 'ready':
      return (
        <span className={`inline-flex items-center font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 ${sizeClasses}`}>
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Ready to Serve</span>
        </span>
      );

    case 'served':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800 ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Served</span>
        </span>
      );

    case 'rejected':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 ${sizeClasses}`}>
          <Ban className="w-3.5 h-3.5" />
          <span>Rejected</span>
        </span>
      );

    case 'cancelled':
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-stone-100 text-stone-700 border border-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700 ${sizeClasses}`}>
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Cancelled</span>
        </span>
      );

    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-stone-100 text-stone-700 border border-stone-200 ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{status}</span>
        </span>
      );
  }
};

export const PaymentBadge: React.FC<{ status: PaymentStatus; size?: 'sm' | 'md' }> = ({ status, size = 'sm' }) => {
  const pad = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  if (status === 'paid') {
    return (
      <span className={`inline-flex items-center font-semibold rounded-md bg-emerald-100/90 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 ${pad}`}>
        PAID
      </span>
    );
  }
  if (status === 'pending') {
    return (
      <span className={`inline-flex items-center font-medium rounded-md bg-amber-100/80 text-amber-800 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 ${pad}`}>
        PAYMENT PENDING
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center font-medium rounded-md bg-red-100 text-red-800 border border-red-200 ${pad}`}>
      {status.toUpperCase()}
    </span>
  );
};
