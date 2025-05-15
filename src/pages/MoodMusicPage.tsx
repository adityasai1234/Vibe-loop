import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid, Paper, Slider } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.primary,
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',

}));

const MoodMusicPage: React.FC = () => {
  const [energy, setEnergy] = useState<number>(50);
  const [happiness, setHappiness] = useState<number>(50);
  const [danceability, setDanceability] = useState<number>(50);

  const handleEnergyChange = (event: Event, newValue: number | number[]) => {
    setEnergy(newValue as number);
  };

  const handleHappinessChange = (event: Event, newValue: number | number[]) => {
    setHappiness(newValue as number);
  };

  const handleDanceabilityChange = (event: Event, newValue: number | number[]) => {
    setDanceability(newValue as number);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom align="center">
          Mood Music Generator
        </Typography>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Typography gutterBottom>Energy</Typography>
              <Slider
                value={energy}
                onChange={handleEnergyChange}
                aria-label="Energy"
                valueLabelDisplay="auto"
              />
            </StyledPaper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Typography gutterBottom>Happiness</Typography>
              <Slider
                value={happiness}
                onChange={handleHappinessChange}
                aria-label="Happiness"
                valueLabelDisplay="auto"
              />
            </StyledPaper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <StyledPaper>
              <Typography gutterBottom>Danceability</Typography>
              <Slider
                value={danceability}
                onChange={handleDanceabilityChange}
                aria-label="Danceability"
                valueLabelDisplay="auto"
              />
            </StyledPaper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <StyledPaper>
            <Typography variant="h5" gutterBottom>
              Recommended Songs
            </Typography>
            {/* Add song recommendations component here */}
          </StyledPaper>
        </Box>
      </Box>
    </Container>
  );
};

export default MoodMusicPage; 