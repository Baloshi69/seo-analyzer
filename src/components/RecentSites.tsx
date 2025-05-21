import React from 'react';
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Box,
    Tooltip,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    OpenInNew as OpenInNewIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { RecentSite } from '../types';

interface RecentSitesProps {
    sites: RecentSite[];
    onAnalyze: (url: string) => void;
    onDelete: (url: string) => void;
}

const RecentSites: React.FC<RecentSitesProps> = ({
    sites,
    onAnalyze,
    onDelete,
}) => {
    if (sites.length === 0) {
        return null;
    }

    return (
        <Paper sx={{ mt: 4, p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Recently Analyzed Sites
            </Typography>
            <List>
                {sites.map((site) => (
                    <ListItem
                        key={site.url}
                        sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '&:last-child': {
                                borderBottom: 'none',
                            },
                        }}
                    >
                        <ListItemText
                            primary={site.title || new URL(site.url).hostname}
                            secondary={`Analyzed ${new Date(site.date).toLocaleString()}`}
                            sx={{
                                mr: 2,
                                '& .MuiListItemText-primary': {
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                },
                            }}
                        />
                        <ListItemSecondaryAction>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Tooltip title="Analyze again">
                                    <IconButton
                                        edge="end"
                                        aria-label="analyze"
                                        onClick={() => onAnalyze(site.url)}
                                        size="small"
                                    >
                                        <RefreshIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Open site">
                                    <IconButton
                                        edge="end"
                                        aria-label="open"
                                        onClick={() => window.open(site.url, '_blank')}
                                        size="small"
                                    >
                                        <OpenInNewIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Remove from history">
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => onDelete(site.url)}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default RecentSites;