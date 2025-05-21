import React from 'react';
import { Paper, Typography, Box, Tab, Tabs, Card, CardMedia, CardContent, styled } from '@mui/material';
import { Facebook as FacebookIcon, Twitter as TwitterIcon } from '@mui/icons-material';

interface SocialPreview {
    title: string;
    description: string;
    image: string;
    url: string;
}

interface SocialPreviewProps {
    openGraph: SocialPreview;
    twitter: SocialPreview & { card: string };
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const PreviewCard = styled(Card)(({ theme }) => ({
    maxWidth: 500,
    margin: '0 auto',
    boxShadow: theme.shadows[2],
    '& .MuiCardMedia-root': {
        height: 250,
        backgroundColor: '#e0e0e0'
    }
}));

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`social-tabpanel-${index}`}
            aria-labelledby={`social-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

const Preview: React.FC<{
    title: string;
    description: string;
    image: string;
    url: string;
    type: 'facebook' | 'twitter';
}> = ({ title, description, image, url, type }) => {
    let hostname;
    try {
        hostname = new URL(url || 'https://example.com').hostname;
    } catch {
        hostname = 'example.com';
    }

    return (
        <PreviewCard>
            {image && (
                <CardMedia
                    component="img"
                    image={image}
                    alt={title}
                    sx={{
                        height: type === 'facebook' ? 250 : 200
                    }}
                />
            )}
            <CardContent>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ 
                        display: 'block',
                        mb: 1,
                        textTransform: 'uppercase'
                    }}
                >
                    {hostname}
                </Typography>
                <Typography
                    variant="h6"
                    sx={{
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {title || 'No title provided'}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {description || 'No description provided'}
                </Typography>
            </CardContent>
        </PreviewCard>
    );
};

const SocialPreview: React.FC<SocialPreviewProps> = ({ openGraph, twitter }) => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Paper sx={{ mt: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="social media previews"
                    centered
                >
                    <Tab
                        icon={<FacebookIcon />}
                        label="Facebook"
                        id="social-tab-0"
                        aria-controls="social-tabpanel-0"
                    />
                    <Tab
                        icon={<TwitterIcon />}
                        label="Twitter"
                        id="social-tab-1"
                        aria-controls="social-tabpanel-1"
                    />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Preview {...openGraph} type="facebook" />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Preview {...twitter} type="twitter" />
            </TabPanel>
        </Paper>
    );
};

export default SocialPreview;