import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { RuntimeConfigService } from './runtime-config.service';

export function MSALInstanceFactory(rcs: RuntimeConfigService): IPublicClientApplication {
  return new PublicClientApplication(rcs.configData?.msal);
}

export function MSALGuardConfigFactory(rcs: RuntimeConfigService): MsalGuardConfiguration {
  return { ...rcs.configData?.guard };
}

export function MSALInterceptorConfigFactory(rcs: RuntimeConfigService): MsalInterceptorConfiguration {
  return {
    interactionType: rcs.configData?.interceptor.interactionType,
    protectedResourceMap: new Map(rcs.configData?.interceptor.protectedResourceMap)
  };
}
export async function initializeMsalInstance(
  rcs: RuntimeConfigService
): Promise<IPublicClientApplication> {
  const cfg = rcs.configData!; // assume config is loaded
  const instance = new PublicClientApplication(cfg?.msal);

  // If initialize() exists, await it (newer MSAL versions)
  if (typeof (instance as any).initialize === 'function') {
    await (instance as any).initialize();
  }

  // Optionally, handle redirect promise if using redirect flows
  await instance.handleRedirectPromise();

  return instance;
}
