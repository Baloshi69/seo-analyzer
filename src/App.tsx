import React, { useState, useCallback } from 'react';
import {
    Container,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Alert,
    Snackbar,
    Box,
} from '@mui/material';
import Header from './components/Header';
import UrlInput from './components/UrlInput';
import LoadingIndicator from './components/LoadingIndicator';
import MetaTagsAnalysis from './components/MetaTagsAnalysis';
import LoadTimeMetrics from './components/LoadTimeMetrics';
import SocialPreview from './components/SocialPreview';
import RecentSites from './components/RecentSites';
import seoAnalyzer from './services/seoAnalyzer';
import storage from './services/storage';
import { SeoAnalysis } from './types';
import './styles/global.css';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#2196f3',
        },
        secondary: {
            main: '#f50057',
        },
        background: {
            default: '#f5f5f5',
        },
    },
    typography: {
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 600,
        },
        h3: {
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
});

const App: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<SeoAnalysis | null>(null);
    const [recentSites, setRecentSites] = useState(() => storage.getRecentSites());

    const handleAnalyze = useCallback(async (url: string) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await seoAnalyzer.analyze(url);
            setAnalysis(result);
            storage.saveSite(url);
            setRecentSites(storage.getRecentSites());
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setAnalysis(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDeleteSite = useCallback((url: string) => {
        storage.removeSite(url);
        setRecentSites(storage.getRecentSites());
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', pb: 8 }}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Header />
                    <UrlInput onAnalyze={handleAnalyze} isLoading={loading} />
                    
                    <RecentSites
                        sites={recentSites}
                        onAnalyze={handleAnalyze}
                        onDelete={handleDeleteSite}
                    />

                    {loading && <LoadingIndicator />}

                    {analysis && (
                        <>
                            <MetaTagsAnalysis
                                analysis={analysis}
                                scores={seoAnalyzer.calculateScore(analysis)}
                            />
                            <LoadTimeMetrics metrics={analysis.loadTime} />
                            <SocialPreview
                                openGraph={analysis.socialTags.openGraph}
                                twitter={analysis.socialTags.twitter}
                            />
                        </>
                    )}

                    <Snackbar
                        open={!!error}
                        autoHideDuration={6000}
                        onClose={() => setError(null)}
                    >
                        <Alert
                            onClose={() => setError(null)}
                            severity="error"
                            variant="filled"
                            sx={{ width: '100%' }}
                        >
                            {error}
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
        </ThemeProvider>
    );
};

export default App;