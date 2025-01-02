import { ComponentType } from 'react';
import BluetoothChecker from './component';

export function withBleChecker<P extends object>(Component: ComponentType<P>): ComponentType<P> {
  return (props: P) => <BluetoothChecker>{<Component {...props} />}</BluetoothChecker>;
}
