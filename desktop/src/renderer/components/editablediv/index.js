import { Box, TextField, Typography, IconButton } from '@mui/material';
import React from 'react';
import EditIcon from '@mui/icons-material/EditTwoTone';
import OkIcon from '@mui/icons-material/CheckCircleTwoTone';
import WaitIcon from '@mui/icons-material/WatchOutlined';
import { useState } from 'react';
import usePut from '../../utils/usePut';
import server from '../../utils/server';
import { useSnackbar } from 'notistack';

const editableBoxStyles = {
  width: '100%',
  padding: '1px',
  borderRadius: '5px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const iconStyles = {};

const inputStyles = {
  border: 'none',
  outline: 'none',
  width: '100%',
};
export default function EditableBox({ value: v, id, fieldname }) {
  const [value, setValue] = useState(v);
  const [editMode, setEditMode] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [islaoding, setIsloading] = useState();

  const setEdit = () => setEditMode(true);
  const setView = () => setEditMode(false);

  const onChange = (e) => setValue(e.target.value);

  const updateField = () => {
    setIsloading(true);
    server
      .put(`/reports/${id}`, { field: fieldname, value }, {})
      .then((res) => {
        if (res.data.status === 'success') {
          setView();
          enqueueSnackbar('تم التعديل', { variant: 'success' });
        }
      })
      .catch((err) => {
        enqueueSnackbar('خطأ في التعديل', { variant: 'error' });
        setValue(v);
        setView();
      })
      .finally(() => setIsloading(false));
  };

  return !editMode ? (
    <Box sx={{ ...editableBoxStyles }}>
      <IconButton onClick={setEdit} sx={iconStyles}>
        <EditIcon />
      </IconButton>
      <TextField
        margin="normal"
        type="text"
        style={inputStyles}
        variant="standard"
        value={value}
        onDoubleClick={setEdit}
        InputProps={{ disableUnderline: true }}
      />
    </Box>
  ) : (
    <Box sx={editableBoxStyles}>
      {islaoding ? (
        <WaitIcon />
      ) : (
        <IconButton onClick={updateField} sx={iconStyles}>
          <OkIcon />
        </IconButton>
      )}
      <TextField
        margin="normal"
        variant="standard"
        type="text"
        style={inputStyles}
        value={value}
        onChange={onChange}
      />
    </Box>
  );
}
