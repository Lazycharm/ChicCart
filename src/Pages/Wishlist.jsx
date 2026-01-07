import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlist } from '@/components/ui/WishlistContext';
import { useCart } from '@/components/ui/CartContext';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/products';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, setIsOpen } = useCart();

  const { data: products = [] } = useQuery({
    queryKey: ['wishlist-products', wishlist],
    queryFn: async () => {
      if (wishlist.length === 0) return [];
      const allProducts = await getProducts();
      return allProducts.filter(p => wishlist.includes(p.id));
    },
    enabled: wishlist.length > 0
  });

  const handleAddToCart = (product) => {
    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_image: product.images?.[0] || '',
      price: product.sale_price || product.price,
      size: product.sizes?.[0] || '',
      color: product.colors?.[0]?.name || '',
      quantity: 1
    });
    toast.success('Added to cart!');
    setIsOpen(true);
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center px-4">
          <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-3">Your wishlist is empty</h1>
          <p className="text-gray-500 mb-6">Save items you love by clicking the heart icon</p>
          <Button size="lg" asChild>
            <Link to={createPageUrl('Shop')}>
              Start Shopping <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl lg:text-4xl font-bold mb-2"
        >
          My Wishlist
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 mb-8"
        >
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm group"
              >
                <Link to={createPageUrl('ProductDetail') + `?id=${product.id}`}>
                  <div className="relative aspect-[3/4]">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.sale_price && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-rose-500 text-white text-xs font-medium rounded-full">
                        -{Math.round((1 - product.sale_price / product.price) * 100)}%
                      </span>
                    )}
                  </div>
                </Link>
                
                <div className="p-4">
                  <Link 
                    to={createPageUrl('ProductDetail') + `?id=${product.id}`}
                    className="font-medium hover:text-rose-500 transition-colors line-clamp-2"
                  >
                    {product.name}
                  </Link>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold">
                      ${(product.sale_price || product.price).toFixed(2)}
                    </span>
                    {product.sale_price && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-black hover:bg-gray-800"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => {
                        removeFromWishlist(product.id);
                        toast.success('Removed from wishlist');
                      }}
                      className="text-gray-400 hover:text-red-500 hover:border-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}