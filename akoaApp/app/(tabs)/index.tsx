import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import { BANNERS } from '@/assets/assets'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')

const Home = () => {
  const router = useRouter();
  const [activeBannerIndex, setActiveBannerIndex] = React.useState(0)
  return (
    <SafeAreaView className='flex-1' edges={['top']}>
      <Header title='Forever' showMenu showCart  showLogo />

      <ScrollView className='flex-1 px-4' showsVerticalScrollIndicator={false}>
        {/*Banner slider */}
         <View className='mb-6'>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className='w-full h-48 rounded-xl'
        scrollEventThrottle={16} onScroll={(e)=>{
          const contentOffsetX = e.nativeEvent.contentOffset.x;
          const index = Math.round(contentOffsetX / (width - 32));
          setActiveBannerIndex(index);
        }} pagingEnabled>
          {BANNERS.map((banner, index)=> (
           <View key={index} className='relative w-full h-48 bg-gray-200 overflow-hidden' style={{width: width -32}}>
            <Image source={{uri: banner.image}} className='w-full h-full' resizeMode='cover'/>

           <View className='absolute bottom-4 left-4 z-10'>
             <Text className='text-white text-2xl font-bold'>{banner.title}</Text>
             <Text className='text-white text-sm font-medium'>{banner.subtitle}</Text>
              <TouchableOpacity className='mt-2 bg-white px-4 py-2 rounded-full self-start'>
               <Text className='text-primary font-bold text-xs'>Get Now</Text>
              </TouchableOpacity>
            
           </View>
           <View className='absolute inset-0 bg-black/40'/>
           </View>
          ))}
        </ScrollView>
        {/*Pagination Dots */}
         <View className='flex-row justify-center gap-2'>
          {BANNERS.map((_, index)=> (
            <View key={index} className={`h-2 rounded-full ${index === activeBannerIndex ? 'w-4 bg-black' : 'w-2 bg-gray-300'}`} />
          ))}
         </View>
        
         </View>
     
         
      </ScrollView>


    </SafeAreaView>
  )
}

export default Home