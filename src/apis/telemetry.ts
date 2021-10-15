import axiosInstance from './axios';
import { config } from 'utils/config';
import { differenceInSeconds } from 'date-fns';
import { randomString } from 'utils/string';
import { ACTIONS, FEEDBACK_ACTIONS, FEEDBACK_TYPES } from './telemetry.helper';

export {
  ACTIONS,
  FEEDBACK_ACTIONS,
  FEEDBACK_TYPES
};

let lastSessionTime = new Date();
let sessionIdentifier = randomString();

export const verifySession = async () => {
  if (!lastSessionTime || differenceInSeconds(new Date(), lastSessionTime) > 60) {
    lastSessionTime = new Date();
    sessionIdentifier = randomString();
    await sessionStart();
  }
};

function sendEvent(params: Object): Promise<Object> | undefined {
  if (config.DEBUG) { return; }
  return new Promise((resolve, reject) => {
    const url = `/events/v2?access_token=${config.ACCESS_TOKEN}`;
    return axiosInstance({
      baseURL: config.TELEMETRY_URL,
      isBlob: true
    }).post(url, params).then((res: any) => {
      resolve(res.data);
    }).catch((error: Error) => {
      console.error(error);
      reject(error);
    });
  });
};

export async function sessionStart(): Promise<any> {
  const params = {
    sessionIdentifier,
    event: 'adMetrics.sessionStart',
    bucket: 'undefined',
    created: new Date().toISOString(),
  };
  return sendEvent([params]);
}

export async function sendSelection(adid: string, zoomLevel: number): Promise<any> {
  const params = {
    sessionIdentifier,
    event: 'adMetrics.select',
    adid,
    zoomLevel,
    created: new Date().toISOString(),
  };
  await verifySession();
  return sendEvent([params]);
}

export async function sendDeselection(adid: string): Promise<any> {
  const params = {
    sessionIdentifier,
    event: 'adMetrics.deselect',
    adid,
    created: new Date().toISOString(),
  };
  await verifySession();
  return sendEvent([params]);
}

export async function sendVisibilities(
  features: TelemetryAPI.Feature[]
): Promise<any> {
  const params = features.map(({
    adid,
    visibleStartTime,
    visibleEndTime
  }) => ({
    sessionIdentifier,
    event: 'adMetrics.visible',
    adid,
    visibleStartTime,
    visibleEndTime,
    created: new Date().toISOString(),
  }));
  await verifySession();
  return sendEvent(params);
}

export async function sendAction(
  adid: string,
  action: TelemetryAPI.Actions
): Promise<any> {
  const params = {
    sessionIdentifier,
    event: 'adMetrics.callToAction',
    adid,
    action,
    created: new Date().toISOString(),
  };
  await verifySession();
  return sendEvent([params]);
}

export async function sendFeedback(
  adid: string,
  action: TelemetryAPI.FeedbackActions,
  type: TelemetryAPI.FeedbackTypes
): Promise<any> {
  const params = {
    sessionIdentifier,
    event: 'adMetrics.feedback',
    adid,
    action,
    type,
    description: '',
    created: new Date().toISOString(),
  };
  await verifySession();
  return sendEvent([params]);
}
