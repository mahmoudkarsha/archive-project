import { Box, Typography } from '@mui/material';
import React from 'react';

export default function Header({ title, subtitle }) {
  return (
    <Box m={'0px 0px 30px 0px'} top="0" position={'static'}>
      <Typography variant="h3">{title}</Typography>
      <Typography variant="h6" color="secondary">
        {subtitle}
      </Typography>
    </Box>
  );
}
