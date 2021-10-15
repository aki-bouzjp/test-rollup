import { ACTIONS, FEEDBACK_ACTIONS, FEEDBACK_TYPES } from './telemetry.helper';
export { ACTIONS, FEEDBACK_ACTIONS, FEEDBACK_TYPES };
export declare const verifySession: () => Promise<void>;
export declare function sessionStart(): Promise<any>;
export declare function sendSelection(adid: string, zoomLevel: number): Promise<any>;
export declare function sendDeselection(adid: string): Promise<any>;
export declare function sendVisibilities(features: TelemetryAPI.Feature[]): Promise<any>;
export declare function sendAction(adid: string, action: TelemetryAPI.Actions): Promise<any>;
export declare function sendFeedback(adid: string, action: TelemetryAPI.FeedbackActions, type: TelemetryAPI.FeedbackTypes): Promise<any>;
