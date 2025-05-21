import { LoadTimeMetrics } from '../types';
import proxyService from './proxyService';

class UrlFetcher {
  async fetchHtml(url: string, useProxy = true): Promise<string> {
    try {
      // First try: Use proxy if enabled
      const fetchUrl = useProxy ? proxyService.wrapWithProxy(url) : url;
      console.log(`Fetching URL: ${fetchUrl}`);
      
      const response = await fetch(fetchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        // If first proxy fails, try a different one
        if (useProxy) {
          proxyService.rotateProxy();
          return this.fetchHtml(url, true);
        }
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      }
      
      const html = await response.text();
      console.log(`Successfully fetched ${url}, HTML length: ${html.length}`);
      return html;
    } catch (error) {
      console.error('Error fetching URL:', error);
      
      // If using proxy failed, try without proxy as last resort
      if (useProxy) {
        console.log('Trying without proxy...');
        return this.fetchHtml(url, false);
      }
      
      return '<html><body><p>Failed to load content</p></body></html>';
    }
  }
  async measureLoadTime(url: string): Promise<LoadTimeMetrics> {
    const start = performance.now();
    let firstByte = 0;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      // Use the proxy for measurements
      const fetchUrl = proxyService.wrapWithProxy(url);
      const response = await fetch(fetchUrl, { 
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      clearTimeout(timeoutId);
      
      // First byte time (TTFB)
      firstByte = performance.now() - start;
      
      // Full page load
      await response.text();
      const pageLoadTime = performance.now() - start;
      
      // For FCP (First Contentful Paint), we use a more realistic estimate
      const firstContentfulPaint = Math.min(pageLoadTime * 0.8, firstByte + 500);
      
      console.log(`Load metrics for ${url}:`, {
        timeToFirstByte: firstByte,
        firstContentfulPaint,
        pageLoadTime
      });
      
      return {
        timeToFirstByte: firstByte,
        firstContentfulPaint,
        pageLoadTime
      };
    } catch (error) {
      console.error('Error measuring load time:', error);
      return {
        timeToFirstByte: firstByte || 999,
        firstContentfulPaint: 999,
        pageLoadTime: 999
      };
    }
  }
}

export default new UrlFetcher();