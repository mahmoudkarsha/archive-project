import { useTheme, Typography, Box, Grid, Paper } from '@mui/material';
import { tokens } from '../../theme';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import server from 'renderer/utils/server';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const boxStyles = {
  overflow: 'hidden',
  overflowY: 'scroll',
  height: '100%',
  margin: '10px',
  padding: '10px',
};

const paperStyles = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100px',
  border: 'none',
  boxShadow: '0 5px 9px -3px rgba(0,0,0,0.25)',
};

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [result, setResult] = useState(null);
  useEffect(() => {
    server
      .get('/statistics/any')
      .then((res) => {
        setResult(res.data);
      })
      .catch((err) => {});
  }, []);

  if (!result) return null;
  return (
    <Box sx={boxStyles}>
      <Grid container spacing={2}>
        <Grid item xl={3} md={3} sm={6} xs={12}>
          <Paper sx={{ ...paperStyles, backgroundColor: colors.primary[400] }}>
            <Typography variant="h5" color={colors.greenAccent[300]}>
              عدد التقارير اليوم
            </Typography>
            <Typography
              mt={'10px'}
              fontWeight={700}
              variant="h5"
              color={colors.primary[300]}
            >
              {result.todayReportsCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xl={3} md={3} sm={6} xs={12}>
          <Paper sx={{ ...paperStyles, backgroundColor: colors.primary[400] }}>
            <Typography variant="h5" color={colors.greenAccent[300]}>
              عدد التقارير هذا الشهر
            </Typography>
            <Typography
              mt={'10px'}
              fontWeight={700}
              variant="h5"
              color={colors.primary[300]}
            >
              {result.currentMonthReportsCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xl={3} md={3} sm={6} xs={12}>
          <Paper sx={{ ...paperStyles, backgroundColor: colors.primary[400] }}>
            <Typography variant="h5" color={colors.greenAccent[300]}>
              عدد التقارير هذه السنة
            </Typography>
            <Typography
              mt={'10px'}
              fontWeight={700}
              variant="h5"
              color={colors.primary[300]}
            >
              {result.currentYearReportsCount}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xl={3} md={3} sm={6} xs={12}>
          <Paper
            sx={{
              ...paperStyles,
              backgroundColor: colors.primary[400],
              width: '100%',
            }}
          >
            <Typography variant="h5" color={colors.greenAccent[300]}>
              العدد الكلي للتقارير
            </Typography>
            <Typography
              mt={'10px'}
              fontWeight={700}
              variant="h5"
              color={colors.primary[300]}
            >
              {result.totalReportsCount}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/*  <Grid container spacing={3}>
        <Grid item xl={2}>
          <Box
            mt={'40px'}
            p="10px"
            borderRadius={'20px'}
            bgcolor={colors.primary[400]}
            width="100%"
            height="100%"
          >
            <Doughnut
              options={{
                plugins: { legend: { display: false } },
              }}
              data={{
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                  {
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 4,
                    backgroundColor: [
                      '#2e2b28',

                      '#3b3734',
                      '#474440',
                      '#54504c',
                      '#6b506b',
                      '#ab3da9',
                      '#de25da',
                      '#eb44e8',
                      '#ff80ff',
                    ],
                  },
                ],
              }}
            />
          </Box>
        </Grid>
        <Grid item xl={2}>
          <Box
            mt={'40px'}
            p="10px"
            borderRadius={'20px'}
            bgcolor={colors.primary[400]}
            width="100%"
            height="100%"
          >
            <Doughnut
              options={{
                plugins: { legend: { display: false } },
              }}
              data={{
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                  {
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1,
                    backgroundColor: [
                      '#fd7f6f',
                      '#7eb0d5',
                      '#b2e061',
                      '#bd7ebe',
                      '#ffb55a',
                      '#ffee65',
                      '#beb9db',
                      '#fdcce5',
                      '#8bd3c7',
                    ],
                  },
                ],
              }}
            />
          </Box>
        </Grid>
        <Grid item xl={2}>
          <Box
            mt={'40px'}
            p="10px"
            borderRadius={'20px'}
            bgcolor={colors.primary[400]}
            width="100%"
            height="100%"
          >
            <Doughnut
              options={{
                plugins: { legend: { display: false } },
              }}
              data={{
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                  {
                    label: '# of Votes',
                    data: [
                      12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2,
                      3,
                    ],
                    borderWidth: 1,
                    backgroundColor: [
                      '#e60049',
                      '#0bb4ff',
                      '#50e991',
                      '#e6d800',
                      '#9b19f5',
                      '#ffa300',
                      '#dc0ab4',
                      '#b3d4ff',
                      '#00bfa0',
                    ],

                    clip: '100',
                  },
                ],
              }}
            />
          </Box>
        </Grid>
        <Grid item xl={2}>
          <Box
            mt={'40px'}
            p="10px"
            borderRadius={'20px'}
            bgcolor={colors.primary[400]}
            width="100%"
            height="100%"
          >
            <Doughnut
              options={{
                plugins: { legend: { display: false } },
              }}
              data={{
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                  {
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1,

                    backgroundColor: [
                      '#ea5545',
                      '#f46a9b',
                      '#ef9b20',
                      '#edbf33',
                      '#ede15b',
                      '#bdcf32',
                      '#87bc45',
                      '#27aeef',
                      '#b33dc6',
                    ],
                  },
                ],
              }}
            />
          </Box>
        </Grid>
        <Grid item xl={2}>
          <Box
            mt={'40px'}
            p="10px"
            borderRadius={'20px'}
            bgcolor={colors.primary[400]}
            width="100%"
            height="100%"
          >
            <Doughnut
              options={{
                plugins: { legend: { display: false } },
              }}
              data={{
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                  {
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1,

                    backgroundColor: [
                      '#ea5545',
                      '#f46a9b',
                      '#ef9b20',
                      '#edbf33',
                      '#ede15b',
                      '#bdcf32',
                      '#87bc45',
                      '#27aeef',
                      '#b33dc6',
                    ],
                  },
                ],
              }}
            />
          </Box>
        </Grid>
        <Grid item xl={2}>
          <Box
            mt={'40px'}
            p="10px"
            borderRadius={'20px'}
            bgcolor={colors.primary[400]}
            width="100%"
            height="100%"
          >
            <Doughnut
              options={{
                plugins: { legend: { display: false } },
              }}
              data={{
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                  {
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1,

                    backgroundColor: [
                      '#ea5545',
                      '#f46a9b',
                      '#ef9b20',
                      '#edbf33',
                      '#ede15b',
                      '#bdcf32',
                      '#87bc45',
                      '#27aeef',
                      '#b33dc6',
                    ],
                  },
                ],
              }}
            />
          </Box>
        </Grid>
      </Grid> */}
      <Grid container mt={3} spacing={2}>
        <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
          <Box
            mt={'40px'}
            p="10px"
            borderRadius={'20px'}
            bgcolor={colors.primary[400]}
            width="100%"
            height="100%"
          >
            <Bar
              data={{
                labels: [
                  'Red',
                  'Blue',
                  'Yellow',
                  'Green',
                  'Purple',
                  'Orange',
                  'Red',
                  'Blue',
                  'Yellow',
                  'Green',
                  'Purple',
                  'Orange',
                ],
                datasets: [
                  {
                    label: '# of Votes',
                    data: [
                      12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2,
                      3, 3,
                    ],
                    borderWidth: 1,
                    backgroundColor: [
                      '#ea5545',
                      '#f46a9b',
                      '#ef9b20',
                      '#edbf33',
                      '#ede15b',
                      '#bdcf32',
                      '#87bc45',
                      '#27aeef',
                      '#b33dc6',
                    ],
                  },
                ],
              }}
            />
          </Box>
        </Grid>
        <Grid item xl={6} lg={6} md={12} sm={12} xs={12}>
          <Box
            mt={'40px'}
            p="10px"
            borderRadius={'20px'}
            bgcolor={colors.primary[400]}
            width="100%"
            height="100%"
          >
            <Bar
              data={{
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [
                  {
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    borderWidth: 1,
                    backgroundColor: [
                      '#ea5545',
                      '#f46a9b',
                      '#ef9b20',
                      '#edbf33',
                      '#ede15b',
                      '#bdcf32',
                      '#87bc45',
                      '#27aeef',
                      '#b33dc6',
                    ],
                  },
                ],
              }}
            />
          </Box>
        </Grid>
      </Grid>
      <br />
    </Box>
  );
};

export default Dashboard;
