import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

import { HomeScreen } from '../screens/HomeScreen';
import { PetsScreen } from '../screens/PetsScreen';
import { AddPetScreen } from '../screens/AddPetScreen';
import { PetDetailScreen } from '../screens/PetDetailScreen';
import { DiagnosisScreen } from '../screens/DiagnosisScreen';
import { WalkScreen } from '../screens/WalkScreen';
import { ShopScreen } from '../screens/ShopScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.borderLight,
          paddingBottom: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, string> = {
            Home: focused ? 'home' : 'home-outline',
            Pets: focused ? 'paw' : 'paw-outline',
            Diagnosis: focused ? 'medical' : 'medical-outline',
            Walk: focused ? 'walk' : 'walk-outline',
            Shop: focused ? 'bag-handle' : 'bag-handle-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name] as any} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Pets" component={PetsScreen} />
      <Tab.Screen name="Diagnosis" component={DiagnosisScreen} />
      <Tab.Screen name="Walk" component={WalkScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
          name="AddPet"
          component={AddPetScreen}
          options={{
            headerShown: true,
            title: 'Add New Pet',
            headerTintColor: Colors.primary,
          }}
        />
        <Stack.Screen name="PetDetail" component={PetDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
