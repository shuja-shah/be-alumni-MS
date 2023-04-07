import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import { useState } from 'react';
import { useEffect } from 'react';
import Iconify from '../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
} from '../sections/@dashboard/app';
import { ENDPOINT } from './LoginPage';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    alumni: 0,
    student: 0,

  });
  const token = localStorage.getItem('token');

  const myFetch = async () => {
    const res = await fetch(`${ENDPOINT}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    const data = await res.json();
    if (!res.ok) {
      console.log(data.error);
      return;
    }
    setFormData({ ...formData, alumni: Array.isArray(data.alumnis) ? data.alumnis.length : 0, student: Array.isArray(data.students) ? data.students.length : 0 });
  }



  useEffect(() => {
    myFetch();
  }, [])

  return (
    <>
      <Helmet>
        <title> Dashboard | Alumni Management System</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Alumni" total={formData.alumni ? formData.alumni : 0} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Student" total={formData.student ? formData.student : 0} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Jobs" total={3} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

        </Grid>
      </Container>
    </>
  );
}
