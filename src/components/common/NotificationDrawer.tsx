import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  Bell,
  X,
  CheckCheck,
  Calendar,
  CreditCard,
  Sparkles,
  Wrench,
  Package,
  UserCheck,
  Clock
} from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useHotel();
  const [filterType, setFilterType] = useState<string>('all');

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'housekeeping':
        return <Sparkles className="w-4 h-4 text-sky-400" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-rose-400" />;
      case 'inventory':
        return <Package className="w-4 h-4 text-amber-500" />;
      case 'guest':
        return <UserCheck className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 text-white h-full shadow-2xl flex flex-col border-l border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-slate-100">Live Hotel Feed</h3>
              <p className="text-xs text-slate-400">
                {notifications.filter((n) => !n.read).length} unread updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium px-2 py-1 rounded hover:bg-slate-800 flex items-center gap-1 transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark Read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-3 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs bg-slate-900/50">
          {['all', 'booking', 'guest', 'inventory', 'housekeeping', 'maintenance', 'payment'].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-2.5 py-1 rounded-full font-medium capitalize whitespace-nowrap transition-colors ${
                  filterType === tab
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2">
          {filteredNotifications.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p>No notifications in this category.</p>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-3.5 rounded-xl transition-all cursor-pointer flex gap-3 ${
                  notif.read
                    ? 'bg-transparent hover:bg-slate-800/40 text-slate-400'
                    : 'bg-slate-800/70 hover:bg-slate-800 text-slate-200 border-l-2 border-amber-400'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-xs font-semibold truncate ${
                        !notif.read ? 'text-slate-100' : 'text-slate-300'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
