import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import server from 'renderer/utils/server';
import serverErrorHandler from 'renderer/utils/serverErrorHandler';

export default function Login({ user, setLogged }) {
  const from = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function login() {
    server
      .post('/login', { username, password })
      .then(() => {
        setLogged(true);
      })
      .catch((err) => {
        enqueueSnackbar(serverErrorHandler(err), { variant: 'error' });
      });
  }
  if (user) return <Navigate to={'/'} />;
  return (
    <Dialog open={true} dir="rtl">
      <DialogTitle>تسجيل الدخول</DialogTitle>

      <DialogContent
        sx={{
          width: '400px',
        }}
      >
        <TextField
          label={'كلمة المرور'}
          value={password}
          margin="dense"
          variant="outlined"
          color="secondary"
          fullWidth
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() =>
            window.electron.ipcRenderer.sendMessage('topbar', 'close')
          }
        >
          اغلاق البرنامج
        </Button>
        <Button variant="contained" color="success" onClick={login}>
          تسجيل الدخول
        </Button>
      </DialogActions>
    </Dialog>
  );
}
