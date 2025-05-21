import React from 'react';
import { Paper, Typography, Box, Grid, styled } from '@mui/material';

interface LoadTimeMetrics {
    pageLoadTime: number;
    timeToFirstByte: number;
    firstContentfulPaint: number;
}

interface LoadTimeMetricsProps {
    metrics: LoadTimeMetrics & { isOptimal: boolean };
}

const MetricCard: React.FC<{
    title: string;
    value: number;
    threshold: number;
    unit: string;
}> = ({ title, value, threshold, unit }) => {
    const formattedValue = (value / 1000).toFixed(2);
    const isGood = value <= threshold;

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                backgroundColor: isGood ? '#e8f5e9' : '#ffebee',
                height: '100%'
            }}
        >
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Typography
                variant="h4"
                sx={{
                    color: isGood ? '#2e7d32' : '#c62828',
                    fontWeight: 'bold'
                }}
            >
                {formattedValue}
                <Typography
                    component="span"
                    variant="body1"
                    sx={{ ml: 1, color: 'text.secondary' }}
                >
                    {unit}
                </Typography>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {isGood ? 'Good' : 'Needs improvement'} (Target: {threshold / 1000}s)
            </Typography>
        </Paper>
    );
};

const LoadTimeMetrics: React.FC<LoadTimeMetricsProps> = ({ metrics }) => {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Performance Metrics
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <MetricCard
                        title="Page Load Time"
                        value={metrics.pageLoadTime}
                        threshold={3000}
                        unit="s"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <MetricCard
                        title="Time to First Byte"
                        value={metrics.timeToFirstByte}
                        threshold={600}
                        unit="s"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <MetricCard
                        title="First Contentful Paint"
                        value={metrics.firstContentfulPaint}
                        threshold={1800}
                        unit="s"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoadTimeMetrics;