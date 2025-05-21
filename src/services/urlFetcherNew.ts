import { LoadTimeMetrics } from '../types';

class UrlFetcher {
  async fetchHtml(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error('Error fetching URL:', error);
      return '';
    }
  }

  async measureLoadTime(url: string): Promise<LoadTimeMetrics> {
    const start = performance.now();
    let firstByte = 0;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      // First byte time (TTFB)
      firstByte = performance.now() - start;
      
      // Full page load
      await response.text();
      const pageLoadTime = performance.now() - start;
      
      // For FCP (First Contentful Paint), we use a more realistic estimate
      // In a real browser this would be when content is first displayed
      // Since we can't measure that directly in this environment, we use a reasonable estimate
      const firstContentfulPaint = Math.min(pageLoadTime * 0.8, firstByte + 500);
      
      return {
        timeToFirstByte: firstByte,
        firstContentfulPaint: firstContentfulPaint,
        pageLoadTime: pageLoadTime
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
