import { DateField, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useState } from 'react';
const dataFieldProps = {
  format: 'dd/MM/yyyy',
  views: ['year', 'month', 'day'],
  label: 'التاريخ',
  margin: 'dense',
  variant: 'outlined',
  color: 'secondary',
  fullWidth: !0,
};
export default function EditableDateField({ value: v, id, fieldname }) {
  const [value, setValue] = useState(v);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateField
        {...dataFieldProps}
        value={value}
        error={false}
        onChange={setValue}
      />
    </LocalizationProvider>
  );
}
