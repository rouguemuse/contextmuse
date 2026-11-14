import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

const hasConfiguredAppId = Boolean(
  appId &&
  String(appId).trim() &&
  String(appId).trim() !== 'undefined' &&
  String(appId).trim() !== 'null'
);

export const base44 = hasConfiguredAppId
  ? createClient({
      appId,
      token,
      functionsVersion,
      serverUrl: '',
      appBaseUrl,
    })
  : {
      app: {
        getPublicSettings: async () => null,
      },
      auth: {
        me: async () => null,
        logout: () => {},
        redirectToLogin: () => {},
      },
      appLogs: {
        logUserInApp: async () => {},
      },
    };
