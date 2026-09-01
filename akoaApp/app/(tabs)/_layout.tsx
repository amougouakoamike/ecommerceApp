import { Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons,Feather } from '@expo/vector-icons'
import {COLORS} from '@/constants'
import { useCart } from '@/context/CartContext'

const TabLayout = () => {

    const {cartItems} = useCart()

  return (
   <Tabs
   screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: COLORS.primary,
    tabBarInactiveTintColor: '#CDCDE0',
    tabBarShowLabel: false,
    tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth:1,
        borderTopColor: '#F0F0F0',
        height: 56,
        paddingTop:8
    }

   }}
   >
    <Tabs.Screen name='index' options={{tabBarIcon: ({color, focused}) => 
        <Ionicons name={focused ? 'home' : 'home-outline'} size={26} color={color} /> 
    }}/>

    <Tabs.Screen name='cart' options={{tabBarIcon: ({color, focused}) =>(
        <View className='relative'>

        <Ionicons name={focused ? 'cart' : 'cart-outline'} size={26} color={color} /> 
        <View className='absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 items-center justify-center'>
            <Text className='text-white text-xs font-bold'>{cartItems.length > 0 && cartItems.length}</Text>
        </View>
        </View>
    ) 
      }}/>
        <Tabs.Screen name='favorites' options={{tabBarIcon: ({color, focused}) => 
        <Ionicons name={focused ? 'heart' : 'heart-outline'} size={26} color={color} /> 
        }}/>
         <Tabs.Screen name='profile' options={{tabBarIcon: ({color, focused}) => 
        <Ionicons name={focused ? 'person' : 'person-outline'} size={26} color={color} /> 
        }}/>
   </Tabs>
  )
}

export default TabLayout