import * as React from 'react';
import TextField from '@mui/material/TextField';

interface Props {
  formPartLabel: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  formError: string;
  type: string;
  value: number | null;
}

const UnLoadingSingleInputComboBox: React.FC<Props> = (props) => {
  const TextFieldConfig: any = {
    label: !props.value && props.formPartLabel,
    error: props.formError !== "",
    helperText: props.formError,
    value: props.value,
    default: props.value
  }

  return (
    <TextField
      {...TextFieldConfig}
      type={props.type}
      onChange={props.handleChange}
    />
  );
}

export default UnLoadingSingleInputComboBox;
