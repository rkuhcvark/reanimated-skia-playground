/** @format */

import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { Routes } from './src/Routes'

import { createStackNavigator } from '@react-navigation/stack'
import Examples from './src/Examples/Examples'
import Speedometer from './src/Speedometer/Speedometer'
import { NavigationContainer } from '@react-navigation/native'

const Stack = createStackNavigator<Routes>()

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName='Speedometer'>
      <Stack.Screen name='Examples' component={Examples} />
      <Stack.Screen
        name='Speedometer'
        component={Speedometer}
        options={{
          title: '💯 Speedometer',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
)

export default function App() {
  return <AppNavigator />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
