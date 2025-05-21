// src/services/proxyService.ts
/**
 * Service to handle CORS issues when fetching external websites
 */
const CORS_PROXY_URLS = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/'
];

export class ProxyService {
  private currentProxyIndex = 0;

  /**
   * Wraps a URL with a CORS proxy
   */
  wrapWithProxy(url: string): string {
    // Use a different proxy if the previous one fails
    const proxy = CORS_PROXY_URLS[this.currentProxyIndex];
    // Rotate through available proxies
    this.currentProxyIndex = (this.currentProxyIndex + 1) % CORS_PROXY_URLS.length;
    return `${proxy}${encodeURIComponent(url)}`;
  }

  /**
   * Fallback to next proxy if the current one fails
   */
  rotateProxy(): void {
    this.currentProxyIndex = (this.currentProxyIndex + 1) % CORS_PROXY_URLS.length;
  }
}

export default new ProxyService();
