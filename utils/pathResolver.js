// To be used to dynamically resolve paths for project assets.
let baseURL = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');

export { baseURL }