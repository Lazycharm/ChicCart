import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { getProductById, filterProducts } from '@/services/products';
import { getReviews } from '@/services/reviews';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Share2, Truck, RotateCcw, Shield, Star, 
  Plus, Minus, ChevronLeft, ChevronRight, Check,
  Loader2, ShoppingBag, ZoomIn
} from 'lucide-react';
import { useCart } from '@/components/ui/CartContext';
import { useWishlist } from '@/components/ui/WishlistContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ProductCard from '@/components/product/ProductCard';

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  const { addToCart, setIsOpen } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.category],
    queryFn: () => filterProducts({ category: product.category }),
    enabled: !!product?.category
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => getReviews({ product_id: productId }),
    enabled: !!productId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button asChild>
          <Link to={createPageUrl('Shop')}>Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const discount = product.sale_price 
    ? Math.round((1 - product.sale_price / product.price) * 100) 
    : 0;

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_image: product.images?.[0] || '',
      price: product.sale_price || product.price,
      size: selectedSize,
      color: selectedColor?.name || '',
      quantity
    });
    toast.success('Added to cart!');
    setIsOpen(true);
  };

  const handleWishlist = () => {
    toggleWishlist(product.id);
    toast.success(isInWishlist(product.id) ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: product.name,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to={createPageUrl('Home')} className="text-gray-500 hover:text-black">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to={createPageUrl('Shop')} className="text-gray-500 hover:text-black">Shop</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div 
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in"
              onClick={() => setIsZoomed(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={product.images?.[selectedImage] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_new && (
                  <span className="px-3 py-1 bg-black text-white text-sm font-medium rounded-full">NEW</span>
                )}
                {discount > 0 && (
                  <span className="px-3 py-1 bg-rose-500 text-white text-sm font-medium rounded-full">-{discount}%</span>
                )}
              </div>

              {/* Zoom Icon */}
              <button className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100">
                <ZoomIn className="w-5 h-5" />
              </button>

              {/* Navigation */}
              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => (prev - 1 + product.images.length) % product.images.length); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedImage(prev => (prev + 1) % product.images.length); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      idx === selectedImage ? 'border-black' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Title & Rating */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(product.rating) 
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-500">({product.reviews_count || reviews.length} reviews)</span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold">
                  ${(product.sale_price || product.price).toFixed(2)}
                </span>
                {product.sale_price && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="px-3 py-1 bg-rose-100 text-rose-600 font-medium rounded-full">
                      Save ${(product.price - product.sale_price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              )}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">
                    Color: <span className="text-gray-500">{selectedColor?.name || 'Select'}</span>
                  </h3>
                  <div className="flex gap-3">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor?.name === color.name 
                            ? 'border-black scale-110' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {selectedColor?.name === color.name && (
                          <Check className={`absolute inset-0 m-auto w-5 h-5 ${
                            ['#FFFFFF', '#FFF', 'white'].includes(color.hex) ? 'text-black' : 'text-white'
                          }`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div>
                  <h3 className="font-medium mb-3">
                    Size: <span className="text-gray-500">{selectedSize || 'Select'}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                          selectedSize === size 
                            ? 'bg-black text-white border-black' 
                            : 'hover:border-black'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="font-medium mb-3">Quantity</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-3 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {product.stock && (
                    <span className="text-sm text-gray-500">{product.stock} items available</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 h-14 text-lg bg-black hover:bg-gray-800"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <button
                  onClick={handleWishlist}
                  className={`p-4 border rounded-xl transition-colors ${
                    isInWishlist(product.id) 
                      ? 'bg-rose-500 text-white border-rose-500' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-4 border rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y">
                <div className="flex flex-col items-center text-center gap-2">
                  <Truck className="w-6 h-6" />
                  <span className="text-sm font-medium">Free Shipping</span>
                  <span className="text-xs text-gray-500">On orders $50+</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <RotateCcw className="w-6 h-6" />
                  <span className="text-sm font-medium">Easy Returns</span>
                  <span className="text-xs text-gray-500">30-day policy</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Shield className="w-6 h-6" />
                  <span className="text-sm font-medium">Secure Checkout</span>
                  <span className="text-xs text-gray-500">SSL Encrypted</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((review) => (
                <div key={review.id} className="bg-gray-50 p-6 rounded-2xl">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">{review.comment}</p>
                  <p className="font-medium">{review.user_name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.filter(p => p.id !== product.id).length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.filter(p => p.id !== product.id).slice(0, 4).map((p, idx) => (
                <ProductCard key={p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={product.images?.[selectedImage] || ''}
              alt={product.name}
              className="max-w-full max-h-[90vh] object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}