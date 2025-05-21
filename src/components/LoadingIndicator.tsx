import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingIndicator: React.FC = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                gap: 2
            }}
        >
            <CircularProgress size={60} />
            <Typography variant="h6" color="text.secondary">
                Analyzing website...
            </Typography>
            <Typography variant="body2" color="text.secondary">
                This may take a few moments
            </Typography>
        </Box>
    );
};

export default LoadingIndicator;