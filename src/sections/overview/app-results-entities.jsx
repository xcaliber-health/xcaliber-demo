import React from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import { Box, Card, CardHeader, Typography } from '@mui/material';

function AppResultsEntitiesRecordChange({ title, subheader, sx, ...other }) {
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
        height: '340px',
      }}
      justifyContent="space-around"
    >
      <CardHeader
        sx={{ p: 0 }}
        title={title}
        subheader={subheader}
        titleTypographyProps={{ variant: 'h4' }}
        subheaderTypographyProps={{ variant: 'subtitle1' }}
      />
      <Box
        sx={{ p: 2 }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={1}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 300,
          }}
        >
          Customers
        </Typography>
        <Typography variant="h3">1,126</Typography>
      </Box>
      <Stack direction="row" justifyContent="space-around">
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography sx={{ fontWeight: 200 }}>New customers</Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <img
              src="/assets/icons/plus_1.svg"
              width={25}
              height={25}
              alt="images"
            />
            <Typography variant="h4">2</Typography>
          </Stack>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography sx={{ fontWeight: 200 }}>Updated customers</Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <img src="/assets/icons/copy_entity_1.svg" alt="images" />
            <Typography variant="h4">1</Typography>
          </Stack>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography sx={{ fontWeight: 200 }}>Removed customers</Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <img src="/assets/icons/trash_1.svg" alt="images" />
            <Typography variant="h4">0</Typography>
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}

AppResultsEntitiesRecordChange.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  sx: PropTypes.object,
};

export default AppResultsEntitiesRecordChange;
