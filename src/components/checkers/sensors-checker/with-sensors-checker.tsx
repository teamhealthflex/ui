import { ComponentType } from 'react';
import SensorsChecker from './component';

export function withSensorsChecker<P extends object>(
  Component: ComponentType<P>,
): ComponentType<P> {
  return (props: P) => <SensorsChecker>{<Component {...props} />}</SensorsChecker>;
}
