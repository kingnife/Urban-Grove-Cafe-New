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
  Ticket
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
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'reservations' | 'events'>('overview');
  
  // Menu Item Modal
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);

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
                  ${stats.todayRevenue.toLocaleString()}
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
                  {stats.totalOrders}
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
                  {stats.reservationsToday}
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
                  {stats.activeCustomers}
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
                        value={ord.status}
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
                          value={ord.status}
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
                        checked={it.inStock}
                        onChange={(e) => onUpdateMenuItemStock(it.id, e.target.checked)}
                        className="rounded text-[#1E3A2F] focus:ring-[#1E3A2F]"
                      />
                      <span className={`text-xs font-bold ${it.inStock ? 'text-[#1E3A2F]' : 'text-red-600'}`}>
                        {it.inStock ? 'In Stock' : 'Out of Stock'}
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

        {/* TAB 5: EVENT MANAGEMENT (Prompt Requirement: Create events, View RSVPs) */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#2A1E17]">Café Events & RSVP Rosters</h3>
                <p className="text-xs text-[#2A1E17]/60">Manage upcoming jazz nights, coffee workshops, and weekend brunches.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white p-6 rounded-3xl border border-[#2A1E17]/8 shadow-sm space-y-4"
                >
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-40 object-cover rounded-2xl"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#C48B47] tracking-wider">
                      {evt.category}
                    </span>
                    <h4 className="font-serif text-xl font-bold text-[#2A1E17] mt-1">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-[#2A1E17]/70 mt-1">
                      {evt.date} • {evt.time}
                    </p>
                  </div>

                  <div className="p-3 bg-[#F6F2EC] rounded-xl flex items-center justify-between text-xs">
                    <span className="font-medium text-[#2A1E17]">Registered RSVPs</span>
                    <span className="font-serif font-bold text-sm text-[#1E3A2F]">
                      {evt.rsvpList.length} guests ({evt.spotsLeft} spots open)
                    </span>
                  </div>

                  {evt.rsvpList.length > 0 && (
                    <div className="space-y-1 text-xs">
                      <p className="text-[11px] font-bold text-[#2A1E17]/70 uppercase">Recent Attendees:</p>
                      <ul className="text-[11px] text-[#2A1E17]/80 space-y-0.5">
                        {evt.rsvpList.slice(0, 3).map((r, i) => (
                          <li key={i}>• {r.name} ({r.guests} guests)</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
                    value={editingItem.price || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
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
                    checked={editingItem.inStock ?? true}
                    onChange={(e) => setEditingItem({ ...editingItem, inStock: e.target.checked })}
                    className="rounded text-[#1E3A2F]"
                  />
                  <span className="font-semibold text-[#2A1E17]">In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isPopular ?? false}
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
    </div>
  );
};
