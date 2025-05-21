import React from 'react';
import {
    Paper,
    Typography,
    Grid,
    Box,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { SeoAnalysis, SeoScore } from '../types';

interface MetaTagsAnalysisProps {
    analysis: SeoAnalysis;
    scores: SeoScore[];
}

const MetaTagsAnalysis: React.FC<MetaTagsAnalysisProps> = ({ analysis, scores }) => {
    const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
        switch (status) {
            case 'success':
                return <CheckCircleIcon color="success" />;
            case 'warning':
                return <WarningIcon color="warning" />;
            case 'error':
                return <ErrorIcon color="error" />;
        }
    };

    const overallScore = Math.round(
        scores.reduce((acc, score) => acc + score.percentage, 0) / scores.length
    );

    return (
        <Box sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    SEO Analysis Results
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Overall Score: {overallScore}%
                </Typography>
                <LinearProgress 
                    variant="determinate" 
                    value={overallScore}
                    sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        mb: 4,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: 
                                overallScore >= 80 ? '#4caf50' :
                                overallScore >= 60 ? '#ff9800' : '#f44336',
                            borderRadius: 5
                        }
                    }}
                />

                <Grid container spacing={3}>
                    {scores.map((score, index) => (
                        <Grid item xs={12} key={index}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                        backgroundColor: 
                                            score.percentage >= 80 ? '#e8f5e9' :
                                            score.percentage >= 60 ? '#fff3e0' : '#ffebee'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                        <Typography sx={{ flexGrow: 1 }}>{score.category}</Typography>
                                        <Typography sx={{ mr: 2 }}>
                                            {Math.round(score.percentage)}%
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List>
                                        {score.items.map((item, itemIndex) => (
                                            <ListItem key={itemIndex}>
                                                <ListItemIcon>
                                                    {getStatusIcon(item.status)}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={item.name}
                                                    secondary={item.message}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default MetaTagsAnalysis;