import { RecentSite } from '../types';

const STORAGE_KEY = 'recentlyAnalyzedSites';
const MAX_RECENT_SITES = 10;

class StorageService {
    private getStorage(): Storage {
        if (typeof window === 'undefined') {
            throw new Error('Storage is only available in browser environment');
        }
        return window.localStorage;
    }

    saveSite(url: string): void {
        const sites = this.getRecentSites();
        const existingSiteIndex = sites.findIndex(site => site.url === url);
        
        if (existingSiteIndex !== -1) {
            // Update existing site's timestamp
            sites.splice(existingSiteIndex, 1);
        }

        // Add new site at the beginning
        sites.unshift({
            url,
            analyzedAt: new Date()
        });

        // Keep only the most recent sites
        if (sites.length > MAX_RECENT_SITES) {
            sites.pop();
        }

        this.getStorage().setItem(STORAGE_KEY, JSON.stringify(sites));
    }

    getRecentSites(): RecentSite[] {
        try {
            const data = this.getStorage().getItem(STORAGE_KEY);
            if (!data) return [];

            const sites = JSON.parse(data);
            return sites.map((site: any) => ({
                ...site,
                analyzedAt: new Date(site.analyzedAt)
            }));
        } catch (error) {
            console.error('Error reading from storage:', error);
            return [];
        }
    }

    clearSites(): void {
        this.getStorage().removeItem(STORAGE_KEY);
    }

    removeSite(url: string): void {
        const sites = this.getRecentSites();
        const filteredSites = sites.filter(site => site.url !== url);
        this.getStorage().setItem(STORAGE_KEY, JSON.stringify(filteredSites));
    }
}

export default new StorageService();