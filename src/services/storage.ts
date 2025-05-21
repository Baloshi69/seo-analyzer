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

    saveRecentSites(sites: RecentSite[]): void {
        try {
            this.getStorage().setItem(STORAGE_KEY, JSON.stringify(sites));
            console.log('Recent sites saved:', sites);
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    saveSite(url: string, title: string = ''): void {
        const sites = this.getRecentSites();
        const existingSiteIndex = sites.findIndex(site => site.url === url);
        
        if (existingSiteIndex !== -1) {
            // Remove existing site
            sites.splice(existingSiteIndex, 1);
        }

        // Add new site at the beginning
        sites.unshift({
            url,
            title,
            date: new Date().toISOString()
        });

        // Keep only the most recent sites
        if (sites.length > MAX_RECENT_SITES) {
            sites.pop();
        }

        this.saveRecentSites(sites);
    }

    getRecentSites(): RecentSite[] {
        try {
            const data = this.getStorage().getItem(STORAGE_KEY);
            if (!data) return [];

            const sites = JSON.parse(data);
            console.log('Retrieved recent sites:', sites);
            return sites;
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