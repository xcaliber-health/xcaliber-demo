import React from 'react';
import PropTypes from 'prop-types';

import { Box, Card, Grid, Stack, Typography } from '@mui/material';

function AppResultsDuplicationRate({ title, subheader, sx, ...other }) {
  return (
    <Card
      component={Stack}
      {...other}
      sx={{
        px: 2,
        py: 2,
        borderRadius: 2,
        boxShadow: (theme) => theme.customShadows.primary,
        ...sx,
        width: '100%',
        height: '240px',
      }}
      spacing={4}
    >
      <Stack direction="row" alignItems="baseline" spacing={1}>
        <Typography variant="h4">{title}</Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 200 }}>
          {subheader}
        </Typography>
      </Stack>
      <Grid container direction="row">
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          display="flex"
          justifyContent="center"
          direction="column"
        >
          <Typography variant="h3">48%</Typography>
          <Typography variant="h5" sx={{ fontWeight: 200 }}>
            Deduplication Rate
          </Typography>
        </Grid>
        <Grid container item direction="column" xs={12} sm={6} md={9} gap={2}>
          <Grid item container>
            <Grid item container alignItems="center" direction="row" gap={2}>
              <Grid
                item
                md={1}
                display="flex"
                direction="column"
                alignItems="flex-end"
              >
                <Typography variant="h5">2,183</Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 200, textWrap: 'nowrap' }}
                >
                  Source Records
                </Typography>
              </Grid>
              <Box
                sx={{
                  width: '85%',
                  height: '32px',
                  background: '#E77E43',
                  boxShadow: 'rgba(0, 0, 0, 0.25) 0px 4px 4px 0px',
                  borderRadius: '0px 4px 4px 0px',
                }}
              />
            </Grid>
          </Grid>
          <Grid item container>
            <Grid item container alignItems="center" direction="row" gap={2}>
              <Grid
                item
                md={1}
                display="flex"
                direction="column"
                alignItems="flex-end"
              >
                <Typography variant="h5">1,126</Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 200, textWrap: 'nowrap' }}
                >
                  Entities
                </Typography>
              </Grid>
              <Box
                sx={{
                  width: '50%',
                  height: '32px',
                  background: '#0896FF',
                  boxShadow: 'rgba(0, 0, 0, 0.25) 0px 4px 4px 0px',
                  borderRadius: '0px 4px 4px 0px',
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}

AppResultsDuplicationRate.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  sx: PropTypes.object,
};

export default AppResultsDuplicationRate;
