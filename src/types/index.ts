export interface MetaTag {
    name: string;
    content: string;
}

export interface LoadTimeMetrics {
    pageLoadTime: number;
    timeToFirstByte: number;
    firstContentfulPaint: number;
}

export interface SocialPreview {
    title: string;
    description: string;
    image: string;
    url: string;
}

export interface RecentSite {
    url: string;
    analyzedAt: Date;
}

export interface SeoAnalysis {
    url: string;
    title: {
        content: string;
        length: number;
        isOptimal: boolean;
    };
    metaDescription: {
        content: string;
        length: number;
        isOptimal: boolean;
    };
    headings: {
        h1Count: number;
        h2Count: number;
        h3Count: number;
        isOptimal: boolean;
    };
    images: {
        total: number;
        withAlt: number;
        withoutAlt: number;
        isOptimal: boolean;
    };
    loadTime: LoadTimeMetrics & {
        isOptimal: boolean;
    };
    socialTags: {
        openGraph: SocialPreview;
        twitter: SocialPreview & {
            card: string;
        };
    };
    recentSites: RecentSite[];
}

export interface SeoScore {
    category: string;
    score: number;
    maxScore: number;
    percentage: number;
    items: {
        name: string;
        status: 'success' | 'warning' | 'error';
        message: string;
    }[];
}