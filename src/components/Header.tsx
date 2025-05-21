import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Header: React.FC = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                color: 'white',
                py: 4,
                mb: 4,
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                }}
            >
                <SearchIcon sx={{ fontSize: 40 }} />
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                    }}
                >
                    SEO Analyzer
                </Typography>
            </Box>
            <Typography
                variant="h6"
                sx={{
                    textAlign: 'center',
                    mt: 2,
                    opacity: 0.9,
                    maxWidth: '600px',
                    mx: 'auto',
                    px: 2,
                }}
            >
                Analyze your website's SEO performance and get actionable insights
            </Typography>
        </Box>
    );
};

export default Header;