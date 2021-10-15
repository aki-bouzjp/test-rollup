import { config } from './config';

export const isSp = (): boolean => {
  return window.innerWidth <= config.MOBILE_MAX_WIDTH;
};

export const insertElementEndpoint = (className: string): void => {
  try {
    const mapboxElement = document.querySelector('.mapboxgl-map');
    if (!mapboxElement) {
      throw Error('filed to find element: .mapboxgl-map');
    }
    const endpoint = document.createElement('div');
    endpoint.className = className;
    mapboxElement.appendChild(endpoint);
  } catch (error) {
    throw error;
  }
};

export const updateElementEndpoint = (selector: string, updateClassName: string): void => {
  try {
    const targetElement = document.querySelector(selector);
    if (!targetElement) { return; }
    targetElement.className = updateClassName;
  } catch (error) {
    throw error;
  }
};

export const removeElementEndpoint = (selector: string): void => {
  try {
    const targetElement = document.querySelector(selector);
    if (!targetElement || !targetElement.parentNode) { return; }
    targetElement.parentNode.removeChild(targetElement);
  } catch (error) {
    throw error;
  }
};
