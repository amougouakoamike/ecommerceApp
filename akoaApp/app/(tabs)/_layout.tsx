import { View } from 'react-native'
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
        {cartItems.length > 0 && (
            <View className='absolute -top-1 -right-1 bg-red-500 rounded-full w-2.5 h-2.5' />
        )}
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