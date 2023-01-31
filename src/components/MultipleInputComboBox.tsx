import * as React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { City } from '../utils/types';
import { getCities } from '../api/cities';

interface Props {
  formPartLabel: string;
    handleSelect: (event: React.SyntheticEvent<Element, Event>, cities: City[] | null) => void;
    value:any;
}


const MultipleInputComboBox: React.FC<Props> = (props) => {

  const [options, setOptions] = React.useState<readonly City[]>([]);

  React.useEffect(() => {
    (async () => {
      const cities = await getCities([]);
      setOptions(cities);
    })();
  }, [])

  const TextFieldConfig:any={
    label:props.formPartLabel,
    
  }

  return (
    <Autocomplete
      multiple
      id="tags-outlined"
      options={options}
          getOptionLabel={(option) => option.name}
          value={props.value}
          
      defaultValue={[]}
          filterSelectedOptions
          onChange={props.handleSelect}
      renderInput={(params) => (
        <TextField
          {...params}
          {...TextFieldConfig}
        />
      )}
    />
  );
}

export default MultipleInputComboBox;