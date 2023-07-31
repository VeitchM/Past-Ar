import { backend } from '../../../config.json'
const backendURL = backend.URL
const backendAPIVersion = backend.API_VERSION
export const mobileAPI = `${backendURL}/mobile-api/${backendAPIVersion}`