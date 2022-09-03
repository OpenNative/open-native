/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from 'react'
import { Text, View } from 'react-native'

import RNTestModule from '@ammarahm-ed/react-native-module-test'

const App = () => {
  useEffect(() => {
    /**
     * See available methods on the RNTestModule in
     * react native console.
     */
    console.log(RNTestModule)
  })

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 50,
        backgroundColor: 'white',
      }}
    >
      <Text
        style={{
          fontSize: 25,
          color: '#3a86ff',
        }}
      >
        RNTestModuleApp
      </Text>
      <Text
        style={{
          color: 'gray',
          fontSize: 18,
          textAlign: 'justify',
        }}
      >
        This is a basic react native app to ensure the module is functional in
        react-native as it is in nativescript.
      </Text>
    </View>
  )
}

export default App
