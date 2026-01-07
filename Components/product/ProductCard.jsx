import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { useCart } from '@/components/ui/CartContext';
import { useWishlist } from '@/components/ui/WishlistContext';
import { toast } from 'sonner';

export default function ProductCard({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const { addToCart, setIsOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const discount = product.sale_price 
    ? Math.round((1 - product.sale_price / product.price) * 100) 
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast.success(isInWishlist(product.id) ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Link 
        to={createPageUrl('ProductDetail') + `?id=${product.id}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setImageIndex(0);
        }}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
          {/* Main Image */}
          <motion.img
            src={product.images?.[imageIndex] || product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400'}
            alt={product.name}
            className="w-full h-full object-cover"
            initial={false}
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <span className="px-2 py-1 bg-black text-white text-xs font-medium rounded-full">
                NEW
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-1 bg-rose-500 text-white text-xs font-medium rounded-full">
                -{discount}%
              </span>
            )}
            {product.is_flash_deal && (
              <span className="px-2 py-1 bg-amber-500 text-white text-xs font-medium rounded-full animate-pulse">
                🔥 FLASH
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-colors ${
              isInWishlist(product.id) 
                ? 'bg-rose-500 text-white' 
                : 'bg-white text-gray-600 hover:bg-rose-50 hover:text-rose-500'
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </motion.button>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            className="absolute bottom-3 left-3 right-3 flex gap-2"
          >
            <button
              onClick={handleQuickAdd}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Quick Add
            </button>
            <Link
              to={createPageUrl('ProductDetail') + `?id=${product.id}`}
              className="p-3 bg-white text-gray-800 rounded-xl hover:bg-gray-100 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Image Dots */}
          {product.images?.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {product.images.slice(0, 4).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setImageIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === imageIndex ? 'bg-black' : 'bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-1">
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating) 
                        ? 'text-amber-400 fill-amber-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviews_count || 0})</span>
            </div>
          )}

          {/* Name */}
          <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-rose-500 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">
              ${(product.sale_price || product.price).toFixed(2)}
            </span>
            {product.sale_price && (
              <span className="text-sm text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="flex gap-1 pt-1">
              {product.colors.slice(0, 5).map((color, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-gray-500">+{product.colors.length - 5}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}