import axios from 'axios';

export interface PerformanceThresholds {
    pageLoadTime: number;
    timeToFirstByte: number;
    firstContentfulPaint: number;
}

export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
    pageLoadTime: 3000, // 3 seconds
    timeToFirstByte: 600, // 600ms
    firstContentfulPaint: 1800, // 1.8 seconds
};

export const measureLoadTime = async (url: string): Promise<{
    pageLoadTime: number;
    timeToFirstByte: number;
    firstContentfulPaint: number;
}> => {
    const start = performance.now();
    let firstByte = 0;

    try {
        const response = await axios.get(url, {
            onDownloadProgress: (progressEvent) => {
                if (firstByte === 0 && progressEvent.loaded > 0) {
                    firstByte = performance.now() - start;
                }
            }
        });

        const end = performance.now();
        const pageLoadTime = end - start;

        // In a real browser environment, we would use the Performance API
        // Here we're simulating FCP as a fraction of total load time
        const firstContentfulPaint = Math.min(pageLoadTime * 0.8, firstByte + 500);

        return {
            pageLoadTime,
            timeToFirstByte: firstByte,
            firstContentfulPaint
        };
    } catch (error) {
        throw new Error('Failed to measure load time: ' + (error as Error).message);
    }
};

export const analyzePerformance = (
    metrics: {
        pageLoadTime: number;
        timeToFirstByte: number;
        firstContentfulPaint: number;
    },
    thresholds: PerformanceThresholds = DEFAULT_THRESHOLDS
) => {
    const scores = {
        pageLoadTime: getMetricScore(metrics.pageLoadTime, thresholds.pageLoadTime),
        timeToFirstByte: getMetricScore(metrics.timeToFirstByte, thresholds.timeToFirstByte),
        firstContentfulPaint: getMetricScore(metrics.firstContentfulPaint, thresholds.firstContentfulPaint),
    };

    return {
        scores,
        overall: (scores.pageLoadTime + scores.timeToFirstByte + scores.firstContentfulPaint) / 3,
        recommendations: getPerformanceRecommendations(metrics, thresholds),
    };
};

const getMetricScore = (value: number, threshold: number): number => {
    if (value <= threshold * 0.5) return 100; // Excellent
    if (value <= threshold * 0.75) return 75; // Good
    if (value <= threshold) return 50; // Acceptable
    if (value <= threshold * 1.5) return 25; // Poor
    return 0; // Very poor
};

const getPerformanceRecommendations = (
    metrics: {
        pageLoadTime: number;
        timeToFirstByte: number;
        firstContentfulPaint: number;
    },
    thresholds: PerformanceThresholds
): string[] => {
    const recommendations: string[] = [];

    if (metrics.timeToFirstByte > thresholds.timeToFirstByte) {
        recommendations.push(
            'High Time to First Byte indicates server response issues. Consider:',
            '- Optimizing server configuration',
            '- Using a CDN',
            '- Implementing server-side caching'
        );
    }

    if (metrics.firstContentfulPaint > thresholds.firstContentfulPaint) {
        recommendations.push(
            'Slow First Contentful Paint. Consider:',
            '- Optimizing critical rendering path',
            '- Reducing render-blocking resources',
            '- Implementing resource hints (preconnect, preload)'
        );
    }

    if (metrics.pageLoadTime > thresholds.pageLoadTime) {
        recommendations.push(
            'Slow overall page load. Consider:',
            '- Optimizing images and media',
            '- Minifying CSS, JavaScript, and HTML',
            '- Implementing lazy loading',
            '- Using compression'
        );
    }

    return recommendations;
};

function calculateLoadTimeMetrics(loadTimes: number[]): { average: number; max: number; min: number } {
    const total = loadTimes.reduce((acc, time) => acc + time, 0);
    const average = total / loadTimes.length;
    const max = Math.max(...loadTimes);
    const min = Math.min(...loadTimes);

    return { average, max, min };
}

function formatLoadTime(time: number): string {
    return `${time.toFixed(2)} ms`;
}

export { calculateLoadTimeMetrics, formatLoadTime };