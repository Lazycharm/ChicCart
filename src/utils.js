export function createPageUrl(pageName) {
  const routes = {
    'Home': '/',
    'Shop': '/shop',
    'ProductDetail': '/product',
    'Cart': '/cart',
    'Checkout': '/checkout',
    'Orders': '/orders',
    'OrderConfirmation': '/order-confirmation',
    'Wishlist': '/wishlist',
    'About': '/about',
    'Contact': '/contact',
    'FAQ': '/faq',
    'Privacy': '/privacy',
    'Terms': '/terms',
    'Returns': '/returns',
    'Login': '/login',
    'AdminDashboard': '/admin',
    'AdminProducts': '/admin/products',
    'AdminOrders': '/admin/orders',
    'AdminCustomers': '/admin/customers',
    'AdminCoupons': '/admin/coupons',
    'AdminBanners': '/admin/banners',
  };
  return routes[pageName] || '/';
}

