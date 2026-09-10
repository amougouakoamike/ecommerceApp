import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react'
import { useRouter } from 'expo-router'
import Header from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, PROFILE_MENU } from '@/constants';
import { useAuth, useUser } from '@clerk/expo';

const Profile = () => {
  const { isLoaded: authLoaded, signOut } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      router.replace('/sign-in');
    }
  }

  if (!authLoaded || !userLoaded) {
    return (
      <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
        <Header title='Profile' showBack />
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
   
   <SafeAreaView className='flex-1 bg-surface' edges={['top']}>
     <Header title='Profile' showBack/>
     <ScrollView className='flex-1 px-4' contentContainerStyle={!user ? 
     {flex: 1, justifyContent: 'center', alignItems: 'center'} : {paddingTop:16}}>
      {!user ? (
        <View className='items-center w-full'>
            {/* when user is not logged in */}
          <View className='w-24 h-24 rounded-full bg-gray-200 items-center justify-center
          mb-6'>
            <Ionicons name='person' size={40} color={COLORS.secondary}/>
          </View>
          <Text className=' text-primary font-bold text-xl mb-2'>Guest User</Text>
          <Text className='text-secondary text-base mb-8 
          text-center w-3/4 px-4'>Log in to view your profile, orders, and addresses.</Text>
          <TouchableOpacity 
             onPress={()=> router.push('/sign-in')}
          className='bg-black w-3/5 py-3 rounded-full
           items-center shadow-lg' >
            <Text className='text-white font-bold text-lg'>Login or Sign Up</Text>
          </TouchableOpacity>
        </View>
      ):(
        <>
        {/* profile info */}
        <View className='items-center mb-8'>
          <View className='mb-3'>
          <Image source={{ uri: user.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=240' }} 
          className=' size-20 border-2 border-white shadow-sm rounded-full'/>
          </View>
          <Text className='text-xl font-bold'>
            {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Clerk User'}
          </Text>
          <Text className='text-secondary text-sm'>{user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || 'No email available'}</Text>

            {/*. Admin panel button if user is admin */}
            {user.publicMetadata?.role === 'admin' && (
              <TouchableOpacity onPress={()=> router.push('/admin')}
              className='mt-4 bg-black px-6 py-2 rounded-full'>
                <Text className='text-white font-bold'>Admin Panel</Text>
              </TouchableOpacity>
            )}
        </View>
         {/* Menu */}
         <View className='bg-white rounded-xl border border-gray-100/75 p-2 mb-4'>
          {PROFILE_MENU.map((item, index)=> (
            <TouchableOpacity key={item.id} className={`flex-row items-center p-4 
            ${index !== PROFILE_MENU.length - 1 ? "border-b border-gray-100" : ""}`}
            onPress={()=> router.push(item.route as any )}>
              
              <View className=' w-10 h-10 bg-surface rounded-full items-center justify-center mr-4'>
                <Ionicons name={item.icon as any} size={24} color={COLORS.primary}/>
              </View>
              <Text className='flex-1 text-primary font-medium'>
                {item.title}
              </Text>
              <Ionicons name='chevron-forward' size={20} color={COLORS.secondary}/>

            </TouchableOpacity>
          ))}
          </View>
         
         {/* Logout button */}
         <TouchableOpacity className='flex-row items-center justify-center p-4' onPress={handleLogout}>
          <Text className='text-red-500 font-bold ml-2'>Log Out</Text>
         </TouchableOpacity>

        </>
      )}
     </ScrollView>

   </SafeAreaView>
  )
}

export default Profile