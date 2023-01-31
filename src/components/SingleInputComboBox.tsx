import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { getCities } from '../api/cities';
import { City } from '../utils/types';

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
}

interface Props {
    formPartLabel: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelect: (event: React.SyntheticEvent<Element, Event>, city: City | null) => void;
    formError: string;
    value: City | null
}

const SingleInputComboBox: React.FC<Props> = (props) => {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<readonly City[]>([]);
    const loading = open && options.length === 0;
    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(50); // For demo purposes.

            if (active) {
                var cities = await getCities([]);
                setOptions(cities);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    const TextFieldConfig: any = {
        label: props.formPartLabel,
        onChange: props.handleChange,
        error: props.formError !== "",
        helperText: props.formError
    }

    return (
        <Autocomplete
            id="asynchronous-demo"
            sx={{ width: "100%" }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}

            onChange={props.handleSelect}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            onInputChange={async (event, newInputValue) => {
                setOptions([])
                var cities = await getCities([newInputValue]);
                setOptions(cities);
            }}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                    {...TextFieldConfig}
                />
            )}
        />

    );
}

export default SingleInputComboBox;
