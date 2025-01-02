import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Container,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  TextField,
  Switch,
  FormControlLabel,
  useTheme
} from '@mui/material';
import { 
  Lightbulb as LightbulbIcon,
  PlayArrow as PlayArrowIcon,
  RestartAlt as RestartIcon,
  Info as InfoIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { WalkthroughProvider, useWalkthrough } from '../plugins/walkthrough-plugin';

const DemoContent = () => {
  const { start } = useWalkthrough();
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(0);
  const theme = useTheme();

  const startDemo = () => {
    start([
      {
        target: '#feature-toggle',
        title: 'Toggle Feature',
        content: 'Try toggling this switch to enable the feature.',
        requiredInteraction: {
          type: 'custom',
          message: 'Toggle the switch to continue',
          validator: (event: CustomEvent<{ type: string; checked?: boolean; isAutoInteraction?: boolean }>) => {
            return event.detail.checked === true || event.detail.isAutoInteraction === true;
          },
          autoInteractDelay: 3000 // Auto-click after 3 seconds
        }
      },
      {
        target: '#user-input',
        title: 'User Input',
        content: 'Enter your name to personalize the experience.',
        requiredInteraction: {
          type: 'input',
          message: 'Type at least 3 characters',
          validator: (event: CustomEvent<{ type: string; value?: string; isAutoInteraction?: boolean }>) => {
            if (event.detail.isAutoInteraction) return true;
            return (event.detail.value?.length ?? 0) >= 3;
          },
          autoInteractDelay: 5000 // Auto-complete after 5 seconds
        }
      },
      {
        target: '#rating-section',
        title: 'Rate the Feature',
        content: 'Hover over the stars to see the rating preview, and click to set your rating.',
        requiredInteraction: {
          type: 'custom',
          message: 'Please select a rating to continue',
          validator: (event: CustomEvent<{ type: string; rating?: number; isAutoInteraction?: boolean }>) => {
            return (event.detail.rating ?? 0) > 0 || event.detail.isAutoInteraction === true;
          },
          autoInteractDelay: 4000 // Auto-select rating after 4 seconds
        }
      }
    ]);
    setHasCompletedTour(true);
  };

  const handleRatingHover = (hoveredRating: number) => {
    if (!rating) {
      setRating(hoveredRating);
    }
  };

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card 
        id="welcome-card"
        onClick={startDemo}
        sx={{ 
          mb: 4, 
          background: theme.palette.primary.light,
          color: theme.palette.primary.contrastText,
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4]
          }
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <LightbulbIcon fontSize="large" />
            <Typography variant="h4">
              Interactive Walkthrough Builder
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Experience our powerful walkthrough builder that helps create engaging, interactive tutorials for your applications.
          </Typography>
          <Typography variant="body2" color="inherit" sx={{ opacity: 0.9 }}>
            Click anywhere on this card to start the interactive demo
          </Typography>
        </CardContent>
      </Card>

      <Paper 
        id="feature-toggle" 
        sx={{ 
          p: 3, 
          mb: 3,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4]
          }
        }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Feature Toggle
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={isFeatureEnabled}
              onChange={(e) => {
                const newValue = e.target.checked;
                setIsFeatureEnabled(newValue);
                // Dispatch custom event with the checked value
                const customEvent = new CustomEvent('walkthrough-interaction', {
                  bubbles: true,
                  detail: { checked: newValue }
                });
                e.target.dispatchEvent(customEvent);
              }}
              color="primary"
            />
          }
          label="Enable Feature"
        />
      </Paper>

      <Paper 
        id="user-input" 
        sx={{ 
          p: 3, 
          mb: 3,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4]
          }
        }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          User Information
        </Typography>
        <TextField
          label="Your Name"
          value={userName}
          onChange={(e) => {
            const newValue = e.target.value;
            setUserName(newValue);
            // Dispatch custom event with the input value
            const customEvent = new CustomEvent('walkthrough-interaction', {
              bubbles: true,
              detail: { value: newValue }
            });
            e.target.dispatchEvent(customEvent);
          }}
          fullWidth
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Paper>

      <Paper 
        id="rating-section" 
        sx={{ 
          p: 3, 
          mb: 3,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4]
          }
        }}
      >
        <Typography variant="h5" gutterBottom color="primary">
          Rate This Feature
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <IconButton
              key={star}
              onMouseEnter={() => handleRatingHover(star)}
              onMouseLeave={() => !rating && setRating(0)}
              onClick={(e) => {
                handleRatingClick(star);
                // Dispatch custom event with the rating value
                const customEvent = new CustomEvent('walkthrough-interaction', {
                  bubbles: true,
                  detail: { rating: star }
                });
                e.currentTarget.dispatchEvent(customEvent);
              }}
              color={star <= rating ? 'primary' : 'default'}
              sx={{ 
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.2)'
                }
              }}
            >
              <StarIcon />
            </IconButton>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

const WalkthroughDemo = () => {
  return (
    <WalkthroughProvider>
      <DemoContent />
    </WalkthroughProvider>
  );
};

export default WalkthroughDemo;
