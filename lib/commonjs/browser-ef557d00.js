'use strict';

const insertElementEndpoint = (className) => {
    try {
        const mapboxElement = document.querySelector('.mapboxgl-map');
        if (!mapboxElement) {
            throw Error('filed to find element: .mapboxgl-map');
        }
        const endpoint = document.createElement('div');
        endpoint.className = className;
        mapboxElement.appendChild(endpoint);
    }
    catch (error) {
        throw error;
    }
};
const updateElementEndpoint = (selector, updateClassName) => {
    try {
        const targetElement = document.querySelector(selector);
        if (!targetElement) {
            return;
        }
        targetElement.className = updateClassName;
    }
    catch (error) {
        throw error;
    }
};
const removeElementEndpoint = (selector) => {
    try {
        const targetElement = document.querySelector(selector);
        if (!targetElement || !targetElement.parentNode) {
            return;
        }
        targetElement.parentNode.removeChild(targetElement);
    }
    catch (error) {
        throw error;
    }
};

exports.insertElementEndpoint = insertElementEndpoint;
exports.removeElementEndpoint = removeElementEndpoint;
exports.updateElementEndpoint = updateElementEndpoint;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci1lZjU1N2QwMC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2Jyb3dzZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuXG5leHBvcnQgY29uc3QgaXNTcCA9ICgpOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoIDw9IGNvbmZpZy5NT0JJTEVfTUFYX1dJRFRIO1xufTtcblxuZXhwb3J0IGNvbnN0IGluc2VydEVsZW1lbnRFbmRwb2ludCA9IChjbGFzc05hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG1hcGJveEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFwYm94Z2wtbWFwJyk7XG4gICAgaWYgKCFtYXBib3hFbGVtZW50KSB7XG4gICAgICB0aHJvdyBFcnJvcignZmlsZWQgdG8gZmluZCBlbGVtZW50OiAubWFwYm94Z2wtbWFwJyk7XG4gICAgfVxuICAgIGNvbnN0IGVuZHBvaW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZW5kcG9pbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIG1hcGJveEVsZW1lbnQuYXBwZW5kQ2hpbGQoZW5kcG9pbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgdXBkYXRlRWxlbWVudEVuZHBvaW50ID0gKHNlbGVjdG9yOiBzdHJpbmcsIHVwZGF0ZUNsYXNzTmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIGlmICghdGFyZ2V0RWxlbWVudCkgeyByZXR1cm47IH1cbiAgICB0YXJnZXRFbGVtZW50LmNsYXNzTmFtZSA9IHVwZGF0ZUNsYXNzTmFtZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZUVsZW1lbnRFbmRwb2ludCA9IChzZWxlY3Rvcjogc3RyaW5nKTogdm9pZCA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIGlmICghdGFyZ2V0RWxlbWVudCB8fCAhdGFyZ2V0RWxlbWVudC5wYXJlbnROb2RlKSB7IHJldHVybjsgfVxuICAgIHRhcmdldEVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0YXJnZXRFbGVtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztNQU1hLHFCQUFxQixHQUFHLENBQUMsU0FBaUI7SUFDckQsSUFBSTtRQUNGLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNsQixNQUFNLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1NBQ3JEO1FBQ0QsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQyxRQUFRLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMvQixhQUFhLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3JDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxNQUFNLEtBQUssQ0FBQztLQUNiO0FBQ0gsRUFBRTtNQUVXLHFCQUFxQixHQUFHLENBQUMsUUFBZ0IsRUFBRSxlQUF1QjtJQUM3RSxJQUFJO1FBQ0YsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQUUsT0FBTztTQUFFO1FBQy9CLGFBQWEsQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDO0tBQzNDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxNQUFNLEtBQUssQ0FBQztLQUNiO0FBQ0gsRUFBRTtNQUVXLHFCQUFxQixHQUFHLENBQUMsUUFBZ0I7SUFDcEQsSUFBSTtRQUNGLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUU7WUFBRSxPQUFPO1NBQUU7UUFDNUQsYUFBYSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDckQ7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE1BQU0sS0FBSyxDQUFDO0tBQ2I7QUFDSDs7Ozs7OyJ9
