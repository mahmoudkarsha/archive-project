import { useEffect, useState } from 'react';

import { TreeItem, TreeView } from '@mui/lab';
import {
  Box,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  Tooltip,
  Grid,
  Typography,
} from '@mui/material';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined';
import ArticleTwoToneIcon from '@mui/icons-material/ArticleTwoTone';
import FolderIcon from '@mui/icons-material/FolderTwoTone';
import DeleteIcon from '@mui/icons-material/Delete';
import server from '../../utils/server';
import { tokens } from '../../theme';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import serverErrorHandler from 'renderer/utils/serverErrorHandler';
import moment from 'moment';

const containerBoxStyles = {
  overflow: 'hidden',
  height: '100%',
  margin: '10px',
  padding: '10px',
};
const iconsBoxStyles = {
  display: 'flex',
  gap: '5px',
  p: '10px',
  borderRadius: '0px',
};

const ReportBrowser = () => {
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [foldersTree, setFoldersTree] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [relatedFiles, setRelatedFiles] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');

  //server side states
  const [serverLoading, setServerLoading] = useState(false);

  //dialog open states
  const [addDialogOpened, setIsAddDialogOpened] = useState(false);
  const [deleteReportDialogOpened, setDeleteReportDialogOpened] =
    useState(false);

  const [deleteFolderDialogOpened, setDeleteFolderDialogOpened] =
    useState(false);
  const [editFolderNameDialogOpened, setEditFolderNameDialogOpened] =
    useState(false);

  useEffect(() => {
    server
      .get('/folders')
      .then((response) => {
        setFoldersTree([...response.data.tree]);
      })
      .catch((err) => {});

    return () => {
      setFoldersTree([]);
    };
  }, [serverLoading]);

  useEffect(() => {
    if (!selectedPath) return;
    server
      .get(`/folders/${selectedPath}`)
      .then((res) => {
        setRelatedFiles(res.data.folder.reports);
      })
      .catch((err) => {});
  }, [selectedPath, selectedReport]);

  function handleAddDialogOpen() {
    setIsAddDialogOpened(true);
  }
  function handleAddDialogClose() {
    setIsAddDialogOpened(!true);
  }
  function handleOpenDeleteReportDialog(report) {
    return () => {
      setSelectedReport(report);
      setDeleteReportDialogOpened(true);
    };
  }

  function handleOpenDeleteFolderDialog() {
    setDeleteFolderDialogOpened(true);
  }

  function handleDeleteReport() {
    server
      .delete('/reports/' + selectedReport._id)
      .then((res) =>
        res.data.status === 'success'
          ? enqueueSnackbar('تم حذف التقرير', { variant: 'success' })
          : ''
      )
      .catch((err) => {
        enqueueSnackbar('خطا', { variant: 'error' });
      })
      .finally(() => {
        setSelectedReport(null);
        setDeleteReportDialogOpened(false);
      });
  }

  function renderFolders(folders) {
    return folders.map((folder) => {
      if (folder.children.length) {
        return (
          <TreeItem
            style={{
              padding: '12px 2px',
              backgroundColor: colors.primary[500],
              borderRadius: '10px',
              marginTop: '5px',
            }}
            key={folder.path}
            icon={<FolderIcon color="red" />}
            onClick={() => setSelectedPath(folder.path)}
            nodeId={folder.path}
            label={folder.name}
          >
            {renderFolders(folder.children)}
          </TreeItem>
        );
      }
      return (
        <TreeItem
          style={{
            padding: '12px 2px',
            backgroundColor: colors.primary[500],
            borderRadius: '10px',
            marginTop: '5px',
          }}
          key={folder.path}
          icon={<FolderIcon color="red" />}
          nodeId={folder.path}
          onClick={() => setSelectedPath(folder.path)}
          label={folder.name}
        />
      );
    });
  }

  function renderFilesList() {
    return relatedFiles.map((report) => {
      return (
        <ListItem
          style={{
            borderBottom: '1px solid' + colors.grey[900],
            '&:hover': {
              backgroundColor: 'red',
            },
          }}
          key={report._id}
          secondaryAction={
            <>
              <IconButton
                onClick={handleOpenDeleteReportDialog(report)}
                edge="end"
                color="red"
                aria-label="delete"
              >
                <DeleteIcon />
              </IconButton>
            </>
          }
        >
          <Link
            to={'/reports/' + report._id}
            style={{
              textDecoration: 'none',
              display: 'flex',
              color: colors.greenAccent[500],
            }}
          >
            <ListItemAvatar>
              <Avatar sizes="10">
                <ArticleTwoToneIcon />
              </Avatar>
            </ListItemAvatar>
            <Box
              sx={{
                transition: '0.2s ease-in-out',
                opacity: 0.7,
                '&:hover': {
                  transform: 'scale(1.06)',
                  opacity: 1,
                },
              }}
            >
              <Typography
                variant="h5"
                color={colors.grey[200]}
                fontWeight={900}
              >
                {report.subject.slice(0, 30)}
              </Typography>
              <Typography
                variant="h6"
                color={colors.redAccent[300]}
                fontWeight={700}
              >
                {moment(report.date).calendar()}
              </Typography>
            </Box>
          </Link>
        </ListItem>
      );
    });
  }
  function navigateToNewReport() {
    navigate(`/addreport/${selectedPath}`);
  }

  function handleFolderNameChange(e) {
    setNewFolderName(e.target.value);
  }

  function handleEditFolderNameDialogOpen() {
    if (selectedPath) {
      setEditFolderNameDialogOpened(true);
    } else {
      enqueueSnackbar('قم باختيار المجلد اولا', { variant: 'error' });
    }
  }
  function handleSubmit() {
    setServerLoading(true);

    server
      .post('/folders', { name: newFolderName, path: selectedPath })
      .then((res) => {
        setNewFolderName('');
        enqueueSnackbar('تم اضافة المجلد', { variant: 'success' });
      })
      .catch((err) => {
        enqueueSnackbar(serverErrorHandler(err), { variant: 'error' });
      })
      .finally(() => {
        setServerLoading(false);
      });
  }

  function handleEditFolderNameSubmit() {
    if (!selectedPath) {
      enqueueSnackbar('قم باختيار المجلد اولا', { variant: 'error' });
      return;
    }
    if (newFolderName.length < 1) {
      enqueueSnackbar('حطأ في الاسم', { variant: 'error' });
      return;
    }
    setServerLoading(true);
    server
      .put('/folders/' + selectedPath, { name: newFolderName })
      .then((res) => {
        setNewFolderName('');

        enqueueSnackbar('تم تعديل اسم المجلد', { variant: 'success' });
      })
      .catch((err) => {
        enqueueSnackbar(serverErrorHandler(err), { variant: 'error' });
      })
      .finally(() => {
        setServerLoading(!true);
        setEditFolderNameDialogOpened(!true);
      });
  }

  function handleDeleteFolder() {
    setServerLoading(true);

    server
      .delete('/folders/' + selectedPath)
      .then((res) => {
        setSelectedPath(null);
        enqueueSnackbar('تم حذف المجلد', { variant: 'success' });
      })
      .catch((err) => {
        enqueueSnackbar(serverErrorHandler(err), { variant: 'error' });
      })
      .finally(() => {
        setServerLoading(!true);
        setDeleteFolderDialogOpened(!true);
      });
  }
  return (
    <Box sx={containerBoxStyles}>
      <Grid container height={'100%'} spacing={0}>
        <Grid item md={4} sm={4} xs={6}>
          <Box
            height={'90vh'}
            sx={{
              padding: '10px',
              borderRadius: '0px',
              overflowY: 'scroll',
            }}
            backgroundColor={colors.primary[400]}
          >
            <Box
              sx={{ ...iconsBoxStyles, backgroundColor: colors.primary[500] }}
            >
              <Tooltip title="اضافة مجلد">
                <IconButton onClick={handleAddDialogOpen}>
                  <AddCardOutlinedIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="حذف المجلد">
                <IconButton onClick={handleOpenDeleteFolderDialog}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="تعديل اسم المجلد">
                <IconButton onClick={handleEditFolderNameDialogOpen}>
                  <EditOutlinedIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="تقرير جديد">
                <IconButton onClick={navigateToNewReport}>
                  <AddBoxOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <TreeView
              defaultCollapseIcon={<FolderIcon />}
              defaultExpandIcon={<FolderIcon color="#231123" />}
              aria-label="Mahmood"
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                margin: '10px 0 10px 0',
                padding: '0px 0px',
              }}
            >
              {renderFolders(foldersTree)}
            </TreeView>
          </Box>
        </Grid>
        <Grid item md={8} sm={8} xs={6}>
          <Box
            height={'100%'}
            sx={{
              padding: '10px',
              borderRadius: '0px',
              width: '100%',
              overflowY: 'scroll',
            }}
            backgroundColor={colors.primary[400]}
          >
            <List dense={true}>{renderFilesList()}</List>
          </Box>
        </Grid>
      </Grid>

      {/* edit folder name dialog */}
      <Dialog
        dir="rtl"
        open={editFolderNameDialogOpened}
        onClose={() => setEditFolderNameDialogOpened(!1)}
      >
        <DialogTitle fontSize={'17px'} fontWeight={700}>
          تعديل اسم المجلد{' '}
        </DialogTitle>
        <DialogContent>
          <DialogContentText fontSize={'15px'} fontWeight={500}>
            تعديل اسم المجلد في المسار
          </DialogContentText>
          <DialogContentText width={'400px'} fontSize={'15px'} fontWeight={700}>
            {selectedPath}
          </DialogContentText>

          <DialogContentText fontSize={'15px'} fontWeight={500}>
            اسم المجلد
          </DialogContentText>
          <DialogContentText width={'400px'} fontSize={'15px'} fontWeight={700}>
            {selectedPath
              ? selectedPath.split(',')[selectedPath.split(',').length - 1]
              : null}
          </DialogContentText>

          <TextField
            value={newFolderName}
            autoFocus
            id="name"
            label="الاسم الجديد"
            type="text"
            margin="dense"
            variant="outlined"
            color="secondary"
            fullWidth
            onChange={handleFolderNameChange}
          />
          <DialogActions sx={{ marginTop: '10px' }}>
            <Button onClick={handleAddDialogClose}>الغاء</Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleEditFolderNameSubmit}
            >
              تعديل
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      {/* add folder dialog */}
      <Dialog dir="rtl" open={addDialogOpened} onClose={handleAddDialogClose}>
        <DialogTitle fontSize={'17px'} fontWeight={700}>
          إضافة مجلد جديد
        </DialogTitle>
        <DialogContent>
          <DialogContentText fontSize={'15px'} fontWeight={500}>
            اكتب اسم المجلد ليتم اضافته الى المسار
          </DialogContentText>
          <DialogContentText width={'400px'} fontSize={'15px'} fontWeight={700}>
            {selectedPath}
          </DialogContentText>

          <TextField
            value={newFolderName}
            autoFocus
            id="name"
            label="اسم المجلد"
            type="text"
            margin="dense"
            variant="outlined"
            color="secondary"
            fullWidth
            onChange={handleFolderNameChange}
          />
          <DialogActions sx={{ marginTop: '10px' }}>
            <Button onClick={handleAddDialogClose}>الغاء</Button>
            <Button variant="contained" color="success" onClick={handleSubmit}>
              إضافة
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>

      {/* delete report dialog */}
      <Dialog
        dir="rtl"
        open={deleteReportDialogOpened}
        onClose={() => setDeleteReportDialogOpened(false)}
      >
        <DialogTitle fontSize={'17px'} fontWeight={700}>
          حذف التقرير
        </DialogTitle>
        <DialogContent>
          <DialogContentText fontSize={'15px'} fontWeight={500}>
            سيتم حذف التقرير وجميع الملفات المرفقة
          </DialogContentText>

          {selectedReport ? (
            <>
              <DialogContentText
                width={'400px'}
                fontSize={'15px'}
                fontWeight={700}
              >
                <br />

                <Typography>الرقم التلقائي</Typography>
                <Typography variant="h2"> {selectedReport.autoId}</Typography>
                <br />
                <Typography>الرقم</Typography>
                <Typography variant="h2"> {selectedReport.number}</Typography>
                <br />

                <Typography>الموضوع</Typography>
                <Typography variant="h4"> {selectedReport.subject}</Typography>
                <br />
              </DialogContentText>

              <DialogActions sx={{ marginTop: '10px' }}>
                <Button onClick={() => setDeleteReportDialogOpened(false)}>
                  الغاء
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleDeleteReport}
                >
                  حذف
                </Button>
              </DialogActions>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* delete folder dialog */}
      <Dialog
        dir="rtl"
        open={deleteFolderDialogOpened}
        onClose={() => setDeleteFolderDialogOpened(false)}
      >
        <DialogTitle fontSize={'17px'} fontWeight={700}>
          حذف المجلد
        </DialogTitle>
        <DialogContent>
          <DialogContentText fontSize={'15px'} fontWeight={500}>
            سيتم حذف المجلد وجميع المجلدات الفرعية والتقارير والملفات المرفقة
          </DialogContentText>
          <DialogContentText fontSize={'15px'} fontWeight={500}>
            {selectedPath}
          </DialogContentText>

          {selectedPath ? (
            <>
              <DialogContentText
                width={'400px'}
                fontSize={'15px'}
                fontWeight={700}
              >
                <br />
              </DialogContentText>

              <DialogActions sx={{ marginTop: '10px' }}>
                <Button onClick={() => setDeleteFolderDialogOpened(false)}>
                  الغاء
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleDeleteFolder}
                >
                  حذف
                </Button>
              </DialogActions>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ReportBrowser;
