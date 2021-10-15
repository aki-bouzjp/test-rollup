import { isSaturday, isSunday } from 'date-fns';

type Dict = { [key: string]: any };

const camelCase = (object: Dict): Dict => {
  const updatedObject: Dict = {};
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      updatedObject[key.replace(/(\_\w)/g, updatedKey => (
        updatedKey[1].toUpperCase()
      ))] = object[key];
    }
  }
  return updatedObject;
};

export const formatProperties = (properties: any): Feature.Properties => (
  camelCase(properties) as Feature.Properties
);

export const getOpenCloseLabel = (properties: Feature.Properties): string => {
  const { satOpen, satClose, sunOpen, sunClose, weekOpen, weekClose } = properties;
  const today = new Date();
  let open = '';
  let close = '';
  if (isSaturday(today) && satOpen && satClose) {
    open = satOpen;
    close = satClose;
  } else if (isSunday(today) && sunOpen && sunClose) {
    open = sunOpen;
    close = sunClose;
  } else if (weekOpen && weekClose) {
    open = weekOpen;
    close = weekClose;
  } else {
    return '';
  }
  const openMatch = `${open}`.match(/(\d{1,2})(\d{2})$/);
  const openHour = openMatch && openMatch.length >= 3 ? openMatch[1] : '';
  const openMin = openMatch && openMatch.length >= 3 ? openMatch[2] : '';
  const closeMatch = `${close}`.match(/(\d{1,2})(\d{2})$/);
  const closeHour = closeMatch && closeMatch.length >= 3 ? closeMatch[1] : '';
  const closeMin = closeMatch && closeMatch.length >= 3 ? closeMatch[2] : '';
  const openLanbel = `${openHour}:${openMin}`;
  const closeLanbel = `${closeHour}:${closeMin}`;
  return `${openLanbel} - ${closeLanbel}`;
};
