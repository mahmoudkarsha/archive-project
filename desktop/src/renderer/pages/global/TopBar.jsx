import {
  Box,
  IconButton,
  useTheme,
  InputBase,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContentText,
  DialogContent,
} from '@mui/material';

import { useContext, useEffect, useState } from 'react';

import { AppSettingsContext, tokens, useMode } from '../../theme';

import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/RttOutlined';
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import CloseIcon from '@mui/icons-material/CloseTwoTone';
import MinimizeIcon from '@mui/icons-material/MinimizeTwoTone';
import FullscreenIcon from '@mui/icons-material/FullscreenTwoTone';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExitTwoTone';
import DragIcon from '@mui/icons-material/DragIndicatorTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import server from 'renderer/utils/server';
import { useSnackbar } from 'notistack';

const TopBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const appSettings = useContext(AppSettingsContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [backupDialogOpened, setBackupDialogOpened] = useState(!1);
  useEffect(() => {
    window.electron.ipcRenderer.on('topbar', (e) => {
      setIsFullScreen(e.fullscreen);
    });

    window.electron.ipcRenderer.on('startserver', (e) => {
      enqueueSnackbar(typeof e === 'string' ? e : 'error');
    });
  }, []);

  function handleOpenBackupDialog() {
    setBackupDialogOpened(!0);
  }

  function backup() {
    window.electron.ipcRenderer.sendMessage('topbar', 'backup');
    setBackupDialogOpened(!1);
  }
  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* Search Box */}

      <Box borderRadius="3px" sx={{ width: '100%' }}>
        <div className="drg">
          <IconButton>
            <DragIcon />
          </IconButton>
        </div>
      </Box>

      {/* Icoms Box */}
      <Box display="flex" gap="10px">
        <IconButton
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: '#fff',
          }}
          color="secondary"
          onClick={() => setBackupDialogOpened(!0)}
        >
          {theme.palette.mode === 'dark' ? (
            <BackupOutlinedIcon />
          ) : (
            <BackupOutlinedIcon />
          )}
        </IconButton>
        <IconButton
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: '#fff',
          }}
          color="secondary"
          onClick={appSettings.toggleColorMode}
        >
          {theme.palette.mode === 'dark' ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: '#fff',
          }}
          onClick={appSettings.toggleDirection}
        >
          <NotificationsOutlinedIcon />
        </IconButton>

        {isFullScreen ? (
          <IconButton
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: '#fff',
            }}
            color="secondary"
            onClick={() => {
              window.electron?.ipcRenderer?.sendMessage(
                'topbar',
                'fullscreenexit'
              );
            }}
          >
            <FullscreenExitIcon />
          </IconButton>
        ) : (
          <IconButton
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: '#fff',
            }}
            color="secondary"
            onClick={() => {
              window.electron?.ipcRenderer?.sendMessage('topbar', 'fullscreen');
            }}
          >
            <FullscreenIcon />
          </IconButton>
        )}

        <IconButton
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: '#fff',
          }}
          color="secondary"
          onClick={() => {
            window.electron?.ipcRenderer?.sendMessage('topbar', 'minimize');
          }}
        >
          <MinimizeIcon />
        </IconButton>
        <IconButton
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: '#fff',
          }}
          color="secondary"
          onClick={() => {
            window.electron?.ipcRenderer?.sendMessage('topbar', 'close');
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Dialog
        open={backupDialogOpened}
        onClose={() => {
          setBackupDialogOpened(!1);
        }}
      >
        <DialogTitle>نسخة احتياطية</DialogTitle>
        <DialogContent>
          <DialogContentText>
            عمل نسخة احتياطية للجداول والملفات الموجودة في قاعدة البيانات
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setBackupDialogOpened(!1);
            }}
          >
            الغاء
          </Button>
          <Button color="success" variant="contained" onClick={backup}>
            نسخة احتياطية
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TopBar;
