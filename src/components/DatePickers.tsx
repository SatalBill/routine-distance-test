import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

interface Props {
  formPartLabel: string;
  handleSelect: (date: dayjs.Dayjs | null) => void;
  formError: string;
}


const DatePickerMobile: React.FC<Props> = (props) => {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const TextFieldConfig: any = {
    label: props.formPartLabel,
    error: props.formError !== "",
    helperText: props.formError
  }


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={3}>
        <MobileDatePicker
          label={props.formPartLabel}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            props.handleSelect(newValue);
          }}
          renderInput={(params) => <TextField
            {...params}
            {...TextFieldConfig}

          />}
        />
      </Stack>
    </LocalizationProvider>
  );
}

const DatePickerDescktop: React.FC<Props> = (props) => {
  const [value, setValue] = React.useState<Dayjs | null>(null);
  const TextFieldConfig: any = {
    label: props.formPartLabel,
    error: props.formError !== "",
    helperText: props.formError
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label={props.formPartLabel}
        value={value}
        minDate={dayjs(new Date().toISOString().slice(0, 10))}
        onChange={(newValue) => {
          setValue(newValue);
          props.handleSelect(newValue);
        }}

        renderInput={(params) => <TextField
          {...params}
          {...TextFieldConfig}
        />}
      />
    </LocalizationProvider>

  )
}

export {
  DatePickerDescktop,
  DatePickerMobile
}
