import type { TurboModule } from '../TurboModule/RCTExport';
import * as TurboModuleRegistry from '../TurboModule/TurboModuleRegistry';

export interface Spec extends TurboModule {
  notifyTaskFinished: (taskId: number) => void;
  notifyTaskRetry: (taskId: number) => Promise<boolean>;
}

export default TurboModuleRegistry.get<Spec>('HeadlessJsTaskSupport');
