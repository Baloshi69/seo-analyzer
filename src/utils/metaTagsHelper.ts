import { parseHTML } from './jsdomWrapper';

export const isValidMetaLength = {
    title: (length: number) => length >= 30 && length <= 60,
    description: (length: number) => length >= 120 && length <= 160,
    keywords: (length: number) => length > 0 && length <= 200
};

export const getMetaTagContent = (document: Document, selector: string): string => {
    const element = document.querySelector(selector);
    return element?.getAttribute('content') || element?.textContent || '';
};

export const extractMetaTags = (html: string) => {
    const document = parseHTML(html);
    return {
        title: document.querySelector('title')?.textContent || '',
        description: getMetaTagContent(document, 'meta[name="description"]'),
        keywords: getMetaTagContent(document, 'meta[name="keywords"]'),
        robots: getMetaTagContent(document, 'meta[name="robots"]'),
        viewport: getMetaTagContent(document, 'meta[name="viewport"]'),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
    };
};

export const getHeadingStructure = (document: Document) => {
    const headings = {
        h1: Array.from(document.querySelectorAll('h1')),
        h2: Array.from(document.querySelectorAll('h2')),
        h3: Array.from(document.querySelectorAll('h3')),
        h4: Array.from(document.querySelectorAll('h4')),
        h5: Array.from(document.querySelectorAll('h5')),
        h6: Array.from(document.querySelectorAll('h6')),
    };

    return {
        counts: {
            h1: headings.h1.length,
            h2: headings.h2.length,
            h3: headings.h3.length,
            h4: headings.h4.length,
            h5: headings.h5.length,
            h6: headings.h6.length,
        },
        firstH1: headings.h1[0]?.textContent || '',
        isValid: headings.h1.length === 1 && headings.h2.length > 0,
    };
};

export const getImageAnalysis = (document: Document) => {
    const images = Array.from(document.querySelectorAll('img'));
    
    return {
        total: images.length,
        withAlt: images.filter(img => img.hasAttribute('alt')).length,
        withoutAlt: images.filter(img => !img.hasAttribute('alt')).length,
        altTextQuality: images.map(img => ({
            src: img.getAttribute('src') || '',
            alt: img.getAttribute('alt') || '',
            isDescriptive: (img.getAttribute('alt') || '').length > 10,
        })),
    };
};

export const getSocialTags = (document: Document) => {
    return {
        openGraph: {
            title: getMetaTagContent(document, 'meta[property="og:title"]'),
            description: getMetaTagContent(document, 'meta[property="og:description"]'),
            image: getMetaTagContent(document, 'meta[property="og:image"]'),
            url: getMetaTagContent(document, 'meta[property="og:url"]'),
            type: getMetaTagContent(document, 'meta[property="og:type"]'),
            siteName: getMetaTagContent(document, 'meta[property="og:site_name"]'),
        },
        twitter: {
            card: getMetaTagContent(document, 'meta[name="twitter:card"]'),
            site: getMetaTagContent(document, 'meta[name="twitter:site"]'),
            title: getMetaTagContent(document, 'meta[name="twitter:title"]'),
            description: getMetaTagContent(document, 'meta[name="twitter:description"]'),
            image: getMetaTagContent(document, 'meta[name="twitter:image"]'),
            url: getMetaTagContent(document, 'meta[name="twitter:url"]'),
        },
    };
};