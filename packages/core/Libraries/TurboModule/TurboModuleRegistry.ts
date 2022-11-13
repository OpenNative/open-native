import { TurboModule } from './RCTExport';

export const get = <T extends TurboModule>(name: string): T => {
  return global.__turboModulesProxy?.[name];
};

export const getEnforcing = <T extends TurboModule>(name: string): T => {
  return global.__turboModulesProxy?.[name];
};
