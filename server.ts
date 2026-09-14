import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_RESERVATIONS, 
  INITIAL_REVIEWS, 
  INITIAL_EVENTS,
  INITIAL_USER 
} from './src/data/initialData.ts';
import { MenuItem, Order, Reservation, Review, CafeEvent, ContactMessage, CustomerUser } from './src/types.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // In-memory relational state store
  let menuItems: MenuItem[] = [...INITIAL_MENU_ITEMS];
  let orders: Order[] = [...INITIAL_ORDERS];
  let reservations: Reservation[] = [...INITIAL_RESERVATIONS];
  let reviews: Review[] = [...INITIAL_REVIEWS];
  let events: CafeEvent[] = [...INITIAL_EVENTS];
  let currentUser: CustomerUser = { ...INITIAL_USER };
  let messages: ContactMessage[] = [
    {
      id: 'msg-1',
      name: 'Claire Thompson',
      email: 'claire.t@example.com',
      phone: '+1 (555) 321-9988',
      subject: 'Private Catering Inquiry for 30 people',
      message: 'Hello! We are looking to host an intimate morning corporate brunch on October 12th. Does your team provide on-site barista and pastry catering?',
      createdAt: 'Yesterday at 3:45 PM',
      status: 'unread'
    },
    {
      id: 'msg-2',
      name: 'James Reynolds',
      email: 'james.r@example.com',
      phone: '+1 (555) 654-7722',
      subject: 'Coffee bean wholesale question',
      message: 'Are you roasting your own Colombian Geisha beans currently? Would love to purchase a 5lb bag for our design studio.',
      createdAt: '2 days ago',
      status: 'replied'
    }
  ];

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: 'Urban Grove Cafe', timestamp: new Date().toISOString() });
  });

  // --- MENU API ---
  app.get('/api/menu', (req, res) => {
    const { category, search, sort } = req.query;
    let result = [...menuItems];

    if (category && category !== 'all') {
      result = result.filter(item => item.category === category);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) ||
        item.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }

    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'popular') {
      result.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }

    res.json({ success: true, count: result.length, data: result });
  });

  app.get('/api/menu/:id', (req, res) => {
    const item = menuItems.find(m => m.id === req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    res.json({ success: true, data: item });
  });

  app.post('/api/menu', (req, res) => {
    const { name, description, price, category, image, dietary, ingredients, isPopular, isSpecial } = req.body;
    if (!name || price === undefined || !category) {
      return res.status(400).json({ success: false, error: 'Name, price, and category are required' });
    }
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name,
      description: description || '',
      price: Number(price),
      category,
      image: image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewCount: 1,
      dietary: dietary || [],
      ingredients: ingredients || [],
      isPopular: Boolean(isPopular),
      isSpecial: Boolean(isSpecial),
      isAvailable: true,
      prepTimeMinutes: 5
    };
    menuItems.unshift(newItem);
    res.status(201).json({ success: true, data: newItem });
  });

  app.put('/api/menu/:id', (req, res) => {
    const index = menuItems.findIndex(m => m.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    menuItems[index] = {
      ...menuItems[index],
      ...req.body,
      price: req.body.price !== undefined ? Number(req.body.price) : menuItems[index].price
    };
    res.json({ success: true, data: menuItems[index] });
  });

  app.delete('/api/menu/:id', (req, res) => {
    const index = menuItems.findIndex(m => m.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    const deleted = menuItems.splice(index, 1)[0];
    res.json({ success: true, data: deleted });
  });

  // --- ORDERS API ---
  app.get('/api/orders', (req, res) => {
    const { email } = req.query;
    let result = [...orders];
    if (email && typeof email === 'string') {
      result = result.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase());
    }
    res.json({ success: true, count: result.length, data: result });
  });

  app.get('/api/orders/:id', (req, res) => {
    const query = req.params.id;
    const order = orders.find(o => o.id === query || o.orderNumber === query);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  });

  app.post('/api/orders', (req, res) => {
    const { customerName, customerEmail, customerPhone, items, orderType, deliveryAddress, paymentMethod, notes } = req.body;
    if (!customerName || !items || !items.length) {
      return res.status(400).json({ success: false, error: 'Customer information and order items are required' });
    }

    const subtotal = items.reduce((sum: number, it: any) => sum + (it.itemTotal || it.menuItem.price * it.quantity), 0);
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const deliveryFee = orderType === 'delivery' ? 3.50 : 0;
    const total = Math.round((subtotal + tax + deliveryFee) * 100) / 100;
    const orderNumber = String(1000 + orders.length + 25);

    const newOrder: Order = {
      id: `ord-${orderNumber}`,
      orderNumber,
      customerName,
      customerEmail: customerEmail || 'guest@example.com',
      customerPhone: customerPhone || '+1 (555) 000-0000',
      items,
      orderType: orderType || 'pickup',
      deliveryAddress,
      status: 'received',
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid',
      subtotal,
      tax,
      deliveryFee,
      total,
      createdAt: 'Just now',
      estimatedReadyTime: orderType === 'delivery' ? 'Estimated delivery in 25–35 mins' : 'Ready in ~15 minutes at pickup counter',
      notes
    };

    orders.unshift(newOrder);

    // Award loyalty points for customer orders (10 pts per $1)
    const pointsEarned = Math.round(newOrder.total * 10);
    currentUser.loyaltyPoints += pointsEarned;
    currentUser.lifetimePoints = (currentUser.lifetimePoints || 0) + pointsEarned;
    const firstItemName = newOrder.items[0]?.menuItem?.name || 'Café Order';
    const historyEntry = {
      id: `tx-${Date.now()}`,
      date: 'Just now',
      description: `Order #${newOrder.orderNumber} – ${firstItemName}${newOrder.items.length > 1 ? ` & ${newOrder.items.length - 1} more` : ''}`,
      points: pointsEarned,
      type: 'order' as const,
      orderNumber: newOrder.orderNumber,
      balanceAfter: currentUser.loyaltyPoints
    };
    currentUser.pointsHistory = [historyEntry, ...(currentUser.pointsHistory || [])];

    res.status(201).json({ success: true, data: newOrder });
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    order.status = status;
    res.json({ success: true, data: order });
  });

  // Simulated Email Service for Order Confirmation / Receipt
  app.post('/api/orders/:id/email-receipt', (req, res) => {
    const { email } = req.body;
    const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const recipientEmail = email || order.customerEmail || 'customer@example.com';
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    console.log(`[SIMULATED EMAIL SERVICE] ========================================`);
    console.log(`[SIMULATED EMAIL SERVICE] TO: ${recipientEmail}`);
    console.log(`[SIMULATED EMAIL SERVICE] SUBJECT: Your Urban Grove Cafe Order Receipt #${order.orderNumber}`);
    console.log(`[SIMULATED EMAIL SERVICE] SENT AT: ${timestamp}`);
    console.log(`[SIMULATED EMAIL SERVICE] ORDER TOTAL: $${order.total.toFixed(2)}`);
    console.log(`[SIMULATED EMAIL SERVICE] ========================================`);

    res.json({
      success: true,
      message: `Receipt for Order #${order.orderNumber} sent to ${recipientEmail}`,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        recipientEmail,
        sentAt: timestamp,
        customerName: order.customerName,
        total: order.total,
        subject: `Your Urban Grove Cafe Order Receipt #${order.orderNumber}`
      }
    });
  });

  // --- RESERVATIONS API ---
  app.get('/api/reservations', (req, res) => {
    res.json({ success: true, count: reservations.length, data: reservations });
  });

  app.post('/api/reservations', (req, res) => {
    const { customerName, customerEmail, customerPhone, date, time, guests, seatingArea, specialRequests } = req.body;
    if (!customerName || !date || !time || !guests) {
      return res.status(400).json({ success: false, error: 'Name, date, time, and guest count are required' });
    }

    const code = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      reservationCode: code,
      customerName,
      customerEmail: customerEmail || 'guest@example.com',
      customerPhone: customerPhone || '+1 (555) 000-0000',
      date,
      time,
      guests: Number(guests),
      seatingArea: seatingArea || 'Main Dining Room',
      specialRequests,
      status: 'confirmed',
      createdAt: 'Just now'
    };

    reservations.unshift(newReservation);
    res.status(201).json({ success: true, data: newReservation });
  });

  app.patch('/api/reservations/:id/status', (req, res) => {
    const { status } = req.body;
    const resv = reservations.find(r => r.id === req.params.id || r.reservationCode === req.params.id);
    if (!resv) {
      return res.status(404).json({ success: false, error: 'Reservation not found' });
    }
    resv.status = status;
    res.json({ success: true, data: resv });
  });

  // --- EVENTS API ---
  app.get('/api/events', (req, res) => {
    res.json({ success: true, count: events.length, data: events });
  });

  app.post('/api/events', (req, res) => {
    const { title, category, date, time, description, image, location, ticketPrice, spotsLeft } = req.body;
    const newEvent: CafeEvent = {
      id: `evt-${Date.now()}`,
      title: title || 'New Café Event',
      category: category || 'Special Event',
      date: date || 'Upcoming Date',
      time: time || '7:00 PM – 9:00 PM',
      description: description || 'Join us at Urban Grove for a special gathering.',
      image: image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      location: location || 'Urban Grove Hearth Lounge',
      ticketPrice: Number(ticketPrice) || 0,
      spotsLeft: spotsLeft !== undefined ? Math.max(0, Number(spotsLeft)) : 20,
      rsvps: [],
      rsvpList: []
    };
    events.unshift(newEvent);
    res.status(201).json({ success: true, data: newEvent });
  });

  app.put('/api/events/:id', (req, res) => {
    const index = events.findIndex(e => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    const current = events[index];
    const updated: CafeEvent = {
      ...current,
      ...req.body,
      id: current.id,
      ticketPrice: req.body.ticketPrice !== undefined ? Number(req.body.ticketPrice) : current.ticketPrice,
      spotsLeft: req.body.spotsLeft !== undefined ? Math.max(0, Number(req.body.spotsLeft)) : current.spotsLeft,
      rsvps: current.rsvps || [],
      rsvpList: current.rsvpList || current.rsvps || []
    };
    events[index] = updated;
    res.json({ success: true, data: updated });
  });

  app.delete('/api/events/:id', (req, res) => {
    const index = events.findIndex(e => e.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    const removed = events.splice(index, 1)[0];
    res.json({ success: true, message: `Event "${removed.title}" removed successfully` });
  });

  app.post('/api/events/:id/rsvp', (req, res) => {
    const { name, email, guests } = req.body;
    const event = events.find(e => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    const guestCount = Number(guests) || 1;
    if (event.spotsLeft < guestCount) {
      return res.status(400).json({ success: false, error: 'Not enough spots available' });
    }
    event.spotsLeft -= guestCount;
    if (!event.rsvps) event.rsvps = [];
    if (!event.rsvpList) event.rsvpList = [];
    const entry = { name: name || 'Guest', email: email || '', guests: guestCount };
    event.rsvps.push(entry);
    event.rsvpList.push(entry);
    res.json({ success: true, data: event, message: 'RSVP confirmed!' });
  });

  app.delete('/api/events/:id/rsvp/:rsvpIndex', (req, res) => {
    const event = events.find(e => e.id === req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    const rsvpIdx = parseInt(req.params.rsvpIndex, 10);
    const list = event.rsvpList && event.rsvpList.length > 0 ? event.rsvpList : event.rsvps;
    if (isNaN(rsvpIdx) || rsvpIdx < 0 || !list || rsvpIdx >= list.length) {
      return res.status(400).json({ success: false, error: 'Invalid RSVP index' });
    }
    const removedItem = list[rsvpIdx];
    event.spotsLeft += (removedItem.guests || 1);
    if (event.rsvpList && event.rsvpList.length > rsvpIdx) {
      event.rsvpList.splice(rsvpIdx, 1);
    }
    if (event.rsvps && event.rsvps.length > rsvpIdx) {
      event.rsvps.splice(rsvpIdx, 1);
    }
    res.json({ success: true, data: event, message: 'RSVP cancelled and spots restored' });
  });

  // --- REVIEWS API ---
  app.get('/api/reviews', (req, res) => {
    res.json({ success: true, count: reviews.length, data: reviews });
  });

  app.post('/api/reviews', (req, res) => {
    const { customerName, rating, comment, favoriteItem } = req.body;
    if (!customerName || !rating || !comment) {
      return res.status(400).json({ success: false, error: 'Name, rating, and comment are required' });
    }
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      customerName,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: Number(rating),
      date: 'Just now',
      comment,
      favoriteItem: favoriteItem || 'Specialty Coffee',
      verifiedCustomer: true
    };
    reviews.unshift(newReview);
    res.status(201).json({ success: true, data: newReview });
  });

  // --- CONTACT MESSAGES API ---
  app.get('/api/messages', (req, res) => {
    res.json({ success: true, count: messages.length, data: messages });
  });

  app.post('/api/messages', (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Name, email, and message are required' });
    }
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      phone,
      subject: subject || 'General Inquiry',
      message,
      createdAt: 'Just now',
      status: 'unread'
    };
    messages.unshift(newMsg);
    res.status(201).json({ success: true, data: newMsg, message: 'Message sent successfully' });
  });

  // --- USER & LOYALTY API ---
  app.get('/api/user', (req, res) => {
    res.json({ success: true, data: currentUser });
  });

  app.put('/api/user', (req, res) => {
    currentUser = {
      ...currentUser,
      ...req.body
    };
    res.json({ success: true, data: currentUser });
  });

  app.post('/api/user/redeem', (req, res) => {
    const { rewardTitle, pointCost } = req.body;
    const cost = Number(pointCost);
    if (!rewardTitle || isNaN(cost) || cost <= 0) {
      return res.status(400).json({ success: false, error: 'Valid reward title and point cost required' });
    }
    if (currentUser.loyaltyPoints < cost) {
      return res.status(400).json({ success: false, error: 'Insufficient loyalty points balance' });
    }

    currentUser.loyaltyPoints -= cost;
    const voucherCode = `UGC-GIFT-${Math.floor(1000 + Math.random() * 9000)}`;
    const historyEntry = {
      id: `tx-${Date.now()}`,
      date: 'Just now',
      description: `Redeemed: ${rewardTitle} (Voucher ${voucherCode})`,
      points: -cost,
      type: 'redemption' as const,
      balanceAfter: currentUser.loyaltyPoints
    };
    currentUser.pointsHistory = [historyEntry, ...(currentUser.pointsHistory || [])];

    res.json({
      success: true,
      data: currentUser,
      voucherCode,
      message: `Successfully redeemed ${rewardTitle}`
    });
  });

  // --- ADMIN AUTH & STATS ---
  app.post('/api/admin/verify', (req, res) => {
    const { passcode } = req.body || {};
    const validCodes = ['8420', '1234', 'grove2026', 'admin'];
    const cleanPass = String(passcode || '').trim();
    if (validCodes.includes(cleanPass)) {
      return res.json({ success: true, message: 'Passcode authenticated successfully' });
    }
    return res.status(401).json({ success: false, error: 'Invalid management passcode' });
  });

  app.get('/api/admin/stats', (req, res) => {
    const totalRev = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0);
    res.json({
      success: true,
      data: {
        todayRevenue: 1280 + Math.round(totalRev),
        totalOrders: orders.length + 64,
        reservationsToday: reservations.length || 12,
        activeCustomers: 38,
        totalRevenue: Math.round(totalRev + 24500),
        totalReservations: reservations.length + 180,
        totalCustomers: 450,
        recentOrders: orders.slice(0, 5),
        popularItems: [
          { name: 'Artisan Cafe Latte', sales: 48, revenue: 216.0 },
          { name: 'Smashed Avocado Toast', sales: 32, revenue: 272.0 },
          { name: 'Golden Butter Croissant', sales: 41, revenue: 143.5 }
        ],
        recentActivity: [
          { timestamp: '12 mins ago', text: 'New order #1024 for pickup received', type: 'order' },
          { timestamp: '34 mins ago', text: 'Table reserved for 4 guests on Garden Terrace', type: 'reservation' },
          { timestamp: '1 hour ago', text: '5-star review left by Sarah Johnson', type: 'review' }
        ],
        weeklySales: [
          { day: 'Mon', revenue: 1100, orders: 54 },
          { day: 'Tue', revenue: 1250, orders: 62 },
          { day: 'Wed', revenue: 1180, orders: 58 },
          { day: 'Thu', revenue: 1340, orders: 69 },
          { day: 'Fri', revenue: 1680, orders: 84 },
          { day: 'Sat', revenue: 2100, orders: 112 },
          { day: 'Sun', revenue: 1950, orders: 98 },
        ]
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Urban Grove Cafe server listening on port ${PORT}`);
  });
}

startServer();
