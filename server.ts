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
import { MenuItem, Order, Reservation, Review, CafeEvent, ContactMessage } from './src/types.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // In-memory relational state store
  let menuItems: MenuItem[] = [...INITIAL_MENU_ITEMS];
  let orders: Order[] = [...INITIAL_ORDERS];
  let reservations: Reservation[] = [...INITIAL_RESERVATIONS];
  let reviews: Review[] = [...INITIAL_REVIEWS];
  let events: CafeEvent[] = [...INITIAL_EVENTS];
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
    event.rsvps.push({ name, email, guests: guestCount });
    res.json({ success: true, data: event, message: 'RSVP confirmed!' });
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

  // --- ADMIN STATS ---
  app.get('/api/admin/stats', (req, res) => {
    const totalRev = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0);
    res.json({
      success: true,
      data: {
        totalOrders: orders.length + 120, // Real-time + historical benchmark
        totalRevenue: Math.round(totalRev + 2420),
        totalReservations: reservations.length + 29,
        totalCustomers: 486,
        recentOrders: orders.slice(0, 5),
        weeklySales: [
          { day: 'Mon', revenue: 320, orders: 18 },
          { day: 'Tue', revenue: 410, orders: 24 },
          { day: 'Wed', revenue: 390, orders: 22 },
          { day: 'Thu', revenue: 480, orders: 29 },
          { day: 'Fri', revenue: 640, orders: 42 },
          { day: 'Sat', revenue: 890, orders: 58 },
          { day: 'Sun', revenue: 760, orders: 48 },
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
