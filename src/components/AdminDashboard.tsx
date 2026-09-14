import React, { useState } from 'react';
import { 
  BarChart3, 
  ShoppingBag, 
  CalendarDays, 
  UtensilsCrossed, 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Eye, 
  Check, 
  ChevronRight,
  Sparkles,
  Ticket,
  MapPin,
  UserPlus,
  Calendar,
  Search
} from 'lucide-react';
import { AdminStats, Order, MenuItem, Reservation, CafeEvent, OrderStatus, MenuCategory } from '../types';

interface AdminDashboardProps {
  stats: AdminStats;
  orders: Order[];
  menuItems: MenuItem[];
  reservations: Reservation[];
  events: CafeEvent[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onUpdateMenuItemStock: (itemId: string, inStock: boolean) => Promise<void>;
  onSaveMenuItem: (item: Partial<MenuItem>) => Promise<void>;
  onDeleteMenuItem: (itemId: string) => Promise<void>;
  onUpdateReservationStatus: (resId: string, status: 'confirmed' | 'cancelled') => Promise<void>;
  onSaveEvent: (event: Partial<CafeEvent>) => Promise<void>;
  onDeleteEvent: (eventId: string) => Promise<void>;
  onRemoveRSVP: (eventId: string, rsvpIndex: number) => Promise<void>;
  onAddRSVP?: (eventId: string, data: { name: string; email: string; guests: number }) => Promise<void>;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  orders,
  menuItems,
  reservations,
  events,
  onUpdateOrderStatus,
  onUpdateMenuItemStock,
  onSaveMenuItem,
  onDeleteMenuItem,
  onUpdateReservationStatus,
  onSaveEvent,
  onDeleteEvent,
  onRemoveRSVP,
  onAddRSVP,
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'reservations' | 'events'>('overview');
  
  // Menu Item Modal
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);

  // Event Add/Edit Modal
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<CafeEvent> | null>(null);

  // RSVP Management Modal
  const [selectedRsvpEventId, setSelectedRsvpEventId] = useState<string | null>(null);
  const [newRsvpName, setNewRsvpName] = useState('');
  const [newRsvpEmail, setNewRsvpEmail] = useState('');
  const [newRsvpGuests, setNewRsvpGuests] = useState(1);
  const [isAddingRsvp, setIsAddingRsvp] = useState(false);

  // Event Filters
  const [eventCategoryFilter, setEventCategoryFilter] = useState('all');
  const [eventSearchQuery, setEventSearchQuery] = useState('');

  const handleOpenNewItem = () => {
    setEditingItem({
      name: '',
      category: 'coffee',
      price: 4.5,
      description: '',
      ingredients: [],
      dietary: [],
      rating: 4.8,
      reviewCount: 1,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      inStock: true,
      isPopular: false,
      isSpecial: false
    });
    setShowItemModal(true);
  };

  const handleSaveItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name) return;
    await onSaveMenuItem(editingItem);
    setShowItemModal(false);
    setEditingItem(null);
  };

  // Event Operations
  const handleOpenNewEvent = () => {
    setEditingEvent({
      title: '',
      category: 'Music & Evening',
      date: 'Saturday, Oct 10',
      time: '7:00 PM – 9:30 PM',
      description: '',
      location: 'Main Hearth Lounge',
      ticketPrice: 0,
      spotsLeft: 25,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      rsvps: [],
      rsvpList: []
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (evt: CafeEvent) => {
    setEditingEvent({ ...evt });
    setShowEventModal(true);
  };

  const handleSaveEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent || !editingEvent.title) return;
    await onSaveEvent(editingEvent);
    setShowEventModal(false);
    setEditingEvent(null);
  };

  const handleDeleteEventClick = async (eventId: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove the event "${title}"? This will permanently delete the event and all guest registrations.`)) {
      await onDeleteEvent(eventId);
      if (selectedRsvpEventId === eventId) {
        setSelectedRsvpEventId(null);
      }
    }
  };

  const handleRemoveRsvpClick = async (eventId: string, rsvpIndex: number, guestName: string) => {
    if (window.confirm(`Cancel RSVP for ${guestName}? This will restore their spot(s) on the guestlist.`)) {
      await onRemoveRSVP(eventId, rsvpIndex);
    }
  };

  const handleAddManualRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRsvpEventId || !newRsvpName.trim() || !onAddRSVP) return;
    setIsAddingRsvp(true);
    try {
      await onAddRSVP(selectedRsvpEventId, {
        name: newRsvpName.trim(),
        email: newRsvpEmail.trim() || 'walkin@urbangrove.com',
        guests: Number(newRsvpGuests) || 1
      });
      setNewRsvpName('');
      setNewRsvpEmail('');
      setNewRsvpGuests(1);
    } finally {
      setIsAddingRsvp(false);
    }
  };

  const activeRsvpEvent = events.find((e) => e.id === selectedRsvpEventId);

  // Filtered events
  const filteredEvents = events.filter((evt) => {
    const matchesCategory = eventCategoryFilter === 'all' || evt.category === eventCategoryFilter;
    const matchesQuery = !eventSearchQuery.trim() || 
      evt.title.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(eventSearchQuery.toLowerCase()) ||
      evt.date.toLowerCase().includes(eventSearchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="py-10 bg-[#F6F2EC] min-h-screen" id="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-[#2A1E17] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#D4A373] mb-1">
              <span className="w-2 h-2 rounded-full bg-[#86efac] animate-pulse" />
              <span>Café Manager Operations</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
              Urban Grove Cafe Admin
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-1 font-light">
              Live orders, table seating, inventory availability, and guest events.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors backdrop-blur-sm"
            >
              Exit to Customer View
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#2A1E17]/10 pb-2 overflow-x-auto scrollbar-none text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-[#2A1E17] text-white'
                : 'bg-white text-[#2A1E17]/70 hover:bg-[#ede7de]'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#2A1E17] text-white'
                : 'bg-white text-[#2A1E17]/70 hover:bg-[#ede7de]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Management ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-[#2A1E17] text-white'
                : 'bg-white text-[#2A1E17]/70 hover:bg-[#ede7de]'
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Menu & Stock ({menuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'reservations'
                ? 'bg-[#2A1E17] text-white'
                : 'bg-white text-[#2A1E17]/70 hover:bg-[#ede7de]'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Reservations ({reservations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'events'
                ? 'bg-[#2A1E17] text-white'
                : 'bg-white text-[#2A1E17]/70 hover:bg-[#ede7de]'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Events & RSVP ({events.length})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW METRICS (Prompt Requirement) */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics: Today's Revenue $1,280, Total Orders 64, Reservations Today 12, Active Customers 38 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-[#2A1E17]/8 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2A1E17]/60">
                    Today's Revenue
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#eef6f2] text-[#1E3A2F] flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-serif text-3xl font-bold text-[#2A1E17]">
                  ${(stats?.todayRevenue ?? 0).toLocaleString()}
                </p>
                <p className="text-[11px] text-[#1E3A2F] font-semibold flex items-center gap-1">
                  <span>+14.2% vs yesterday</span>
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#2A1E17]/8 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2A1E17]/60">
                    Total Orders
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#F6F2EC] text-[#C48B47] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-serif text-3xl font-bold text-[#2A1E17]">
                  {stats?.totalOrders ?? orders.length}
                </p>
                <p className="text-[11px] text-[#2A1E17]/60">
                  {orders.filter(o => o.status === 'received' || o.status === 'preparing').length} in kitchen queue
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#2A1E17]/8 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2A1E17]/60">
                    Reservations Today
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#eef6f2] text-[#1E3A2F] flex items-center justify-center">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-serif text-3xl font-bold text-[#2A1E17]">
                  {stats?.reservationsToday ?? reservations.length}
                </p>
                <p className="text-[11px] text-[#2A1E17]/60">
                  {reservations.reduce((acc, r) => acc + r.guests, 0)} total booked guests
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-[#2A1E17]/8 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2A1E17]/60">
                    Active Customers
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-[#F6F2EC] text-[#2A1E17] flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <p className="font-serif text-3xl font-bold text-[#2A1E17]">
                  {stats?.activeCustomers ?? 38}
                </p>
                <p className="text-[11px] text-[#2A1E17]/60">
                  In loyalty club & registered accounts
                </p>
              </div>
            </div>

            {/* Quick Kitchen Alert / Recent Orders */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#2A1E17]/8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-[#2A1E17]">
                  Active Kitchen Orders Queue
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#C48B47] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="space-y-3">
                {orders.slice(0, 3).map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#2A1E17]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#2A1E17]">
                          Order #{ord.orderNumber}
                        </span>
                        <span className="text-xs text-[#2A1E17]/60">• {ord.customerName}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-200 text-gray-800">
                          {ord.orderType}
                        </span>
                      </div>
                      <p className="text-xs text-[#2A1E17]/75 mt-1">
                        {ord.items.map(i => `${i.quantity}x ${i?.menuItem?.name || 'Item'}`).join(', ')}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-sm text-[#2A1E17]">
                        ${ord.total.toFixed(2)}
                      </span>
                      <select
                        value={ord.status || 'received'}
                        onChange={(e: any) => onUpdateOrderStatus(ord.id, e.target.value)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#2A1E17]/15 bg-white text-[#2A1E17]"
                      >
                        <option value="received">Received</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT (Prompt Requirement) */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-[#2A1E17]/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#2A1E17]/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2A1E17]">Live Order Expediter</h3>
                <p className="text-xs text-[#2A1E17]/60 mt-0.5">Click any status dropdown to notify customers in real-time.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2A1E17]">
                <thead className="bg-[#F6F2EC] text-[11px] uppercase tracking-wider text-[#2A1E17]/70 font-bold border-b border-[#2A1E17]/10">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items & Notes</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A1E17]/5">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FDFBF7] transition-colors">
                      <td className="p-4 font-mono font-bold text-[#C48B47]">
                        #{ord.orderNumber}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-[#2A1E17]">{ord.customerName}</p>
                        <p className="text-[11px] text-[#2A1E17]/50">{ord.customerPhone}</p>
                      </td>
                      <td className="p-4 max-w-xs">
                        <p className="font-medium text-[#2A1E17]">
                          {ord.items.map(i => `${i.quantity}x ${i?.menuItem?.name || 'Item'}`).join(', ')}
                        </p>
                        {ord.notes && (
                          <p className="text-[11px] text-[#C48B47] italic mt-0.5">
                            Note: {ord.notes}
                          </p>
                        )}
                      </td>
                      <td className="p-4 uppercase font-bold text-[10px]">
                        <span className={`px-2 py-0.5 rounded ${ord.orderType === 'delivery' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {ord.orderType}
                        </span>
                      </td>
                      <td className="p-4 font-serif font-bold text-sm">
                        ${ord.total.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <select
                          value={ord.status || 'received'}
                          onChange={(e: any) => onUpdateOrderStatus(ord.id, e.target.value)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                            ord.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : ord.status === 'ready'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="received">Received</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MENU MANAGEMENT (Prompt Requirement: Add, Edit, Upload/URL, Availability) */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#2A1E17]">Menu & Stock Control</h3>
                <p className="text-xs text-[#2A1E17]/60">Manage café dishes, pricing, photography, and out-of-stock toggles.</p>
              </div>

              <button
                onClick={handleOpenNewItem}
                className="px-5 py-2.5 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-sm self-start"
              >
                <Plus className="w-4 h-4 text-[#D4A373]" />
                <span>Add New Menu Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((it) => (
                <div
                  key={it.id}
                  className="bg-white p-5 rounded-3xl border border-[#2A1E17]/8 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="w-20 h-20 rounded-2xl object-cover bg-[#F6F2EC] shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-[#C48B47]">
                          {it.category}
                        </span>
                        <span className="font-serif text-base font-bold text-[#2A1E17]">
                          ${it.price.toFixed(2)}
                        </span>
                      </div>
                      <h4 className="font-serif text-base font-bold text-[#2A1E17] truncate mt-0.5">
                        {it.name}
                      </h4>
                      <p className="text-xs text-[#2A1E17]/60 line-clamp-2 mt-1">
                        {it.description}
                      </p>
                    </div>
                  </div>

                  {/* Stock Toggle and Edit Controls */}
                  <div className="pt-3 border-t border-[#2A1E17]/5 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(it.inStock ?? it.isAvailable ?? true)}
                        onChange={(e) => onUpdateMenuItemStock(it.id, e.target.checked)}
                        className="rounded text-[#1E3A2F] focus:ring-[#1E3A2F]"
                      />
                      <span className={`text-xs font-bold ${Boolean(it.inStock ?? it.isAvailable ?? true) ? 'text-[#1E3A2F]' : 'text-red-600'}`}>
                        {Boolean(it.inStock ?? it.isAvailable ?? true) ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </label>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingItem(it);
                          setShowItemModal(true);
                        }}
                        className="p-1.5 text-[#2A1E17]/60 hover:text-[#2A1E17] rounded-lg hover:bg-[#F6F2EC]"
                        title="Edit Item"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteMenuItem(it.id)}
                        className="p-1.5 text-[#2A1E17]/40 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RESERVATION MANAGEMENT (Prompt Requirement) */}
        {activeTab === 'reservations' && (
          <div className="bg-white rounded-3xl border border-[#2A1E17]/10 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#2A1E17]/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2A1E17]">Table Booking Ledger</h3>
                <p className="text-xs text-[#2A1E17]/60 mt-0.5">Confirm table preparation or adjust seating cancellations.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#2A1E17]">
                <thead className="bg-[#F6F2EC] text-[11px] uppercase tracking-wider text-[#2A1E17]/70 font-bold border-b border-[#2A1E17]/10">
                  <tr>
                    <th className="p-4">Ref Code</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Guests</th>
                    <th className="p-4">Seating Area</th>
                    <th className="p-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A1E17]/5">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-[#FDFBF7] transition-colors">
                      <td className="p-4 font-mono font-bold text-[#C48B47]">
                        {res.reservationCode}
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-[#2A1E17]">{res.customerName}</p>
                        <p className="text-[11px] text-[#2A1E17]/50">{res.customerEmail} • {res.customerPhone}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-[#2A1E17]">{res.date}</p>
                        <p className="text-[11px] text-[#2A1E17]/60">{res.time}</p>
                      </td>
                      <td className="p-4 font-bold">
                        {res.guests} Guests
                      </td>
                      <td className="p-4 text-xs">
                        <span className="font-medium text-[#1E3A2F]">{res.seatingArea}</span>
                        {res.specialRequests && (
                          <p className="text-[11px] text-[#2A1E17]/50 italic">Note: {res.specialRequests}</p>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${
                            res.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : res.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {res.status}
                          </span>

                          {res.status !== 'confirmed' && (
                            <button
                              onClick={() => onUpdateReservationStatus(res.id, 'confirmed')}
                              className="px-2 py-1 bg-[#1E3A2F] text-white text-[10px] font-semibold rounded hover:bg-[#152921]"
                            >
                              Confirm
                            </button>
                          )}

                          {res.status !== 'cancelled' && (
                            <button
                              onClick={() => onUpdateReservationStatus(res.id, 'cancelled')}
                              className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-semibold rounded hover:bg-red-200"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: EVENT MANAGEMENT (Prompt Requirement: Create events, View & Edit RSVPs) */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="bg-white p-6 rounded-3xl border border-[#2A1E17]/8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C48B47] mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Programming & Hospitality</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#2A1E17]">Café Events & RSVP Rosters</h3>
                <p className="text-xs text-[#2A1E17]/60 mt-0.5">
                  Schedule live sessions, workshops, tasting events, and manage guest registrations.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleOpenNewEvent}
                  id="admin-add-event-btn"
                  className="px-4 py-2.5 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#D4A373]" />
                  <span>Create New Event</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {['all', 'Music & Evening', 'Culinary Special', 'Coffee Education', 'Community Gathering'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setEventCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
                      eventCategoryFilter === cat
                        ? 'bg-[#2A1E17] text-white'
                        : 'bg-white border border-[#2A1E17]/10 text-[#2A1E17]/70 hover:bg-[#F6F2EC]'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-[#2A1E17]/40 absolute left-3 top-3" />
                <input
                  type="text"
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  placeholder="Search events by title or place..."
                  className="w-full pl-8 pr-3 py-2 bg-white border border-[#2A1E17]/15 rounded-xl text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                />
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#2A1E17]/8">
                <span className="text-[11px] font-medium text-[#2A1E17]/60 block">Total Scheduled Events</span>
                <span className="font-serif text-2xl font-bold text-[#2A1E17]">{events.length}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#2A1E17]/8">
                <span className="text-[11px] font-medium text-[#2A1E17]/60 block">Total RSVP Attendees</span>
                <span className="font-serif text-2xl font-bold text-[#1E3A2F]">
                  {events.reduce((sum, e) => {
                    const list = e.rsvpList && e.rsvpList.length > 0 ? e.rsvpList : (e.rsvps || []);
                    return sum + list.reduce((s, r) => s + (r.guests || 1), 0);
                  }, 0)} Guests
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#2A1E17]/8 col-span-2 sm:col-span-1">
                <span className="text-[11px] font-medium text-[#2A1E17]/60 block">Available Open Seats</span>
                <span className="font-serif text-2xl font-bold text-[#C48B47]">
                  {events.reduce((sum, e) => sum + (e.spotsLeft || 0), 0)} Seats
                </span>
              </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-[#2A1E17]/8 space-y-3">
                <Calendar className="w-10 h-10 text-[#2A1E17]/30 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-[#2A1E17]">No events found</h4>
                <p className="text-xs text-[#2A1E17]/60 max-w-sm mx-auto">
                  {eventSearchQuery || eventCategoryFilter !== 'all'
                    ? 'No events matched your search query or category filter.'
                    : 'Get started by creating your first café event, tasting, or workshop.'}
                </p>
                <button
                  type="button"
                  onClick={handleOpenNewEvent}
                  className="px-4 py-2 bg-[#2A1E17] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 hover:bg-[#1E1510]"
                >
                  <Plus className="w-4 h-4 text-[#D4A373]" />
                  <span>Create An Event</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((evt) => {
                  const attendeeList = evt.rsvpList && evt.rsvpList.length > 0 ? evt.rsvpList : (evt.rsvps || []);
                  const totalBookedGuests = attendeeList.reduce((acc, r) => acc + (r.guests || 1), 0);

                  return (
                    <div
                      key={evt.id}
                      className="bg-white rounded-3xl border border-[#2A1E17]/8 shadow-sm flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow"
                      id={`admin-event-card-${evt.id}`}
                    >
                      <div>
                        {/* Event Image */}
                        <div className="relative h-44 overflow-hidden bg-[#2A1E17]/5">
                          <img
                            src={evt.image}
                            alt={evt.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 bg-[#2A1E17]/85 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {evt.category}
                          </div>
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#2A1E17] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                            {evt.ticketPrice === 0 ? 'Free Entry' : `$${evt.ticketPrice} / guest`}
                          </div>
                        </div>

                        {/* Event Content */}
                        <div className="p-5 space-y-3">
                          <div className="flex items-center gap-3 text-xs text-[#2A1E17]/70">
                            <span className="font-semibold text-[#C48B47] flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {evt.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#2A1E17]/40" />
                              {evt.time}
                            </span>
                          </div>

                          <h4 className="font-serif text-lg font-bold text-[#2A1E17] leading-snug">
                            {evt.title}
                          </h4>

                          <p className="text-xs text-[#2A1E17]/75 line-clamp-2 leading-relaxed font-light">
                            {evt.description}
                          </p>

                          <div className="flex items-center gap-1.5 text-xs text-[#2A1E17]/60 pt-2 border-t border-[#2A1E17]/5">
                            <MapPin className="w-3.5 h-3.5 text-[#C48B47] shrink-0" />
                            <span className="truncate">{evt.location}</span>
                          </div>

                          {/* RSVP Roster Summary */}
                          <div className="p-3 bg-[#F6F2EC] rounded-2xl space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-[#2A1E17] flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-[#1E3A2F]" />
                                <span>RSVP Roster</span>
                              </span>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-[#1E3A2F] border border-[#2A1E17]/10">
                                {totalBookedGuests} booked • {evt.spotsLeft} left
                              </span>
                            </div>

                            {attendeeList.length > 0 ? (
                              <div className="space-y-1">
                                <ul className="text-[11px] text-[#2A1E17]/80 space-y-1">
                                  {attendeeList.slice(0, 2).map((r, i) => (
                                    <li key={i} className="flex items-center justify-between bg-white/70 px-2 py-1 rounded-lg">
                                      <span className="font-medium truncate max-w-[130px]">{r.name}</span>
                                      <span className="text-[10px] text-[#2A1E17]/60 font-semibold">{r.guests} guest{r.guests > 1 ? 's' : ''}</span>
                                    </li>
                                  ))}
                                </ul>
                                {attendeeList.length > 2 && (
                                  <p className="text-[10px] text-[#2A1E17]/60 italic pl-1">
                                    + {attendeeList.length - 2} more guest registration{attendeeList.length - 2 > 1 ? 's' : ''}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="text-[11px] text-[#2A1E17]/50 italic">No registrations recorded yet.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Action Controls */}
                      <div className="p-5 pt-0 flex items-center gap-2 border-t border-[#2A1E17]/5 mt-2">
                        <button
                          type="button"
                          onClick={() => setSelectedRsvpEventId(evt.id)}
                          id={`manage-rsvps-btn-${evt.id}`}
                          className="flex-1 py-2 px-3 bg-[#1E3A2F] hover:bg-[#152921] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Users className="w-3.5 h-3.5 text-[#86efac]" />
                          <span>Manage RSVPs ({attendeeList.length})</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditEvent(evt)}
                          id={`edit-event-btn-${evt.id}`}
                          className="p-2 border border-[#2A1E17]/15 hover:bg-[#F6F2EC] text-[#2A1E17] rounded-xl transition-colors"
                          title="Edit Event Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteEventClick(evt.id, evt.title)}
                          id={`delete-event-btn-${evt.id}`}
                          className="p-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-xl transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Item Add/Edit Modal */}
      {showItemModal && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#2A1E17]/10 shadow-2xl relative my-6">
            <button
              onClick={() => setShowItemModal(false)}
              className="absolute top-4 right-4 p-2 text-[#2A1E17]/60 hover:text-[#2A1E17] rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#2A1E17] mb-1">
              {editingItem.id ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>
            <p className="text-xs text-[#2A1E17]/60 mb-5">
              Configure name, pricing, category, and image URL.
            </p>

            <form onSubmit={handleSaveItemSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2A1E17] mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={editingItem.name || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  placeholder="e.g. Vanilla Bean Flat White"
                  className="w-full px-3 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2A1E17] mb-1">Category</label>
                  <select
                    value={editingItem.category || 'coffee'}
                    onChange={(e: any) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] bg-white"
                  >
                    <option value="coffee">Coffee</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="sandwiches">Sandwiches</option>
                    <option value="pastries">Pastries</option>
                    <option value="desserts">Desserts</option>
                    <option value="cold-drinks">Cold Drinks</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#2A1E17] mb-1">Price ($) *</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={editingItem.price !== undefined && !isNaN(editingItem.price) ? editingItem.price : ''}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value === '' ? ('' as any) : parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2A1E17] mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={editingItem.image || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2A1E17] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Freshly pulled double shot with steamed micro-foam..."
                  className="w-full px-3 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingItem.inStock ?? editingItem.isAvailable ?? true)}
                    onChange={(e) => setEditingItem({ ...editingItem, inStock: e.target.checked })}
                    className="rounded text-[#1E3A2F]"
                  />
                  <span className="font-semibold text-[#2A1E17]">In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingItem.isPopular ?? false)}
                    onChange={(e) => setEditingItem({ ...editingItem, isPopular: e.target.checked })}
                    className="rounded text-[#C48B47]"
                  />
                  <span className="font-semibold text-[#2A1E17]">Featured Popular</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2A1E17]/10">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#2A1E17]/60 hover:text-[#2A1E17]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EVENT ADD / EDIT MODAL */}
      {showEventModal && editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-[#2A1E17]/10 shadow-2xl relative my-8">
            <button
              onClick={() => {
                setShowEventModal(false);
                setEditingEvent(null);
              }}
              className="absolute top-4 right-4 p-2 text-[#2A1E17]/60 hover:text-[#2A1E17] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#C48B47] mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{editingEvent.id ? 'Modify Existing Event' : 'New Cafe Gathering'}</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2A1E17] mb-1">
              {editingEvent.id ? 'Edit Event Details' : 'Create New Café Event'}
            </h3>
            <p className="text-xs text-[#2A1E17]/60 mb-6 font-light">
              Configure event dates, seating capacity, pricing, and promotional photos.
            </p>

            <form onSubmit={handleSaveEventSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#2A1E17] mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={editingEvent.title || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  placeholder="e.g. Friday Night Jazz & Strings"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2A1E17] mb-1">Category</label>
                  <select
                    value={editingEvent.category || 'Music & Evening'}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] bg-white focus:outline-none focus:border-[#C48B47]"
                  >
                    <option value="Music & Evening">Music & Evening</option>
                    <option value="Culinary Special">Culinary Special</option>
                    <option value="Coffee Education">Coffee Education</option>
                    <option value="Community Gathering">Community Gathering</option>
                    <option value="Art & Poetry">Art & Poetry</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#2A1E17] mb-1">Location Area</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.location || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                    placeholder="e.g. Main Hearth Lounge, Garden Patio"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2A1E17] mb-1">Date String *</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.date || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    placeholder="e.g. Friday, Oct 24"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2A1E17] mb-1">Time Range *</label>
                  <input
                    type="text"
                    required
                    value={editingEvent.time || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    placeholder="e.g. 7:00 PM – 9:30 PM"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2A1E17] mb-1">Admission Price ($)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={editingEvent.ticketPrice !== undefined && !isNaN(editingEvent.ticketPrice) ? editingEvent.ticketPrice : 0}
                    onChange={(e) => setEditingEvent({ ...editingEvent, ticketPrice: e.target.value === '' ? 0 : parseFloat(e.target.value) })}
                    placeholder="0 for Free Entry"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                  <span className="text-[10px] text-[#2A1E17]/50 block mt-0.5">Enter 0 for free admission</span>
                </div>

                <div>
                  <label className="block font-semibold text-[#2A1E17] mb-1">Available Spots / Capacity</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={editingEvent.spotsLeft !== undefined && !isNaN(editingEvent.spotsLeft) ? editingEvent.spotsLeft : 20}
                    onChange={(e) => setEditingEvent({ ...editingEvent, spotsLeft: parseInt(e.target.value, 10) || 0 })}
                    placeholder="e.g. 25"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2A1E17] mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={editingEvent.description || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  placeholder="Describe the mood, guest performers, special menu items, or booking requirements..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-[#2A1E17]">Cover Photo Image URL</label>
                  <span className="text-[10px] text-[#2A1E17]/50">Or choose a preset below</span>
                </div>
                <input
                  type="url"
                  required
                  value={editingEvent.image || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[
                    { label: 'Live Jazz & Strings', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Artisan Brunch', url: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Coffee Cupping', url: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80' },
                    { label: 'Pastry & Latte Art', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80' }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setEditingEvent({ ...editingEvent, image: preset.url })}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-[#F6F2EC] hover:bg-[#ede7de] text-[#2A1E17]/80 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#2A1E17]/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowEventModal(false);
                    setEditingEvent(null);
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-[#2A1E17]/60 hover:text-[#2A1E17]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  {editingEvent.id ? 'Save Event Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RSVP MANAGEMENT / ROSTER MODAL */}
      {selectedRsvpEventId && activeRsvpEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#2A1E17]/10 shadow-2xl relative my-8">
            <button
              onClick={() => setSelectedRsvpEventId(null)}
              className="absolute top-4 right-4 p-2 text-[#2A1E17]/60 hover:text-[#2A1E17] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Event Header Banner */}
            <div className="mb-6">
              <span className="text-[10px] uppercase font-bold text-[#C48B47] tracking-wider block mb-1">
                {activeRsvpEvent.category} • Guestlist & Attendance
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#2A1E17]">
                {activeRsvpEvent.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#2A1E17]/70 mt-2">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#C48B47]" />
                  {activeRsvpEvent.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#2A1E17]/50" />
                  {activeRsvpEvent.time}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C48B47]" />
                  {activeRsvpEvent.location}
                </span>
              </div>
            </div>

            {/* Capacity Status Bar */}
            <div className="p-4 bg-[#F6F2EC] rounded-2xl flex items-center justify-between mb-6">
              <div>
                <span className="text-xs text-[#2A1E17]/60 block font-medium">Total Registered</span>
                <span className="font-serif text-xl font-bold text-[#1E3A2F]">
                  {(activeRsvpEvent.rsvpList && activeRsvpEvent.rsvpList.length > 0 ? activeRsvpEvent.rsvpList : (activeRsvpEvent.rsvps || [])).reduce((sum, r) => sum + (r.guests || 1), 0)} Guests
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs text-[#2A1E17]/60 block font-medium">Remaining Capacity</span>
                <span className={`font-serif text-xl font-bold ${activeRsvpEvent.spotsLeft <= 5 ? 'text-[#801414]' : 'text-[#C48B47]'}`}>
                  {activeRsvpEvent.spotsLeft} Spots Open
                </span>
              </div>
            </div>

            {/* Attendee Roster List */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A1E17]">
                  Confirmed RSVPs ({(activeRsvpEvent.rsvpList && activeRsvpEvent.rsvpList.length > 0 ? activeRsvpEvent.rsvpList : (activeRsvpEvent.rsvps || [])).length})
                </h4>
                <span className="text-[11px] text-[#2A1E17]/50">Click trash icon to cancel RSVP</span>
              </div>

              {(() => {
                const list = activeRsvpEvent.rsvpList && activeRsvpEvent.rsvpList.length > 0 ? activeRsvpEvent.rsvpList : (activeRsvpEvent.rsvps || []);
                if (list.length === 0) {
                  return (
                    <div className="p-6 text-center bg-[#FDFBF7] rounded-2xl border border-dashed border-[#2A1E17]/15">
                      <p className="text-xs text-[#2A1E17]/60 italic">No registrations for this event yet.</p>
                    </div>
                  );
                }

                return (
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                    {list.map((rsvp, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-xl border border-[#2A1E17]/10 flex items-center justify-between gap-3 hover:border-[#2A1E17]/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center font-bold text-xs">
                            {rsvp.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#2A1E17]">{rsvp.name}</p>
                            <p className="text-[11px] text-[#2A1E17]/60">{rsvp.email || 'No email specified'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F6F2EC] text-[#2A1E17]">
                            {rsvp.guests} guest{rsvp.guests > 1 ? 's' : ''}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleRemoveRsvpClick(activeRsvpEvent.id, idx, rsvp.name)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel RSVP and restore spots"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Quick Add Manual RSVP (Phone/Walk-in) */}
            {onAddRSVP && (
              <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#2A1E17]/10">
                <h5 className="text-xs font-bold text-[#2A1E17] mb-2 flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-[#C48B47]" />
                  <span>Manual Guest Entry (Walk-in or Phone Registration)</span>
                </h5>
                <form onSubmit={handleAddManualRsvp} className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    required
                    value={newRsvpName}
                    onChange={(e) => setNewRsvpName(e.target.value)}
                    placeholder="Guest Full Name *"
                    className="px-3 py-2 text-xs rounded-xl border border-[#2A1E17]/15 bg-white text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                  <input
                    type="email"
                    value={newRsvpEmail}
                    onChange={(e) => setNewRsvpEmail(e.target.value)}
                    placeholder="Email (Optional)"
                    className="px-3 py-2 text-xs rounded-xl border border-[#2A1E17]/15 bg-white text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                  <input
                    type="number"
                    min="1"
                    max={Math.max(1, activeRsvpEvent.spotsLeft)}
                    value={newRsvpGuests}
                    onChange={(e) => setNewRsvpGuests(parseInt(e.target.value, 10) || 1)}
                    placeholder="Party size"
                    className="px-3 py-2 text-xs rounded-xl border border-[#2A1E17]/15 bg-white text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                  <button
                    type="submit"
                    disabled={isAddingRsvp || activeRsvpEvent.spotsLeft <= 0}
                    className="px-3 py-2 bg-[#2A1E17] hover:bg-[#1E1510] disabled:bg-gray-400 text-white text-xs font-semibold rounded-xl transition-all"
                  >
                    {isAddingRsvp ? 'Adding...' : '+ Add RSVP'}
                  </button>
                </form>
              </div>
            )}

            <div className="flex justify-end pt-4 mt-4 border-t border-[#2A1E17]/10">
              <button
                type="button"
                onClick={() => setSelectedRsvpEventId(null)}
                className="px-5 py-2 bg-[#2A1E17] text-white text-xs font-semibold rounded-xl hover:bg-[#1E1510]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
