import { useState } from 'react';
import {
  Sidebar,
  Menu,
  MenuItem,
  sidebarClasses,
  menuClasses,
  SubMenu,
} from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { tokens } from '../../theme';

import DonutSmallTwoToneIcon from '@mui/icons-material/DonutSmallTwoTone';
import ScreenSearchDesktopTwoToneIcon from '@mui/icons-material/ScreenSearchDesktopTwoTone';
import CreateNewFolderTwoToneIcon from '@mui/icons-material/CreateNewFolderTwoTone';
import BackupTableTwoToneIcon from '@mui/icons-material/BackupTableTwoTone';
import CloudCircleTwoToneIcon from '@mui/icons-material/CloudCircleTwoTone';
import ListAltTwoToneIcon from '@mui/icons-material/ListAltTwoTone';

const itemIconStyles = {
  fontSize: '23px',
};
const Item = ({ title, to, selected, icon, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      icon={icon}
      onClick={() => setSelected(title)}
      component={<Link to={to} />}
    >
      <Typography variant="h5">{title}</Typography>
    </MenuItem>
  );
};
const SideBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState('Dashboard');
  return (
    <Sidebar
      rtl={theme.direction === 'ltr' ? !1 : !0}
      collapsed={isCollapsed}
      style={{
        borderRight: 'none',
        borderLeft: 'none',
      }}
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: colors.primary[400],
        },
        width: '300px',
      }}
    >
      <Menu
        iconShape="square"
        rootStyles={{
          [`.${menuClasses.button}`]: {
            transition: '0.2s',
            backgroundColor: 'transparent',
          },
          [`.${menuClasses.button}:hover`]: {
            backgroundColor: colors.greenAccent[500],
            color: '#fff',
          },

          [`.${menuClasses.active}`]: {
            backgroundColor: colors.greenAccent[500],
            color: '#fff',
          },
        }}
      >
        <MenuItem
          onClick={() => setIsCollapsed(!isCollapsed)}
          icon={
            isCollapsed ? (
              <CloudCircleTwoToneIcon
                style={{
                  fontSize: '25px',
                }}
              />
            ) : undefined
          }
          style={{ margin: '10px 0 0px 0', color: colors.grey[100] }}
        >
          {!isCollapsed && (
            <Box display="flex" justifyContent="flex-start">
              <IconButton>
                <CloudCircleTwoToneIcon
                  style={{
                    fontSize: '34px',
                    transition: '0.4s',
                  }}
                />
              </IconButton>
              <Typography
                variant="h4"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 500,
                  transition: '0.4s',
                  ':hover': {
                    color: '#fff',
                  },
                }}
              >
                برنامج الأرشيف
              </Typography>
            </Box>
          )}
        </MenuItem>

        {!isCollapsed && (
          <Box>
            {/*   <Box display="flex" justifyContent="center" mb="20px">
                            <img
                                alt="user-profile"
                                height="100px"
                                width="100px"
                                src="../../tt.jpg"
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '50%',
                                }}
                            />
                        </Box> */}
            <Box textAlign="center" mt={'10px'}>
              <Typography variant="h6" color={colors.greenAccent[400]}>
                لادارة الملفات والبحث الذكي
              </Typography>
            </Box>
          </Box>
        )}

        <Box paddingLeft={isCollapsed ? undefined : '0%'}>
          <Typography
            variant="h6"
            color={colors.grey[600]}
            m={isCollapsed ? '25px 0 10px 15px' : '25px 30px 7px 30px'}
          >
            الرئيسية
          </Typography>
          <Item
            selected={selected}
            icon={<DonutSmallTwoToneIcon sx={itemIconStyles} />}
            setSelected={setSelected}
            title="الاحصائيات"
            to="/"
          />
          <Item
            selected={selected}
            icon={<ScreenSearchDesktopTwoToneIcon sx={itemIconStyles} />}
            setSelected={setSelected}
            title="البحث الذكي"
            to="/search"
          />

          <Typography
            variant="h6"
            color={colors.grey[600]}
            m={isCollapsed ? '25px 0 10px 15px' : '25px 30px 7px 30px'}
          >
            ادارة التقارير
          </Typography>

          <Item
            selected={selected}
            icon={<CreateNewFolderTwoToneIcon sx={itemIconStyles} />}
            setSelected={setSelected}
            title="تقرير جديد"
            to="/addreport"
          />

          <Item
            selected={selected}
            icon={<BackupTableTwoToneIcon sx={itemIconStyles} />}
            setSelected={setSelected}
            title="جدول التقارير"
            to="/reportstable"
          />

          <Typography
            variant="h6"
            color={colors.grey[600]}
            m={isCollapsed ? '25px 0 10px 15px' : '25px 30px 7px 30px'}
          >
            ادارة الاقسام
          </Typography>

          <Item
            selected={selected}
            icon={<ListAltTwoToneIcon sx={itemIconStyles} />}
            setSelected={setSelected}
            title="استعراض المجلدات"
            to="/browsefolders"
          />

          {/* s */}
        </Box>
      </Menu>
    </Sidebar>
  );
};

export default SideBar;
