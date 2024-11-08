import React, { useState, useCallback } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import useGet from '../../utils/useGet';
import EditableBox from '../../components/editablediv';
import {
  Box,
  Grid,
  List,
  IconButton,
  Typography,
  useTheme,
  Avatar,
  ListItemText,
  ListItemAvatar,
  ListItem,
  CircularProgress,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfTwoTone';
import PhotoTwoToneIcon from '@mui/icons-material/PhotoTwoTone';
import VideoCameraBackTwoToneIcon from '@mui/icons-material/VideoCameraBackTwoTone';
import AudioFileTwoToneIcon from '@mui/icons-material/AudioFileTwoTone';
import FolderZipTwoToneIcon from '@mui/icons-material/FolderZipTwoTone';
import FolderIcon from '@mui/icons-material/Folder';
import AddIcon from '@mui/icons-material/AddTaskTwoTone';

import PrintTwoToneIcon from '@mui/icons-material/PrintTwoTone';
import AttachFileTwoToneIcon from '@mui/icons-material/AttachFileTwoTone';
import CloudDownloadTwoToneIcon from '@mui/icons-material/CloudDownloadTwoTone';
import { tokens } from '../../theme';
import Header from '../../components/header';
import server, { localServer } from 'renderer/utils/server';
import moment from 'moment';

import classifyFiles from '../../utils/classifyFiles';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { enqueueSnackbar } from 'notistack';
import serverErrorHandler from 'renderer/utils/serverErrorHandler';

const boxStyles = {
  overflow: 'hidden',
  overflowY: 'scroll',
  height: '100%',
  margin: '10px',
  padding: '20px',
};

export default function ViewReport() {
  const [showDropArea, setShowDragArea] = useState(!1);
  const [formPostLoading, setFormPostLoading] = useState(!1);
  const reportid = useParams().id;
  const { state } = useLocation();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [files, setFiles] = useState([]);

  function handleDeleteFile(url) {
    setFiles((prev) => prev.filter((file) => file.preview !== url));
  }

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) => ({
        file: file,
        preview: URL.createObjectURL(file),
      })),
    ]);
  }, []);

  const { isDragActive, inputRef, getInputProps, getRootProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  const { resoponse, islaoding, error } = useGet({
    endpoint: `/reports/${reportid}`,
    responseHandler: function (data) {
      return data.report;
    },
    noFetch: state ? !1 : !1,
  });

  const itemStyle = {
    backgroundColor: colors.primary[400],
    marginBottom: '10px',
    padding: '7px 20px',
    borderRadius: '10px',
  };

  function handleFormSubmit() {
    setFormPostLoading(true);
    const formData = new FormData();
    photoFiles.map((item) => formData.append('photofiles', item.file));
    videoFiles.map((item) => formData.append('videofiles', item.file));
    compressedFiles.map((item) =>
      formData.append('compressedfiles', item.file)
    );
    documentFiles.map((item) => formData.append('documentfiles', item.file));
    audioFiles.map((item) => formData.append('audiofiles', item.file));
    server
      .put(`/reports/files/${resoponse._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        setFiles((prevState) => {
          prevState.forEach((el) => {
            URL.revokeObjectURL(el.preview);
          });
          return [];
        });
        setFormPostLoading(false);
        enqueueSnackbar('تم إضافة المرفقات بنجاح', { variant: 'success' });
      })
      .catch((err) => {
        enqueueSnackbar(serverErrorHandler(err), { variant: 'error' });
        setFormPostLoading(false);
      });
  }

  function handleFileOpen(name) {
    return () => {
      console.log('click', name);
      window.electron.ipcRenderer.sendMessage('open-file', name);
    };
  }
  const {
    photoFiles,
    videoFiles,
    audioFiles,
    documentFiles,
    compressedFiles,
    rejectedFiles,
  } = classifyFiles(files);

  function renderFilesList(files) {
    return files.map((file) => {
      return (
        <ListItem
          secondaryAction={
            <>
              <IconButton edge="end" aria-label="delete"></IconButton>
            </>
          }
          onClick={handleFileOpen(file.path)}
        >
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={file.originalname} secondary={''} />
        </ListItem>
      );
    });
  }

  function renderFiles() {
    if (!files.length)
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={'100%'}
        >
          <Typography>
            قم باسقاط الملفات المرفقة أو انقر على المربع لفتح مستعرض الملفات
          </Typography>
        </Box>
      );

    if (isDragActive)
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={'100%'}
        >
          <Typography>إفلات الملفات</Typography>
        </Box>
      );

    function renderFileCard(file, icon) {
      return (
        <ListItem
          secondaryAction={
            <IconButton
              onClick={() => handleDeleteFile(file.preview)}
              color="red"
              edge="end"
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar backgroundColor="white">{icon}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={file.file.name} secondary={''} />
        </ListItem>
      );
    }
    return (
      <Box
        p={'20px'}
        color={colors.greenAccent[300]}
        sx={{ overflowY: 'scroll', height: '100%' }}
      >
        {documentFiles.length ? (
          <Box>
            <Typography>المستندات التي قمت باختيارها</Typography>
            <List>
              {documentFiles.map((file) => {
                return renderFileCard(file, <PictureAsPdfTwoToneIcon />);
              })}
            </List>
          </Box>
        ) : null}
        {photoFiles.length ? (
          <Box>
            <Typography>الصور التي قمت باختيارها</Typography>
            <List>
              {photoFiles.map((file) => {
                return renderFileCard(file, <PhotoTwoToneIcon />);
              })}
            </List>
          </Box>
        ) : null}

        {videoFiles.length ? (
          <Box>
            <Typography>الفيديوهات التي قمت باختيارها</Typography>
            <List>
              {videoFiles.map((file) => {
                return renderFileCard(file, <VideoCameraBackTwoToneIcon />);
              })}
            </List>
          </Box>
        ) : null}
        {audioFiles.length ? (
          <Box>
            <Typography>الملفات الصوتية التي قمت باختيارها</Typography>
            <List>
              {audioFiles.map((file) => {
                return renderFileCard(file, <AudioFileTwoToneIcon />);
              })}
            </List>
          </Box>
        ) : null}
        {compressedFiles.length ? (
          <Box>
            <Typography>الملفات المضغوطة التي قمت باختيارها</Typography>
            <List>
              {compressedFiles.map((file) => {
                return renderFileCard(file, <FolderZipTwoToneIcon />);
              })}
            </List>
          </Box>
        ) : null}

        {rejectedFiles.length ? (
          <Box>
            <Typography>الملفات الغير مدعومة</Typography>
            <List>
              {rejectedFiles.map((file) => {
                return renderFileCard(file, <FolderIcon />);
              })}
            </List>
          </Box>
        ) : null}
      </Box>
    );
  }

  const boxRedColor = colors.redAccent[400];
  return !resoponse ? null : (
    <Box sx={boxStyles}>
      <Header title={resoponse.path.path} />
      <Box p={'10px 0'}>
        <IconButton
          onClick={() => {
            setShowDragArea(!showDropArea);
          }}
        >
          <AttachFileTwoToneIcon />
        </IconButton>
        <IconButton
          onClick={() => {
            const filesArr = [
              ...(resoponse.documentFiles || []),
              ...(resoponse.audioFiles || []),
              ...(resoponse.videoFiles || []),
              ...(resoponse.photoFiles || []),
              ...(resoponse.compressedFiles || []),
            ];

            window.electron.ipcRenderer.sendMessage(
              'move-files-to-access-area',
              filesArr
            );
          }}
        >
          <CloudDownloadTwoToneIcon />
        </IconButton>
      </Box>
      {showDropArea && (
        <>
          <Box
            height={'200px'}
            mb={'0px'}
            {...getRootProps({
              className:
                theme.palette.mode === 'light'
                  ? 'drop-zone-container-styles'
                  : 'drop-zone-container-styles-dark',
            })}
          >
            <IconButton
              size="large"
              color="secondary"
              sx={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                zIndex: 10000,
              }}
              onClick={() => inputRef.current.click()}
            >
              <FileUploadIcon />
            </IconButton>
            <input {...getInputProps()} />
            {renderFiles()}
          </Box>
          <IconButton
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: '#fff',
              height: '60px',
              width: '60px',
              border: '1px solid ' + colors.greenAccent[600],
              transition: '0.3s',
              marginTop: '10px',
              marginBottom: '40px',
              ':hover': {
                backgroundColor: '#fff',
                color: colors.greenAccent[500],
              },
            }}
            onClick={handleFormSubmit}
          >
            {formPostLoading ? (
              <CircularProgress
                thickness={4}
                color="white"
                sx={{
                  ':hover': {
                    color: colors.greenAccent[500],
                  },
                }}
                variant="indeterminate"
              />
            ) : (
              <AddIcon />
            )}
          </IconButton>
        </>
      )}
      <Grid container spacing={1}>
        <Grid item md={3}>
          <Box sx={itemStyle}>
            <Typography color={boxRedColor} fontWeight={500} variant="h5">
              الرقم التلقائي : {resoponse.autoId}
            </Typography>
          </Box>
        </Grid>

        <Grid item md={4}>
          <Box sx={itemStyle}>
            <Typography color={boxRedColor}>
              تاريخ التقرير :{moment(resoponse.date).calendar('')}
            </Typography>
          </Box>
        </Grid>
        <Grid item md={5} sm={12} xs={12}>
          <Box sx={itemStyle}>
            <Typography color={boxRedColor}>
              تاريخ الحفظ : {moment(resoponse.createdAt).calendar('')}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item md={3} sm={12} xs={12}>
          <Box sx={itemStyle}>
            <Typography color={boxRedColor}>التقرير رقم : </Typography>
            <EditableBox
              value={resoponse.number}
              id={reportid}
              fieldname={'number'}
            />
          </Box>
        </Grid>

        <Grid item md={9} sm={12} xs={12}>
          <Box sx={itemStyle}>
            <Typography color={boxRedColor}>الملاحظات</Typography>
            <EditableBox
              value={resoponse.note}
              id={reportid}
              fieldname="note"
            />
          </Box>
        </Grid>
      </Grid>
      <Box sx={itemStyle}>
        <Typography color={boxRedColor}>الموضوع</Typography>
        <EditableBox
          value={resoponse.subject}
          id={reportid}
          fieldname="subject"
        />
      </Box>
      <Grid container spacing={1}>
        {(resoponse.documentFiles.length && (
          <Grid item md={4} sm={12} xs={12}>
            <Box sx={itemStyle}>
              <Typography color={boxRedColor}>المستندات المرفقة</Typography>
              <List>{renderFilesList(resoponse.documentFiles)}</List>
            </Box>
          </Grid>
        )) ||
          null}
        {(resoponse.photoFiles.length && (
          <Grid item md={4} sm={12} xs={12}>
            <Box sx={itemStyle}>
              <Typography color={boxRedColor}> الصور</Typography>
              <List>{renderFilesList(resoponse.photoFiles)}</List>
            </Box>
          </Grid>
        )) ||
          null}
        {(resoponse.videoFiles.length && (
          <Grid item md={4} sm={12} xs={12}>
            <Box sx={itemStyle}>
              <Typography color={boxRedColor}>مقاطع الفيديو</Typography>
              <List>{renderFilesList(resoponse.videoFiles)}</List>
            </Box>
          </Grid>
        )) ||
          null}
        {(resoponse.audioFiles.length && (
          <Grid item md={4} sm={12} xs={12}>
            <Box sx={itemStyle}>
              <Typography color={boxRedColor}>مقاطع الصوت</Typography>
              <List>{renderFilesList(resoponse.audioFiles)}</List>
            </Box>
          </Grid>
        )) ||
          null}
        {(resoponse.compressedFiles.length && (
          <Grid item md={4} sm={12} xs={12}>
            <Box sx={itemStyle}>
              <Typography color={boxRedColor}>الملفات المضغوطة</Typography>
              <List>{renderFilesList(resoponse.compressedFiles)}</List>
            </Box>
          </Grid>
        )) ||
          null}
      </Grid>
    </Box>
  );
}
