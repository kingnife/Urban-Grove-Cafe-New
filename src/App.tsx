import React, { useState, useEffect, useCallback } from 'react';
import { 
  MenuItem, 
  CartItem, 
  Order, 
  Reservation, 
  CafeEvent, 
  Review, 
  AdminStats, 
  CustomerUser, 
  CustomizationOption,
  OrderStatus,
  LoyaltyTransaction 
} from './types';
import { 
  MENU_ITEMS, 
  INITIAL_ORDERS, 
  INITIAL_RESERVATIONS, 
  CAFE_EVENTS, 
  INITIAL_REVIEWS, 
  INITIAL_ADMIN_STATS, 
  DEFAULT_USER 
} from './data/initialData';
import { api } from './utils/api';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedMenu } from './components/FeaturedMenu';
import { TodaySpecial } from './components/TodaySpecial';
import { OurServices } from './components/OurServices';
import { AboutSection } from './components/AboutSection';
import { LatestNews } from './components/LatestNews';
import { CustomerReviews } from './components/CustomerReviews';
import { MenuPage } from './components/MenuPage';
import { GalleryPage } from './components/GalleryPage';
import { EventsPage } from './components/EventsPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

// Modals and Overlays
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ReservationModal } from './components/ReservationModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { SearchModal } from './components/SearchModal';
import { Toast, ToastNotification } from './components/Toast';

export default function App() {
  // Navigation View State
  const [activeView, setActiveView] = useState<'home' | 'menu' | 'gallery' | 'events' | 'about' | 'contact' | 'account' | 'admin'>('home');
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Core Data
  const [menuItems, setMenuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);
  const [events, setEvents] = useState<CafeEvent[]>(CAFE_EVENTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [adminStats, setAdminStats] = useState<AdminStats>(INITIAL_ADMIN_STATS);
  const [user, setUser] = useState<CustomerUser>(DEFAULT_USER);

  // Cart State (Persisted in localStorage if available)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('tdg_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('tdg_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('Cart storage error', e);
    }
  }, [cartItems]);

  // Modals visibility
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('1024');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({
      id: `toast-${Date.now()}`,
      message,
      type
    });
  }, []);

  // Fetch initial data from backend API
  const refreshBackendData = useCallback(async () => {
    try {
      const [itemsData, ordersData, resData, eventsData, revData, statsData, userData] = await Promise.all([
        api.getMenuItems().catch(() => MENU_ITEMS),
        api.getOrders().catch(() => INITIAL_ORDERS),
        api.getReservations().catch(() => INITIAL_RESERVATIONS),
        api.getEvents().catch(() => CAFE_EVENTS),
        api.getReviews().catch(() => INITIAL_REVIEWS),
        api.getAdminStats().catch(() => INITIAL_ADMIN_STATS),
        api.getUser().catch(() => DEFAULT_USER),
      ]);
      setMenuItems(itemsData);
      setOrders(ordersData);
      setReservations(resData);
      setEvents(eventsData);
      setReviews(revData);
      setAdminStats((prev) => ({
        ...INITIAL_ADMIN_STATS,
        ...prev,
        ...(statsData || {})
      }));
      setUser(userData);
    } catch (err) {
      console.warn('Using local mock data', err);
    }
  }, []);

  useEffect(() => {
    refreshBackendData();
  }, [refreshBackendData]);

  // Scroll to top on navigation change
  const handleNavigate = (view: 'home' | 'menu' | 'gallery' | 'events' | 'about' | 'contact' | 'account' | 'admin') => {
    setActiveView(view);
    if (view === 'admin') {
      setIsAdminMode(true);
    } else {
      setIsAdminMode(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Operations
  const handleAddToCart = (
    item: MenuItem,
    quantity: number = 1,
    customization?: CustomizationOption
  ) => {
    // Generate a unique ID for this cart line
    const cartItemId = `${item.id}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    
    // Calculate unit price including options
    let unitPrice = item.price;
    if (customization) {
      if (customization.size === 'Large') unitPrice += 0.75;
      if (customization.milk === 'Oat Milk' || customization.milk === 'Almond Milk') unitPrice += 0.60;
      if (customization.extraShots) unitPrice += customization.extraShots * 1.00;
    }
    const itemTotal = unitPrice * quantity;

    const newCartItem: CartItem = {
      cartItemId,
      menuItem: item,
      quantity,
      customization,
      itemTotal
    };

    setCartItems((prev) => [...prev, newCartItem]);
    showToast(`Added ${quantity}x ${item.name} to cart!`);
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((it) => {
          if (it.cartItemId === cartItemId) {
            const newQty = it.quantity + delta;
            if (newQty <= 0) return null;
            const singleUnitPrice = it.itemTotal / it.quantity;
            return {
              ...it,
              quantity: newQty,
              itemTotal: singleUnitPrice * newQty
            };
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((it) => it.cartItemId !== cartItemId));
    showToast('Item removed from cart.', 'info');
  };

  // Order Placement
  const handleCompleteOrder = async (orderData: any): Promise<Order> => {
    try {
      const created = await api.createOrder(orderData);
      setOrders((prev) => [created, ...prev]);
      setCartItems([]);
      // Update admin stats
      setAdminStats((prev) => ({
        ...prev,
        todayRevenue: (prev?.todayRevenue ?? 0) + created.total,
        totalOrders: (prev?.totalOrders ?? 0) + 1
      }));
      // Add loyalty points and record history
      const pointsEarned = Math.round(created.total * 10);
      const firstItemName = created.items[0]?.menuItem?.name || 'Café Order';
      const historyTx: LoyaltyTransaction = {
        id: `tx-${Date.now()}`,
        date: 'Just now',
        description: `Order #${created.orderNumber} – ${firstItemName}${created.items.length > 1 ? ` & ${created.items.length - 1} more` : ''}`,
        points: pointsEarned,
        type: 'order',
        orderNumber: created.orderNumber,
        balanceAfter: user.loyaltyPoints + pointsEarned
      };
      setUser((prev) => ({
        ...prev,
        loyaltyPoints: prev.loyaltyPoints + pointsEarned,
        lifetimePoints: (prev.lifetimePoints || 0) + pointsEarned,
        pointsHistory: [historyTx, ...(prev.pointsHistory || [])]
      }));
      showToast(`Order #${created.orderNumber} confirmed! +${pointsEarned} loyalty points.`);
      return created;
    } catch (err) {
      showToast('Could not submit order. Please retry.', 'error');
      throw err;
    }
  };

  // Reorder from history
  const handleReorder = (pastOrder: Order) => {
    const newItems: CartItem[] = pastOrder.items.map((it) => ({
      ...it,
      cartItemId: `reorder-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    }));
    setCartItems((prev) => [...prev, ...newItems]);
    setIsCartOpen(true);
    showToast(`Added ${newItems.length} items from Order #${pastOrder.orderNumber} to cart!`);
  };

  // Reservation Booking
  const handleBookReservation = async (reservationData: any): Promise<Reservation> => {
    try {
      const created = await api.createReservation(reservationData);
      setReservations((prev) => [created, ...prev]);
      setAdminStats((prev) => ({
        ...prev,
        reservationsToday: (prev?.reservationsToday ?? 0) + 1
      }));
      showToast(`Table confirmed! Reference: ${created.reservationCode}`);
      return created;
    } catch (err) {
      showToast('Reservation booking failed. Please try again.', 'error');
      throw err;
    }
  };

  // RSVP to Event
  const handleRSVP = async (eventId: string, data: { name: string; email: string; guests: number }) => {
    try {
      const updated = await api.rsvpEvent(eventId, data);
      setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      showToast(`RSVP Confirmed for ${data.name}!`);
    } catch (err) {
      showToast('Could not register RSVP.', 'error');
      throw err;
    }
  };

  // Add Customer Review
  const handleAddReview = async (reviewData: { customerName: string; rating: number; comment: string; favoriteItem?: string }) => {
    try {
      const created = await api.addReview(reviewData);
      setReviews((prev) => [created, ...prev]);
      showToast('Thank you! Your review is now published.');
    } catch (err) {
      showToast('Could not save review.', 'error');
    }
  };

  // Admin Handlers
  const handleAdminOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      showToast(`Order #${updated.orderNumber} status updated to: ${status}`);
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleAdminMenuItemStock = async (itemId: string, inStock: boolean) => {
    try {
      const updated = await api.updateMenuItemStock(itemId, inStock);
      setMenuItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      showToast(`${updated.name} is now ${inStock ? 'In Stock' : 'Out of Stock'}`);
    } catch (err) {
      showToast('Failed to update stock.', 'error');
    }
  };

  const handleAdminSaveMenuItem = async (item: Partial<MenuItem>) => {
    try {
      const saved = await api.saveMenuItem(item);
      setMenuItems((prev) => {
        const exists = prev.some((i) => i.id === saved.id);
        if (exists) {
          return prev.map((i) => (i.id === saved.id ? saved : i));
        }
        return [saved, ...prev];
      });
      showToast(`Saved "${saved.name}" to menu.`);
    } catch (err) {
      showToast('Failed to save menu item.', 'error');
    }
  };

  const handleAdminDeleteMenuItem = async (itemId: string) => {
    try {
      await api.deleteMenuItem(itemId);
      setMenuItems((prev) => prev.filter((i) => i.id !== itemId));
      showToast('Item deleted from menu.', 'info');
    } catch (err) {
      showToast('Failed to delete item.', 'error');
    }
  };

  const handleAdminReservationStatus = async (resId: string, status: 'confirmed' | 'cancelled') => {
    try {
      const updated = await api.updateReservationStatus(resId, status);
      setReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      showToast(`Reservation #${updated.reservationCode} marked as ${status}.`);
    } catch (err) {
      showToast('Failed to update reservation.', 'error');
    }
  };

  const handleAdminSaveEvent = async (eventData: Partial<CafeEvent>) => {
    try {
      const saved = await api.saveEvent(eventData);
      setEvents((prev) => {
        const exists = prev.some((e) => e.id === saved.id);
        if (exists) {
          return prev.map((e) => (e.id === saved.id ? saved : e));
        }
        return [saved, ...prev];
      });
      showToast(eventData.id ? `Event "${saved.title}" updated!` : `Event "${saved.title}" added to calendar!`);
    } catch (err) {
      showToast('Failed to save event.', 'error');
      throw err;
    }
  };

  const handleAdminDeleteEvent = async (eventId: string) => {
    try {
      await api.deleteEvent(eventId);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      showToast('Event removed successfully.', 'info');
    } catch (err) {
      showToast('Failed to remove event.', 'error');
      throw err;
    }
  };

  const handleAdminRemoveRSVP = async (eventId: string, rsvpIndex: number) => {
    try {
      const updated = await api.removeRSVP(eventId, rsvpIndex);
      setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      showToast('RSVP removed and guest spots restored.');
    } catch (err) {
      showToast('Failed to remove RSVP.', 'error');
      throw err;
    }
  };

  // Trigger tracking modal with specific ID
  const openOrderTracker = (orderNumber?: string) => {
    if (orderNumber) setTrackingOrderNumber(orderNumber);
    setIsOrderTrackingOpen(true);
  };

  const totalCartCount = cartItems.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2A1E17] flex flex-col font-sans selection:bg-[#D4A373]/30">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        currentView={activeView}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTrackOrder={() => openOrderTracker()}
        onOpenTracking={() => openOrderTracker()}
        onOpenAccount={() => handleNavigate('account')}
        user={user}
        isAdminMode={isAdminMode}
        isAdmin={isAdminMode}
        onToggleAdminMode={() => {
          const nextState = !isAdminMode;
          setIsAdminMode(nextState);
          setActiveView(nextState ? 'admin' : 'home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onToggleAdmin={() => {
          const nextState = !isAdminMode;
          setIsAdminMode(nextState);
          setActiveView(nextState ? 'admin' : 'home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            {/* 2. Hero Section */}
            <Hero
              onOrderNow={() => handleNavigate('menu')}
              onReserveTable={() => setIsReservationOpen(true)}
            />

            {/* 4. Featured Menu */}
            <FeaturedMenu
              items={menuItems}
              onSelectItem={(item) => setSelectedProduct(item)}
              onAddToCart={(item) => handleAddToCart(item, 1)}
              onViewFullMenu={() => handleNavigate('menu')}
            />

            {/* 5. Today's Special */}
            <TodaySpecial
              specialItem={menuItems.find((i) => i.isSpecial) || menuItems[4] || menuItems[0]}
              items={menuItems}
              onSelectItem={(item) => setSelectedProduct(item)}
              onAddToCart={(item) => handleAddToCart(item, 1)}
            />

            {/* 6. Our Services */}
            <OurServices
              onNavigateMenu={() => handleNavigate('menu')}
              onOpenReservation={() => setIsReservationOpen(true)}
              onNavigateEvents={() => handleNavigate('events')}
            />

            {/* 7. About Us Section */}
            <AboutSection
              onLearnMore={() => handleNavigate('about')}
              onOpenGallery={() => handleNavigate('gallery')}
            />

            {/* 9. Latest News */}
            <LatestNews />

            {/* 10. Customer Reviews */}
            <CustomerReviews
              reviews={reviews}
              onAddReview={handleAddReview}
            />
          </>
        )}

        {activeView === 'menu' && (
          <MenuPage
            items={menuItems}
            onSelectItem={(item) => setSelectedProduct(item)}
            onAddToCart={(item) => handleAddToCart(item, 1)}
          />
        )}

        {activeView === 'gallery' && (
          <GalleryPage />
        )}

        {activeView === 'events' && (
          <EventsPage
            events={events}
            onRSVP={handleRSVP}
          />
        )}

        {activeView === 'about' && (
          <AboutPage
            onNavigateMenu={() => handleNavigate('menu')}
            onNavigateGallery={() => handleNavigate('gallery')}
          />
        )}

        {activeView === 'contact' && (
          <ContactPage />
        )}

        {activeView === 'account' && (
          <CustomerDashboard
            user={user}
            orders={orders}
            menuItems={menuItems}
            onReorder={handleReorder}
            onAddToCart={(item) => handleAddToCart(item, 1)}
            onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
            onTrackOrder={openOrderTracker}
          />
        )}

        {activeView === 'admin' && (
          <AdminDashboard
            stats={adminStats}
            orders={orders}
            menuItems={menuItems}
            reservations={reservations}
            events={events}
            onUpdateOrderStatus={handleAdminOrderStatus}
            onUpdateMenuItemStock={handleAdminMenuItemStock}
            onSaveMenuItem={handleAdminSaveMenuItem}
            onDeleteMenuItem={handleAdminDeleteMenuItem}
            onUpdateReservationStatus={handleAdminReservationStatus}
            onSaveEvent={handleAdminSaveEvent}
            onDeleteEvent={handleAdminDeleteEvent}
            onRemoveRSVP={handleAdminRemoveRSVP}
            onAddRSVP={handleRSVP}
            onExitAdmin={() => {
              setIsAdminMode(false);
              setActiveView('home');
            }}
          />
        )}
      </main>

      {/* 23. Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      {/* Overlays and Modals */}
      {/* 13. Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onContinueShopping={() => {
          setIsCartOpen(false);
          handleNavigate('menu');
        }}
      />

      {/* 14. Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        user={user}
        onCompleteOrder={handleCompleteOrder}
        onTrackOrder={(orderNumber) => openOrderTracker(orderNumber)}
      />

      {/* 12. Product / Menu Item Details & Customizer Modal */}
      <ProductDetailModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* 15. Table Reservation Modal */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        user={user}
        onBookReservation={handleBookReservation}
      />

      {/* 16. Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
        initialOrderNumber={trackingOrderNumber}
      />

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={menuItems}
        onSelectItem={(item) => setSelectedProduct(item)}
        onAddToCart={(item) => handleAddToCart(item, 1)}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          notification={toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
