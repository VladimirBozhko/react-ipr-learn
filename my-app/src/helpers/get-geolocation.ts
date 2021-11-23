export function getGeolocation() {
  if (navigator.geolocation) {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      return navigator.geolocation.getCurrentPosition(resolve, reject);
    })
  }

  return Promise.reject('Unable to determine geolocation');
}