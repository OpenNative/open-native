import RNTestModule from '../index'

test('getConstants', () => {
  expect(() => RNTestModule.getConstants()).not.toThrow()
})
