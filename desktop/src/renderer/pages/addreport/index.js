import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  useTheme,
  Divider,
  Button,
  CircularProgress,
  LinearProgress,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDropzone } from 'react-dropzone';
import Header from '../../components/header';
import classifyFiles from '../../utils/classifyFiles';
import ImagePreviewer from './imagepreviwer';
import { tokens } from '../../theme';
import VideosPreviewer from './videopreviewer';
import AddIcon from '@mui/icons-material/AddTaskTwoTone';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfTwoTone';
import PhotoTwoToneIcon from '@mui/icons-material/PhotoTwoTone';
import VideoCameraBackTwoToneIcon from '@mui/icons-material/VideoCameraBackTwoTone';
import AudioFileTwoToneIcon from '@mui/icons-material/AudioFileTwoTone';
import FolderZipTwoToneIcon from '@mui/icons-material/FolderZipTwoTone';

import { useParams } from 'react-router-dom';
import server from '../../utils/server';
import { useSnackbar } from 'notistack';
import serverErrorHandler from 'renderer/utils/serverErrorHandler';
const initialFormFields = {
  number: {
    label: 'الرقم',
    value: '',
    touched: false,
    error: '',
  },
  subject: {
    label: 'الموضوع',
    value: '',
    touched: false,
    error: '',
  },
  date: {
    label: 'التاريخ',
    value: '',
    touched: false,
    error: '',
  },
  note: {
    label: 'الملاحظات',
    value: '',
    touched: false,
    error: '',
  },
};

export default function AddReport() {
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const path = useParams().path;
  const [paths, setPaths] = useState([]);
  const [pathLoaded, setPathLoaded] = useState(false);
  const [pathLoadingError, setPathLoadingError] = useState(null);

  const [formPostLoading, setFormPostLoading] = useState(false);
  const [formPostError, setFormPostError] = useState(null);

  const [formValues, setFormValues] = useState({
    ...initialFormFields,
    path: {
      value: path ? path : '',
      touched: true,
      error: '',
      label: 'المسار',
    },
  });
  const [files, setFiles] = useState([]);

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

  function handleDeleteFile(url) {
    setFiles((prev) => prev.filter((file) => file.preview !== url));
  }
  useEffect(() => {
    server
      .get('/folders')
      .then((response) => {
        const flatShapePaths = [];
        function spreadArray(arr) {
          arr.forEach((item) => {
            flatShapePaths.push({
              name: item.name,
              path: item.path,
              slashPath: item.path.split(',').join('/'),
            });
            if (item.children) {
              spreadArray(item.children);
            }
          });
        }
        spreadArray(response.data.tree);
        setPaths(flatShapePaths);
      })
      .catch((err) => {});
    if (!path) {
      setTimeout(() => {
        setPathLoaded(true);
      }, 100);
    } else {
      server
        .get(`/folders/${path}`)
        .then((result) => {
          setPathLoaded(true);
        })
        .catch((err) => {
          setPathLoaded(true);
          setPathLoadingError('المجلد غير موجود');
        });
    }
    return function cleanUp() {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, []);

  function handleFieldBlur(fieldname) {
    return (e) => {
      let errorMessage = '';
      if (formValues[fieldname].value.length === 0) {
        errorMessage = 'هذا الحقل مطلوب';
      }
      setFormValues((prev) => {
        return {
          ...prev,
          [fieldname]: {
            ...prev[fieldname],
            touched: true,
            error: errorMessage,
          },
        };
      });
    };
  }

  function handleFieldValueChange(fieldname) {
    return (e) => {
      let errorMessage = '';
      if (!e.target.value || (e.target.value && e.target.value.length === 0)) {
        errorMessage = 'هذا الحقل مطلوب';
      }
      setFormValues((prev) => {
        return {
          ...prev,
          [fieldname]: {
            ...prev[fieldname],
            value: e.target.value,
            error: errorMessage,
          },
        };
      });
    };
  }

  function showError(fieldname) {
    return formValues[fieldname].touched && formValues[fieldname].error.length
      ? formValues[fieldname].error
      : null;
  }
  const {
    photoFiles,
    videoFiles,
    audioFiles,
    documentFiles,
    compressedFiles,
    rejectedFiles,
  } = classifyFiles(files);

  function handleFormSubmit() {
    setFormPostLoading(true);

    const errors = [];
    Object.keys(formValues).forEach((key) => {
      if (!formValues[key].touched || formValues[key].error.length)
        errors.push(
          !formValues[key].touched
            ? formValues[key].label + ' ' + 'هذا الحقل مطلوب'
            : formValues[key].label + ' ' + formValues[key].error
        );
    });

    if (errors.length) {
      errors.forEach((err) => {
        enqueueSnackbar(err, { variant: 'error', autoHideDuration: 1000 });
      });
      setFormPostLoading(false);
      return;
    }
    const formData = new FormData();

    photoFiles.map((item) => formData.append('photofiles', item.file));
    videoFiles.map((item) => formData.append('videofiles', item.file));
    compressedFiles.map((item) =>
      formData.append('compressedfiles', item.file)
    );
    documentFiles.map((item) => formData.append('documentfiles', item.file));
    audioFiles.map((item) => formData.append('audiofiles', item.file));

    formData.set('number', formValues.number.value.replace(/\s/g, ''));
    formData.set('date', formValues.date.value);
    formData.set('subject', formValues.subject.value);
    formData.set('note', formValues.note.value);
    formData.set('path', formValues.path.value);
    server
      .post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        setFiles((prevState) => {
          prevState.forEach((el) => {
            URL.revokeObjectURL(el.preview);
          });
          return [];
        });
        setFormValues((prevState) => {
          return { ...initialFormFields, path: { ...prevState.path } };
        });
        setFormPostLoading(false);
        enqueueSnackbar('تم إضافة التقرير بنجاح', { variant: 'success' });
      })
      .catch((err) => {
        enqueueSnackbar(serverErrorHandler(err), { variant: 'error' });
        setFormPostLoading(false);
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
          width={'100%'}
          padding={'10px'}
        >
          قم باسقاط الملفات المرفقة أو انقر على المربع لفتح مستعرض الملفات
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

  const boxStyles = {
    overflow: 'hidden',
    overflowY: 'scroll',
    height: '100%',
    margin: '10px',
    padding: '20px',
  };

  return (
    <>
      {!pathLoaded && <LinearProgress />}
      {pathLoaded && (
        <Box sx={boxStyles}>
          <Header
            title={'إضافة تقرير جديد'}
            subtitle={'قم بتعبئة الحقول لاضافة تقرير جديد'}
          />
          <Grid container spacing="12">
            <Grid item md={6} sm={12} xs={12}>
              <FormControl fullWidth>
                <InputLabel id="msar">المسار</InputLabel>
                <Select
                  value={formValues.path.value}
                  labelId="msar"
                  label="المسار"
                  color="secondary"
                  onChange={handleFieldValueChange('path')}
                  onBlur={handleFieldBlur('path')}
                >
                  {paths.map((p) => {
                    return (
                      <MenuItem key={p.path} value={p.path}>
                        {p.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <br />
              <br />
              <TextField
                error={showError('number') ? true : false}
                label={showError('number') || 'الرقم'}
                value={formValues.number.value.replace(/\s/g, '')}
                margin="dense"
                variant="outlined"
                color="secondary"
                fullWidth
                onChange={handleFieldValueChange('number')}
                onBlur={handleFieldBlur('number')}
              />
              <br />
              <br />
              <TextField
                error={showError('subject') ? true : false}
                label={showError('subject') || 'الموضوع'}
                value={formValues.subject.value}
                margin="dense"
                variant="outlined"
                color="secondary"
                fullWidth
                onChange={handleFieldValueChange('subject')}
                onBlur={handleFieldBlur('subject')}
              />

              <br />
              <br />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateField
                  format="dd/MM/yyyy"
                  views={['year', 'month', 'day']}
                  error={showError('date') ? true : false}
                  label={showError('date') || 'التاريخ'}
                  value={formValues.date.value}
                  margin="dense"
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onChange={(e) => {
                    let date = JSON.stringify(e);
                    let errorMessage = '';
                    if (date === 'null') {
                      errorMessage = 'خطأ في التاريخ';
                    }

                    setFormValues((prev) => {
                      return {
                        ...prev,
                        date: { ...prev.date, value: e, error: errorMessage },
                      };
                    });
                  }}
                  onBlur={handleFieldBlur('date')}
                />
              </LocalizationProvider>

              <br />
              <br />
              <TextField
                error={showError('note') ? true : false}
                label={showError('note') || 'ملاحظات'}
                value={formValues.note.value}
                margin="dense"
                multiline
                color="secondary"
                rows={7}
                variant="outlined"
                fullWidth
                onChange={handleFieldValueChange('note')}
                onBlur={handleFieldBlur('note')}
              />
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <Box
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
            </Grid>
          </Grid>
          <IconButton
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: '#fff',
              height: '60px',
              width: '60px',
              border: '1px solid ' + colors.greenAccent[600],
              transition: '0.3s',
              marginTop: '20px',
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
        </Box>
      )}
    </>
  );
}
