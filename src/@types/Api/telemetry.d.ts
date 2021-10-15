declare namespace TelemetryAPI {
  const ACTIONS: {
    readonly CALL: 'Call';
    readonly NAVIGATION: 'Navigation';
    readonly DETAIL: 'Detail';
    readonly BANNER: 'BannerDetail';
  }
  export type Actions = typeof ACTIONS[keyof typeof ACTIONS];
  
  const FEEDBACK_TYPES: {
    readonly ATTRIBUTION: 'attribution';
    readonly QUOTE: 'quote';
  }
  export type FeedbackTypes = typeof FEEDBACK_TYPES[keyof typeof FEEDBACK_TYPES];

  const FEEDBACK_ACTIONS: {
    readonly QUOTE: 'AdsQuote';
    readonly DETAIL: 'AdsAttributionDetail';
    readonly FEEDBACK: 'Feedback';
  }
  export type FeedbackActions = typeof FEEDBACK_ACTIONS[keyof typeof FEEDBACK_ACTIONS];

  type Feature = {
    adid: string;
    visibleStartTime: number;
    visibleEndTime: number;
  };
}
