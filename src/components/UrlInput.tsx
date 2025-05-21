import React, { useState } from 'react';
import { TextField, Button, Paper, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface UrlInputProps {
    onAnalyze: (url: string) => void;
    isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onAnalyze, isLoading }) => {
    const [url, setUrl] = useState('');
    const [error, setError] = useState('');

    const validateUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!url.trim()) {
            setError('Please enter a URL');
            return;
        }

        if (!validateUrl(url)) {
            setError('Please enter a valid URL');
            return;
        }

        setError('');
        onAnalyze(url);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        fullWidth
                        label="Enter website URL"
                        variant="outlined"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        error={!!error}
                        helperText={error}
                        placeholder="https://example.com"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isLoading}
                        startIcon={<SearchIcon />}
                        sx={{ minWidth: '120px' }}
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze'}
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default UrlInput;