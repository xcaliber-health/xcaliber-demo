import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Grid, Link } from '@mui/material';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export default function AppWidgetSummary({
  title,
  description = 'description',
  accessLevel = 'accessLevel',
  lastRefreshed = 'lastRefreshed',
  owner = 'owner',
  icon,
  color = 'primary',
  sx,
  ...other
}) {
  return (
    <Link
      component={RouterLink}
      href="/patient-360"
      sx={{ display: 'contents' }}
    >
      <Card
        component={Stack}
        direction="row"
        sx={{
          px: 3,
          py: 5,
          borderRadius: 2,
          boxShadow: (theme) => theme.customShadows[color],
          ...sx,
        }}
        {...other}
        justifyContent="flex-start"
        flexDirection="column"
        gap={3}
      >
        <Grid container>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              {icon && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  {icon}
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={9}>
              <Typography variant="h4">{title}</Typography>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="flex-start"
            flexWrap="nowrap"
            sx={{ minHeight: '14vh' }}
          >
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Description:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                {description}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="flex-start"
            flexWrap="nowrap"
          >
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Access Level:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                {accessLevel}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="flex-start"
            flexWrap="nowrap"
          >
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Owner:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                {owner.slice(0, owner.indexOf('('))}
                <br />
                {owner.slice(owner.indexOf('('), owner.length)}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            direction="row"
            justifyContent="flex-start"
            flexWrap="nowrap"
            alignItems="center"
          >
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Last Refreshed:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={8}>
              <Typography variant="subtitle2" sx={{ color: 'text.disabled' }}>
                {lastRefreshed}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Link>
  );
}

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  description: PropTypes.string,
  accessLevel: PropTypes.string,
  lastRefreshed: PropTypes.string,
  owner: PropTypes.string,
};
