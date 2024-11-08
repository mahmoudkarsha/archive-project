import React, { useEffect, useState } from 'react';
import Header from '../../components/header';
import { Box, Tooltip, Typography, debounce } from '@mui/material';
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
  nlNL,
} from '@mui/x-data-grid';
import server from '../../utils/server';

//moment locale
import moment from 'moment/moment';
import 'moment/locale/ar-dz';
import useGet from '../../utils/useGet';
import { useNavigate } from 'react-router-dom';
import { tokens } from 'renderer/theme';
import { useTheme } from '@mui/material';
moment.locale('ar-dz');

function CustomToolBar() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton style={{ color: colors.redAccent[500] }} />
      <GridToolbarFilterButton style={{ color: colors.redAccent[500] }} />
      <GridToolbarDensitySelector style={{ color: colors.redAccent[500] }} />
    </GridToolbarContainer>
  );
}

export default function ReportsTable() {
  const navigate = useNavigate();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const [sortModel, setSortModel] = useState([
    { field: 'createdAt', sort: 'asc' },
  ]);
  const [filterModel, setFilterModel] = useState({});
  const [rowCount, setRowCount] = useState(0);

  const { error, resoponse, islaoding } = useGet({
    endpoint: '/reports',
    query: {
      page: paginationModel.page,
      limit: paginationModel.pageSize,
      sort: sortModel,
      filter: filterModel,
    },
    responseHandler: (data) => {
      return data.reports.map((el) => ({
        ...el,
        date: moment(el.date).calendar('dd-mm-yyyy'),
        foldername: el.path.path.split(',')[el.path.path.split(',').length - 1],
        id: `${el.autoId} `,
      }));
    },
    setCount: setRowCount,
  });

  function onSortModelChange(value) {
    setSortModel(value);
  }

  function onFilterChange(value) {
    setFilterModel(value.items[0]);
  }
  function onPaginationChange(value) {
    setPaginationModel({ ...value });
  }

  const boxStyles = {
    overflow: 'hidden',
    overflowY: 'scroll',
    height: '100%',
    margin: '10px 0',
    padding: '20px',
    width: '100%',
  };

  return (
    <Box sx={boxStyles}>
      <Header
        title={'جدول التقارير'}
        subtitle={'جدول اخر التقارير المدخلة في قاعدة البيانات'}
      />
      <Box height={'600px'}>
        <DataGrid
          rows={resoponse || []}
          rowHeight={55}
          onRowClick={(e) => {
            navigate('/reports/' + e.row._id, { state: e.row });
          }}
          filterMode="server"
          sortingMode="server"
          paginationMode="server"
          sortModel={sortModel}
          paginationModel={paginationModel}
          onFilterModelChange={onFilterChange}
          onPaginationModelChange={onPaginationChange}
          onSortModelChange={onSortModelChange}
          columns={columns}
          rowCount={rowCount}
          pageSizeOptions={[5, 10, 15, 20, 25]}
          slots={{ toolbar: CustomToolBar }}
          loading={islaoding}
          sx={{
            maxWidth: '100%',
            overflow: 'auto',
          }}
        />
      </Box>
    </Box>
  );
}

function renderTooltipTitle(cell) {
  return (
    <Box>
      {(cell.value &&
        cell.value.map((el) => (
          <Typography key={el.originalname} variant="h4">
            {el.originalname}
          </Typography>
        ))) ||
        null}
    </Box>
  );
}
const columns = [
  {
    field: 'autoId',
    headerName: 'الرقم التلقائي',
  },
  {
    field: 'number',
    headerName: 'الرقم ',
  },
  {
    field: 'subject',
    headerName: 'الموضوع',
    flex: 1,
    sortable: !1,
    renderCell: (cell) => {
      return <Typography>{cell.value}</Typography>;
    },
  },
  {
    field: 'date',
    headerName: 'التاريخ',
    flex: 1,
    renderCell: (cell) => {
      return <Typography>{cell.value}</Typography>;
    },
  },
  {
    field: 'createdAt',
    headerName: 'تاريخ الحفظ',
    flex: 1,
    renderCell: (cell) => {
      return <Typography>{moment(cell.value).calendar()}</Typography>;
    },
  },
  {
    field: 'foldername',
    headerName: 'المسار',
    flex: 1,
    sortable: !1,
    renderCell: (cell) => {
      return (
        <Tooltip title={cell.value}>
          <Typography>{cell.value}</Typography>
        </Tooltip>
      );
    },
  },
  {
    field: 'note',
    headerName: 'ملاحظات',
    flex: 1,
    sortable: !1,
  },
  {
    field: 'documentFiles',
    headerName: 'المستندات',
    sortable: !1,

    flex: 0.5,
    renderCell: (cell) => {
      return (
        <Tooltip title={renderTooltipTitle(cell)}>
          <Typography>{cell.value.length}</Typography>
        </Tooltip>
      );
    },
  },
  {
    field: 'audioFiles',
    headerName: 'ملفات صوتية',
    flex: 0.5,
    sortable: !1,

    renderCell: (cell) => {
      return (
        <Tooltip title={renderTooltipTitle(cell)}>
          <Typography>{cell.value.length}</Typography>
        </Tooltip>
      );
    },
  },
  {
    field: 'photoFiles',
    headerName: 'صور',
    sortable: !1,

    flex: 0.5,
    renderCell: (cell) => {
      return (
        <Tooltip title={renderTooltipTitle(cell)}>
          <Typography>{cell.value.length}</Typography>
        </Tooltip>
      );
    },
  },
  {
    field: 'videoFiles',
    headerName: 'فيديوهات',
    flex: 0.5,
    sortable: !1,

    renderCell: (cell) => {
      return (
        <Tooltip title={renderTooltipTitle(cell)}>
          <Typography>{cell.value.length}</Typography>
        </Tooltip>
      );
    },
  },
  {
    field: 'compressedFiles',
    headerName: 'ملفات مضفوطة',
    flex: 0.5,
    sortable: !1,

    renderCell: (cell) => {
      return (
        <Tooltip title={renderTooltipTitle(cell)}>
          <Typography>{cell.value.length}</Typography>
        </Tooltip>
      );
    },
  },
];
