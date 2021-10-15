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

export { insertElementEndpoint as i, removeElementEndpoint as r, updateElementEndpoint as u };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci0wZWMwODU4MC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2Jyb3dzZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuXG5leHBvcnQgY29uc3QgaXNTcCA9ICgpOiBib29sZWFuID0+IHtcbiAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoIDw9IGNvbmZpZy5NT0JJTEVfTUFYX1dJRFRIO1xufTtcblxuZXhwb3J0IGNvbnN0IGluc2VydEVsZW1lbnRFbmRwb2ludCA9IChjbGFzc05hbWU6IHN0cmluZyk6IHZvaWQgPT4ge1xuICB0cnkge1xuICAgIGNvbnN0IG1hcGJveEVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFwYm94Z2wtbWFwJyk7XG4gICAgaWYgKCFtYXBib3hFbGVtZW50KSB7XG4gICAgICB0aHJvdyBFcnJvcignZmlsZWQgdG8gZmluZCBlbGVtZW50OiAubWFwYm94Z2wtbWFwJyk7XG4gICAgfVxuICAgIGNvbnN0IGVuZHBvaW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZW5kcG9pbnQuY2xhc3NOYW1lID0gY2xhc3NOYW1lO1xuICAgIG1hcGJveEVsZW1lbnQuYXBwZW5kQ2hpbGQoZW5kcG9pbnQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHRocm93IGVycm9yO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgdXBkYXRlRWxlbWVudEVuZHBvaW50ID0gKHNlbGVjdG9yOiBzdHJpbmcsIHVwZGF0ZUNsYXNzTmFtZTogc3RyaW5nKTogdm9pZCA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIGlmICghdGFyZ2V0RWxlbWVudCkgeyByZXR1cm47IH1cbiAgICB0YXJnZXRFbGVtZW50LmNsYXNzTmFtZSA9IHVwZGF0ZUNsYXNzTmFtZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZUVsZW1lbnRFbmRwb2ludCA9IChzZWxlY3Rvcjogc3RyaW5nKTogdm9pZCA9PiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdGFyZ2V0RWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIGlmICghdGFyZ2V0RWxlbWVudCB8fCAhdGFyZ2V0RWxlbWVudC5wYXJlbnROb2RlKSB7IHJldHVybjsgfVxuICAgIHRhcmdldEVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0YXJnZXRFbGVtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiTUFNYSxxQkFBcUIsR0FBRyxDQUFDLFNBQWlCO0lBQ3JELElBQUk7UUFDRixNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzlELElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEIsTUFBTSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztTQUNyRDtRQUNELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDL0MsUUFBUSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDL0IsYUFBYSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNyQztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsTUFBTSxLQUFLLENBQUM7S0FDYjtBQUNILEVBQUU7TUFFVyxxQkFBcUIsR0FBRyxDQUFDLFFBQWdCLEVBQUUsZUFBdUI7SUFDN0UsSUFBSTtRQUNGLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkQsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUFFLE9BQU87U0FBRTtRQUMvQixhQUFhLENBQUMsU0FBUyxHQUFHLGVBQWUsQ0FBQztLQUMzQztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsTUFBTSxLQUFLLENBQUM7S0FDYjtBQUNILEVBQUU7TUFFVyxxQkFBcUIsR0FBRyxDQUFDLFFBQWdCO0lBQ3BELElBQUk7UUFDRixNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELElBQUksQ0FBQyxhQUFhLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFO1lBQUUsT0FBTztTQUFFO1FBQzVELGFBQWEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ3JEO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxNQUFNLEtBQUssQ0FBQztLQUNiO0FBQ0g7Ozs7In0=
