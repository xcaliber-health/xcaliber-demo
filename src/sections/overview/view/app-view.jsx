// import { faker } from '@faker-js/faker';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// import Iconify from 'src/components/iconify';

// import AppTasks from '../app-tasks';
// import AppNewsUpdate from '../app-news-update';
// import AppOrderTimeline from '../app-order-timeline';
// import AppCurrentVisits from '../app-current-visits';
// import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
// import AppTrafficBySite from '../app-traffic-by-site';
// import AppCurrentSubject from '../app-current-subject';
import AppResultsSourcesRecordChange from '../app-results-source';
import AppResultsEntitiesRecordChange from '../app-results-entities';
import AppResultsDuplicationRate from '../app-results-duplication-rate';

// ----------------------------------------------------------------------

const dataporoducts = [
  {
    title: 'Patient 360',
    description:
      'P360 provides a comprehensive, 360-degree view of patient data, enabling healthcare providers to make informed decisions and optimize patient care.',
    accessLevel: 'editor',
    lastRefreshed: '2023-05-18 09:30:00 UTC',
    owner: 'Dr. Emily Johnson (Clinical Domain Expert)',
    color: 'success',
    icon: '/assets/icons/glass/ic_glass_bag.png',
  },
  {
    title: 'Provider',
    description:
      'The Provider Directory offers a centralized and up-to-date repository of healthcare provider information, facilitating easy search and access to provider details.',
    accessLevel: 'read-only',
    lastRefreshed: '2023-05-17 15:45:00 UTC',
    owner: 'Michael Thompson (Technical Product Manager)',
    color: 'info',
    icon: '/assets/icons/glass/ic_glass_users.png',
  },
  {
    title: 'Patient Directory',
    description:
      'The Patient Directory serves as a secure and unified database of patient information, allowing authorized users to efficiently manage and retrieve patient records',
    accessLevel: 'owner',
    lastRefreshed: '2023-05-18 11:15:00 UTC',
    owner: 'Sarah Davis (Data Scientist)',
    color: 'warning',
    icon: '/assets/icons/glass/ic_glass_buy.png',
  },
  {
    title: 'Observability',
    description:
      'Observability empowers healthcare organizations with real-time insights and monitoring capabilities, ensuring the smooth operation and performance of their data infrastructure.',
    accessLevel: 'editor',
    lastRefreshed: '2023-05-18 08:00:00 UTC',
    owner: 'John Anderson (DevOps Engineer)',
    color: 'warning',
    icon: '/assets/icons/glass/ic_glass_buy.png',
  },
];

export default function AppView() {
  return (
    <Container maxWidth="xl">
      <Typography variant="h3" sx={{ mb: 5 }}>
        List of Data Products
      </Typography>

      <Grid container spacing={3}>
        {dataporoducts.map((data, index) => (
          <Grid xs={12} sm={6} md={4}>
            <AppWidgetSummary
              title={data.title}
              description={data.description}
              accessLevel={data.accessLevel}
              lastRefreshed={data.lastRefreshed}
              owner={data.owner}
              color={data.color}
              icon={<img alt="icon" src={data.icon} />}
            />
          </Grid>
        ))}

        <Grid xs={12} sm={12} md={12}>
          <Typography variant="h3" sx={{ mb: 5 }}>
            Results Summary
          </Typography>
        </Grid>

        <Grid xs={12} sm={6} md={6}>
          <AppResultsSourcesRecordChange
            title="How have my source records changed?"
            subheader="Here’s an overview of the changes in your source records from the last run."
          />
        </Grid>
        <Grid xs={12} sm={6} md={6}>
          <AppResultsEntitiesRecordChange
            title="How have my mastered entities changed?"
            subheader="Here’s an overview of the changes in your Customers from the last run."
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <AppResultsDuplicationRate
            title="How many duplicate company entities did we find? "
            subheader="We identified and consolidated duplicate source records to provide a single set of unique customers."
          />
        </Grid>

        {/* <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Bug Reports"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Website Visits"
            subheader="(+43%) than last year"
            chart={{
              labels: [
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ],
              series: [
                {
                  name: 'Team A',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'Team B',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: 'Team C',
                  type: 'line',
                  fill: 'solid',
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Current Visits"
            chart={{
              series: [
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Conversion Rates"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppNewsUpdate
            title="News Update"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: faker.person.jobTitle(),
              description: faker.commerce.productDescription(),
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Order Timeline"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                '1983, orders, $4220',
                '12 Invoices have been paid',
                'Order #37745 from September',
                'New order placed #XF-2356',
                'New order placed #XF-2346',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppTrafficBySite
            title="Traffic by Site"
            list={[
              {
                name: 'FaceBook',
                value: 323234,
                icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} />,
              },
              {
                name: 'Google',
                value: 341212,
                icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />,
              },
              {
                name: 'Linkedin',
                value: 411213,
                icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} />,
              },
              {
                name: 'Twitter',
                value: 443232,
                icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />,
              },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppTasks
            title="Tasks"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          />
        </Grid> */}
      </Grid>
    </Container>
  );
}
