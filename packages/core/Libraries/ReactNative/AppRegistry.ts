import NativeHeadlessJsTaskSupport from './NativeHeadlessJsTaskSupport';
import { Platform } from '../Utilities/Platform';

type Task = (taskData: any) => Promise<void>;
export type TaskProvider = () => Task;
type TaskCanceller = () => void;
type TaskCancelProvider = () => TaskCanceller;

const taskProviders: Map<string, TaskProvider> = new Map();
const taskCancelProviders: Map<string, TaskCancelProvider> = new Map();

class _AppRegistry {
  public appRegistryJSModule: com.facebook.react.modules.appregistry.AppRegistry;
  constructor() {
    this.appRegistryJSModule =
      Platform.OS === 'ios'
        ? null
        : new com.facebook.react.modules.appregistry.AppRegistry({
            runApplication(param0, param1) {
              console.log('AppRegistry.runApplication unimplemented');
            },
            startHeadlessTask(taskId, taskKey, data) {
              // Run on next event loop
              setTimeout(() => {
                const taskProvider = taskProviders.get(taskKey);
                if (!taskProvider) {
                  console.warn(`No task registered for key ${taskKey}`);
                  if (NativeHeadlessJsTaskSupport) {
                    NativeHeadlessJsTaskSupport.notifyTaskFinished(taskId);
                  }
                  return;
                }
                taskProvider()(data)
                  .then(() => {
                    if (NativeHeadlessJsTaskSupport) {
                      NativeHeadlessJsTaskSupport.notifyTaskFinished(taskId);
                    }
                  })
                  .catch((reason) => {
                    console.error(reason);
                    if (NativeHeadlessJsTaskSupport) {
                      NativeHeadlessJsTaskSupport.notifyTaskRetry(taskId).then(
                        (retryPosted) => {
                          if (!retryPosted) {
                            NativeHeadlessJsTaskSupport.notifyTaskFinished(
                              taskId
                            );
                          }
                        }
                      );
                    }
                  });
              }, 16);
            },
            unmountApplicationComponentAtRootTag(param0) {
              console.log(
                'AppRegistry.unmountApplicationComponentAtRootTag unimplemented'
              );
            },
          });
  }

  /**
   * Register a headless task. A headless task is a bit of code that runs without a UI.
   *
   * See https://reactnative.dev/docs/appregistry#registerheadlesstask
   *
   * @platform android
   */
  registerHeadlessTask(taskKey: string, taskProvider: TaskProvider): void {
    this.registerCancellableHeadlessTask(taskKey, taskProvider, () => () => {
      /* Cancel is no-op */
    });
  }

  /**
   * Register a cancellable headless task. A headless task is a bit of code that runs without a UI.
   *
   * See https://reactnative.dev/docs/appregistry#registercancellableheadlesstask
   */
  registerCancellableHeadlessTask(
    taskKey: string,
    taskProvider: TaskProvider,
    taskCancelProvider: TaskCancelProvider
  ): void {
    if (taskProviders.has(taskKey)) {
      console.warn(
        `registerHeadlessTask or registerCancellableHeadlessTask called multiple times for same key '${taskKey}'`
      );
    }
    taskProviders.set(taskKey, taskProvider);
    taskCancelProviders.set(taskKey, taskCancelProvider);
  }

  /**
   * Only called from native code. Cancels a headless task.
   *
   * See https://reactnative.dev/docs/appregistry#cancelheadlesstask
   * @platform android
   */
  cancelHeadlessTask(taskId: number, taskKey: string): void {
    const taskCancelProvider = taskCancelProviders.get(taskKey);
    if (!taskCancelProvider) {
      throw new Error(`No task canceller registered for key '${taskKey}'`);
    }
    taskCancelProvider()();
  }
}

export const AppRegistry = new _AppRegistry();
