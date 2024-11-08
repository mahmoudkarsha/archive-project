import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';
import Header from '../../components/header';
import useGet from '../../utils/useGet';
import { Link, useNavigate } from 'react-router-dom';
import { tokens } from 'renderer/theme';
import moment from 'moment';
const boxStyles = {
  overflow: 'hidden',
  overflowY: 'scroll',
  height: '100%',
  margin: '10px',
  padding: '20px',
};

export default function Search() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 30 });

  const { resoponse, error, islaoding } = useGet({
    endpoint: '/smartsearch',
    query: { content, page: pagination.page, limit: pagination.pageSize },
    responseHandler: (data) => {
      return data.documents.map((doc) => {
        return { ...doc };
      });
    },
    setCount: setRowCount,
    defaultResponse: [],
  });
  return (
    <Box sx={boxStyles}>
      <Header title={'البحث المتقدم'} subtitle={'قم باختيار اعدادات البحث '} />
      <Grid container spacing={4}>
        <Grid item md={4} sm={12} xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="القيمة"
            color="secondary"
            onChange={(e) => setContent(e.target.value)}
            value={content}
          />
        </Grid>
      </Grid>
      <Box
        m={'40px 0px 20px 0px'}
        p={'10px 0px'}
        sx={{
          borderBottom: '1px solid ' + colors.primary[500],
        }}
      >
        <Typography variant="h4">نتائج البحث :</Typography>
      </Box>
      <Grid container spacing={1}>
        {resoponse.map((doc) => {
          return (
            <Grid item md={4} sm={6} xs={12}>
              <Box
                mt={1}
                key={doc._id}
                bgcolor={colors.primary[400]}
                p={1}
                borderRadius={1}
              >
                <Link
                  to={'/reports/' + doc.reportid._id}
                  style={{
                    textDecoration: 'none',
                    color: colors.greenAccent[500],
                  }}
                >
                  {doc.filename}
                </Link>
                <Typography> موضوع التقرير :{doc.reportid?.subject}</Typography>
                <Typography>
                  تاريخ التقرير : {moment(doc.reportid?.date).calendar('')}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
