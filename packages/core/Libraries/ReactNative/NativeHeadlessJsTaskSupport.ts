import type { TurboModule } from '../TurboModule/RCTExport';
import * as TurboModuleRegistry from '../TurboModule/TurboModuleRegistry';
import { Platform } from '../Utilities/Platform';

export interface Spec extends TurboModule {
  notifyTaskFinished: (taskId: number) => void;
  notifyTaskRetry: (taskId: number) => Promise<boolean>;
}

const HeadlessJSTaskSupportModule =
  Platform.OS === 'ios'
    ? null
    : TurboModuleRegistry.get<Spec>('HeadlessJsTaskSupport');

export default HeadlessJSTaskSupportModule;
