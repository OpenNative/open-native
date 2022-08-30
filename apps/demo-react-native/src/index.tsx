import { NativeModules } from 'react-native'

const RNTestModule: {
  getConstants: () => {
    SHORT: number
    LONG: number
  }
  show: (message: string, duration: number) => void
} = NativeModules.RNTestModule

export default RNTestModule
