declare namespace Feature {
  interface Properties {
    adid: string;
    icon?: string;
    advertizer?: string;
    category?: string;
    addressJa?: string;
    addressEn?: string;
    nameJa?: string;
    nameEn?: string;
    subtitle?: string;
    phoneNumber?: string;
    promotionBanner: string;
    promotionUrl?: string;
    directions?: string;
    lat?: string;
    lng?: string;
    minZoom?: string;
    satOpen?: string;
    satClose?: string;
    sunOpen?: string;
    sunClose?: string;
    weekOpen?: string;
    weekClose?: string;
    holidayOpen?: string;
    holidayClose?: string;
  }
}
declare interface Feature extends mapboxgl.MapboxGeoJSONFeature {
  properties: Feature.Properties;
}
