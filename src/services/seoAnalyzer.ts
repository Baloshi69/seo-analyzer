// src/services/seoAnalyzer.ts

import { parseHTML } from '../utils/jsdomWrapper';
import { SeoAnalysis, SeoScore, LoadTimeMetrics, SocialPreview } from '../types';
import urlFetcher from './urlFetcher';

export class SeoAnalyzer {
    async analyze(url: string): Promise<SeoAnalysis> {
        const html = await urlFetcher.fetchHtml(url);
        const document = parseHTML(html);
        
        const loadTimeMetrics = await urlFetcher.measureLoadTime(url);
        
        return {
            url,
            title: this.analyzeTitle(document),
            metaDescription: this.analyzeMetaDescription(document),
            headings: this.analyzeHeadings(document),
            images: this.analyzeImages(document),
            loadTime: {
                ...loadTimeMetrics,
                isOptimal: this.isLoadTimeOptimal(loadTimeMetrics)
            },
            socialTags: {
                openGraph: this.getOpenGraphTags(document),
                twitter: this.getTwitterTags(document)
            },
            recentSites: [] // This will be handled by the storage service
        };
    }

    private analyzeTitle(document: Document) {
        const title = document.querySelector('title')?.textContent || '';
        return {
            content: title,
            length: title.length,
            isOptimal: title.length >= 30 && title.length <= 60
        };
    }

    private analyzeMetaDescription(document: Document) {
        const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        return {
            content: description,
            length: description.length,
            isOptimal: description.length >= 120 && description.length <= 160
        };
    }

    private analyzeHeadings(document: Document) {
        const h1Count = document.querySelectorAll('h1').length;
        const h2Count = document.querySelectorAll('h2').length;
        const h3Count = document.querySelectorAll('h3').length;

        return {
            h1Count,
            h2Count,
            h3Count,
            isOptimal: h1Count === 1 && h2Count > 0
        };
    }

    private analyzeImages(document: Document) {
        const images = document.querySelectorAll('img');
        const total = images.length;
        const withAlt = Array.from(images).filter(img => img.hasAttribute('alt')).length;

        return {
            total,
            withAlt,
            withoutAlt: total - withAlt,
            isOptimal: total === withAlt && total > 0
        };
    }

    private isLoadTimeOptimal(metrics: LoadTimeMetrics): boolean {
        return (
            metrics.pageLoadTime < 3000 && // 3 seconds
            metrics.timeToFirstByte < 600 && // 600ms
            metrics.firstContentfulPaint < 1800 // 1.8 seconds
        );
    }

    private getOpenGraphTags(document: Document): SocialPreview {
        return {
            title: document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '',
            description: document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '',
            image: document.querySelector('meta[property="og:image"]')?.getAttribute('content') || '',
            url: document.querySelector('meta[property="og:url"]')?.getAttribute('content') || ''
        };
    }

    private getTwitterTags(document: Document): SocialPreview & { card: string } {
        return {
            card: document.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || 'summary',
            title: document.querySelector('meta[name="twitter:title"]')?.getAttribute('content') || '',
            description: document.querySelector('meta[name="twitter:description"]')?.getAttribute('content') || '',
            image: document.querySelector('meta[name="twitter:image"]')?.getAttribute('content') || '',
            url: document.querySelector('meta[name="twitter:url"]')?.getAttribute('content') || ''
        };
    }

    calculateScore(analysis: SeoAnalysis): SeoScore[] {
        return [
            this.calculateTitleScore(analysis.title),
            this.calculateDescriptionScore(analysis.metaDescription),
            this.calculateHeadingsScore(analysis.headings),
            this.calculateImagesScore(analysis.images),
            this.calculateLoadTimeScore(analysis.loadTime),
            this.calculateSocialScore(analysis.socialTags)
        ];
    }

    private calculateTitleScore(title: SeoAnalysis['title']): SeoScore {
        const items = [];
        let score = 0;
        
        if (title.content) {
            score += 5;
            items.push({
                name: 'Title presence',
                status: 'success' as const,
                message: 'Page has a title tag'
            });
        }

        if (title.isOptimal) {
            score += 5;
            items.push({
                name: 'Title length',
                status: 'success' as const,
                message: 'Title length is optimal (30-60 characters)'
            });
        } else {
            items.push({
                name: 'Title length',
                status: 'warning' as const,
                message: `Title length (${title.length} chars) is not optimal`
            });
        }

        return {
            category: 'Title',
            score,
            maxScore: 10,
            percentage: (score / 10) * 100,
            items
        };
    }

    private calculateDescriptionScore(description: SeoAnalysis['metaDescription']): SeoScore {
        const items = [];
        let score = 0;

        if (description.content) {
            score += 5;
            items.push({
                name: 'Meta description presence',
                status: 'success' as const,
                message: 'Page has a meta description'
            });
        }

        if (description.isOptimal) {
            score += 5;
            items.push({
                name: 'Meta description length',
                status: 'success' as const,
                message: 'Meta description length is optimal (120-160 characters)'
            });
        } else {
            items.push({
                name: 'Meta description length',
                status: 'warning' as const,
                message: `Meta description length (${description.length} chars) is not optimal`
            });
        }

        return {
            category: 'Meta Description',
            score,
            maxScore: 10,
            percentage: (score / 10) * 100,
            items
        };
    }

    private calculateHeadingsScore(headings: SeoAnalysis['headings']): SeoScore {
        const items = [];
        let score = 0;

        if (headings.h1Count === 1) {
            score += 4;
            items.push({
                name: 'H1 heading',
                status: 'success' as const,
                message: 'Page has exactly one H1 heading'
            });
        } else {
            items.push({
                name: 'H1 heading',
                status: 'error' as const,
                message: `Page has ${headings.h1Count} H1 headings (should have exactly 1)`
            });
        }

        if (headings.h2Count > 0) {
            score += 3;
            items.push({
                name: 'H2 headings',
                status: 'success' as const,
                message: `Page has ${headings.h2Count} H2 headings`
            });
        }

        if (headings.h3Count > 0) {
            score += 3;
            items.push({
                name: 'H3 headings',
                status: 'success' as const,
                message: `Page has ${headings.h3Count} H3 headings`
            });
        }

        return {
            category: 'Headings',
            score,
            maxScore: 10,
            percentage: (score / 10) * 100,
            items
        };
    }

    private calculateImagesScore(images: SeoAnalysis['images']): SeoScore {
        const items = [];
        let score = 0;

        if (images.total > 0) {
            score += 3;
            items.push({
                name: 'Images presence',
                status: 'success' as const,
                message: `Page has ${images.total} images`
            });
        }

        const altPercentage = (images.withAlt / images.total) * 100 || 0;
        if (altPercentage === 100) {
            score += 7;
            items.push({
                name: 'Alt text',
                status: 'success' as const,
                message: 'All images have alt text'
            });
        } else {
            items.push({
                name: 'Alt text',
                status: 'warning' as const,
                message: `${images.withoutAlt} images missing alt text`
            });
            score += (7 * altPercentage) / 100;
        }

        return {
            category: 'Images',
            score,
            maxScore: 10,
            percentage: (score / 10) * 100,
            items
        };
    }

    private calculateLoadTimeScore(loadTime: SeoAnalysis['loadTime']): SeoScore {
        const items = [];
        let score = 0;

        if (loadTime.pageLoadTime < 3000) {
            score += 4;
            items.push({
                name: 'Page load time',
                status: 'success' as const,
                message: `Page loads in ${(loadTime.pageLoadTime / 1000).toFixed(2)}s`
            });
        } else {
            items.push({
                name: 'Page load time',
                status: 'warning' as const,
                message: `Page load time (${(loadTime.pageLoadTime / 1000).toFixed(2)}s) is slow`
            });
        }

        if (loadTime.timeToFirstByte < 600) {
            score += 3;
            items.push({
                name: 'Time to first byte',
                status: 'success' as const,
                message: `TTFB: ${(loadTime.timeToFirstByte / 1000).toFixed(2)}s`
            });
        }

        if (loadTime.firstContentfulPaint < 1800) {
            score += 3;
            items.push({
                name: 'First contentful paint',
                status: 'success' as const,
                message: `FCP: ${(loadTime.firstContentfulPaint / 1000).toFixed(2)}s`
            });
        }

        return {
            category: 'Performance',
            score,
            maxScore: 10,
            percentage: (score / 10) * 100,
            items
        };
    }

    private calculateSocialScore(socialTags: SeoAnalysis['socialTags']): SeoScore {
        const items = [];
        let score = 0;

        // Check Open Graph tags
        const ogScore = this.checkSocialPreview(socialTags.openGraph, 'OpenGraph');
        score += ogScore.score;
        items.push(...ogScore.items);

        // Check Twitter tags
        const twitterScore = this.checkSocialPreview(socialTags.twitter, 'Twitter');
        score += twitterScore.score;
        items.push(...twitterScore.items);

        return {
            category: 'Social Media',
            score,
            maxScore: 10,
            percentage: (score / 10) * 100,
            items
        };
    }

    private checkSocialPreview(preview: SocialPreview, type: string): { score: number; items: SeoScore['items'] } {
        const items: SeoScore['items'] = [];
        let score = 0;

        if (preview.title) {
            score += 1.25;
            items.push({
                name: `${type} title`,
                status: 'success' as const,
                message: `${type} title is present`
            });
        }

        if (preview.description) {
            score += 1.25;
            items.push({
                name: `${type} description`,
                status: 'success' as const,
                message: `${type} description is present`
            });
        }

        if (preview.image) {
            score += 1.25;
            items.push({
                name: `${type} image`,
                status: 'success' as const,
                message: `${type} image is present`
            });
        }

        if (preview.url) {
            score += 1.25;
            items.push({
                name: `${type} URL`,
                status: 'success' as const,
                message: `${type} URL is present`
            });
        }

        return { score, items };
    }
}

export default new SeoAnalyzer();