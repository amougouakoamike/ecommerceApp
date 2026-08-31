import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { ProductCardProps } from '@/constants/types'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'
import { useWishlist } from '@/context/WishListContext'

const PRODUCT_IMAGE_POOL = [
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img2_1.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img3.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img5.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img7.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img9.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img10.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img13.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img16.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img18.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img20.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img22.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img23.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img29.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img31.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img40.png',
  'https://raw.githubusercontent.com/avinashdm/gs-images/main/forever/p_img45.png',
];

const getProductImage = (product: ProductCardProps['product']) => {
  const seed = `${product._id}-${product.name}-${product.category}`;
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const safeHash = Math.abs(hash);

  if (product.images && product.images.length > 0) {
    return product.images[safeHash % product.images.length] || product.images[0];
  }

  return PRODUCT_IMAGE_POOL[safeHash % PRODUCT_IMAGE_POOL.length];
};

const ProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isLiked = isInWishlist(product._id);

  const handleProductPress = () => {
    router.push({
      pathname: '/product/[id]',
      params: { id: product._id },
    });
  };

  return (
    <TouchableOpacity
      className='w-[48%] mb-4 bg-white rounded-lg overflow-hidden'
      onPress={handleProductPress}
      activeOpacity={0.9}
    >
      <View className='relative h-56 w-full bg-gray-100'>
        <Image source={{ uri: getProductImage(product) }} className='w-full h-full' resizeMode='cover' />

        <TouchableOpacity
          className='absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-sm'
          onPress={(event) => {
            event.stopPropagation();
            toggleWishlist(product);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20} color={isLiked ? COLORS.accent : COLORS.primary} />
        </TouchableOpacity>

        {product.isFeatured && (
          <View className='absolute top-2 left-2 bg-black px-2 py-1 rounded'>
            <Text className='text-white text-xs font-bold uppercase'>Featured</Text>
          </View>
        )}
      </View>

      <View className='p-3'>
        <View className='flex-row items-center mb-1'>
          <Ionicons name='star' size={14} color="#FFD700" />
          <Text className='text-secondary text-xs ml-1'>4.6</Text>
        </View>
        <Text className='text-primary font-medium text-sm mb-1' numberOfLines={1}>{product.name}</Text>
        <View className='flex-row items-center'>
          <Text className='text-primary font-bold text-base'>${product.price.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ProductCard