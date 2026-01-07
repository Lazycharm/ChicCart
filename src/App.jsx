import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layouts';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import Home from './Pages/Home';
import Shop from './Pages/Shop';
import ProductDetail from './Pages/ProductDetail';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Orders from './Pages/Orders';
import OrderConfirmation from './Pages/OrderConfirmation';
import Wishlist from './Pages/Wishlist';
import About from './Pages/About';
import Contact from './Pages/Contact';
import FAQ from './Pages/FAQ';
import Privacy from './Pages/Privacy';
import Terms from './Pages/Terms';
import Returns from './Pages/Returns';
import AdminDashboard from './Pages/AdminDashboard';
import AdminProducts from './Pages/AdminProducts';
import AdminOrders from './Pages/AdminOrders';
import AdminCustomers from './Pages/AdminCustomers';
import AdminCoupons from './Pages/AdminCoupons';
import AdminBanners from './Pages/AdminBanners';
import AdminBusiness from './Pages/AdminBusiness';
import AdminSettings from './Pages/AdminSettings';
import AdminPages from './Pages/AdminPages';
import AdminCategories from './Pages/AdminCategories';
import AdminPayments from './Pages/AdminPayments';
import AdminShipping from './Pages/AdminShipping';
import AdminTaxes from './Pages/AdminTaxes';
import AdminBlog from './Pages/AdminBlog';
import AdminAnalytics from './Pages/AdminAnalytics';
import Login from './Pages/Login';

// Suppress React Router v7 warnings (optional)
const routerConfig = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
};

function App() {
  return (
    <BrowserRouter future={routerConfig.future}>
      <Routes>
        <Route path="/" element={<Layout currentPageName="Home"><Home /></Layout>} />
        <Route path="/shop" element={<Layout currentPageName="Shop"><Shop /></Layout>} />
        <Route path="/product" element={<Layout currentPageName="ProductDetail"><ProductDetail /></Layout>} />
        <Route path="/cart" element={<Layout currentPageName="Cart"><Cart /></Layout>} />
        <Route path="/checkout" element={<Layout currentPageName="Checkout"><Checkout /></Layout>} />
        <Route path="/orders" element={<Layout currentPageName="Orders"><ProtectedRoute><Orders /></ProtectedRoute></Layout>} />
        <Route path="/order-confirmation" element={<Layout currentPageName="OrderConfirmation"><OrderConfirmation /></Layout>} />
        <Route path="/wishlist" element={<Layout currentPageName="Wishlist"><Wishlist /></Layout>} />
        <Route path="/about" element={<Layout currentPageName="About"><About /></Layout>} />
        <Route path="/contact" element={<Layout currentPageName="Contact"><Contact /></Layout>} />
        <Route path="/faq" element={<Layout currentPageName="FAQ"><FAQ /></Layout>} />
        <Route path="/privacy" element={<Layout currentPageName="Privacy"><Privacy /></Layout>} />
        <Route path="/terms" element={<Layout currentPageName="Terms"><Terms /></Layout>} />
        <Route path="/returns" element={<Layout currentPageName="Returns"><Returns /></Layout>} />
        <Route path="/admin" element={<Layout currentPageName="AdminDashboard"><ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute></Layout>} />
        <Route path="/admin/products" element={<Layout currentPageName="AdminProducts"><ProtectedRoute requireAdmin><AdminProducts /></ProtectedRoute></Layout>} />
        <Route path="/admin/orders" element={<Layout currentPageName="AdminOrders"><ProtectedRoute requireAdmin><AdminOrders /></ProtectedRoute></Layout>} />
        <Route path="/admin/customers" element={<Layout currentPageName="AdminCustomers"><ProtectedRoute requireAdmin><AdminCustomers /></ProtectedRoute></Layout>} />
        <Route path="/admin/coupons" element={<Layout currentPageName="AdminCoupons"><ProtectedRoute requireAdmin><AdminCoupons /></ProtectedRoute></Layout>} />
        <Route path="/admin/banners" element={<Layout currentPageName="AdminBanners"><ProtectedRoute requireAdmin><AdminBanners /></ProtectedRoute></Layout>} />
        <Route path="/admin/settings" element={<Layout currentPageName="AdminSettings"><ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute></Layout>} />
        <Route path="/admin/pages" element={<Layout currentPageName="AdminPages"><ProtectedRoute requireAdmin><AdminPages /></ProtectedRoute></Layout>} />
        <Route path="/admin/categories" element={<Layout currentPageName="AdminCategories"><ProtectedRoute requireAdmin><AdminCategories /></ProtectedRoute></Layout>} />
        <Route path="/admin/payments" element={<Layout currentPageName="AdminPayments"><ProtectedRoute requireAdmin><AdminPayments /></ProtectedRoute></Layout>} />
        <Route path="/admin/shipping" element={<Layout currentPageName="AdminShipping"><ProtectedRoute requireAdmin><AdminShipping /></ProtectedRoute></Layout>} />
        <Route path="/admin/taxes" element={<Layout currentPageName="AdminTaxes"><ProtectedRoute requireAdmin><AdminTaxes /></ProtectedRoute></Layout>} />
        <Route path="/admin/blog" element={<Layout currentPageName="AdminBlog"><ProtectedRoute requireAdmin><AdminBlog /></ProtectedRoute></Layout>} />
        <Route path="/admin/analytics" element={<Layout currentPageName="AdminAnalytics"><ProtectedRoute requireAdmin><AdminAnalytics /></ProtectedRoute></Layout>} />
        <Route path="/login" element={
          <Layout currentPageName="Login">
            <Login />
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

