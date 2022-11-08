import React, { useEffect } from 'react'
import { Button, NativeModules, Text, View } from 'react-native'

async function measure(name: string, action: () => Promise<void>) {
  const start = performance.now()

  await action()

  const stop = performance.now()
  console.log(`${stop - start} ms (${name})`)
}

const App = () => {
  useEffect(() => {
    /**
     * See available methods on the RNTestModule in
     * react native console.
     */
    console.log('RNTestModule: ', typeof NativeModules?.RNTestModule)
  }, [])
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
          marginBottom: 10,
        }}
      >
        This is a basic react native app to ensure the module is functional in
        react-native as it is in nativescript.
      </Text>

      <Button
        title='Test Promise'
        onPress={() => {
          const testPromise = async () => {
            for (let i = 0; i < 5000; i++) {
              await NativeModules.RNTestModuleAliased.testPromise()
            }
          }
          measure('promise', testPromise)
        }}
      />
    </View>
  )
}

export default App
