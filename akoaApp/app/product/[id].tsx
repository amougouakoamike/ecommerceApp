import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { dummyProducts } from '@/assets/assets';
import { Ionicons } from '@expo/vector-icons';

const ProductDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = dummyProducts.find((item) => item._id === id);

  if (!product) {
    return (
      <SafeAreaView className='flex-1 items-center justify-center bg-white px-6'>
        <Text className='text-lg font-bold text-primary'>Product not found</Text>
        <TouchableOpacity
          className='mt-4 rounded-full bg-black px-5 py-3'
          onPress={() => router.back()}
        >
          <Text className='text-white font-medium'>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className='relative'>
          <TouchableOpacity className='absolute left-4 top-4 z-10 rounded-full bg-white/80 p-3' onPress={() => router.back()}>
            <Ionicons name='arrow-back' size={20} color='#111827' />
          </TouchableOpacity>
          <Image source={{ uri: product.images?.[0] ?? '' }} className='h-96 w-full' resizeMode='cover' />
        </View>

        <View className='px-5 pb-10 pt-6'>
          <Text className='text-2xl font-bold text-primary'>{product.name}</Text>
          <View className='mt-3 flex-row items-center'>
            <Ionicons name='star' size={16} color='#FFD700' />
            <Text className='ml-2 text-sm text-secondary'>4.6</Text>
          </View>
          <Text className='mt-4 text-2xl font-bold text-primary'>${product.price.toFixed(2)}</Text>
          <Text className='mt-4 text-base text-secondary'>{product.description}</Text>

          <View className='mt-6 rounded-2xl bg-gray-100 p-4'>
            <Text className='font-semibold text-primary'>Category</Text>
            <Text className='mt-1 text-secondary'>{product.category}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;
