import {
  Box,
  CircularProgress,
  InputAdornment,
  List,
  ListItemButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { debounce } from "@mui/material/utils";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form"
import type { LocationIQSuggestion } from "src/lib/types";

type Props<T extends FieldValues> = {
    label: string
} & UseControllerProps<T> 
export default function LocationInput<T extends FieldValues>({ label, ...controllerProps }: Props<T>) {
    const { field, fieldState } = useController({ ...controllerProps });
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);
    const locationUrl = 'https://api.locationiq.com/v1/autocomplete?key=pk.b3fbf44bf06d14d195ffa1ca579f6b8c&limit=5&dedupe=1&'
    const [inputValue, setInputValue] = useState(field.value || '')

    useEffect(() => {
        if(field.value && typeof field.value === 'object'){
            setInputValue(field.value.venue || '')
        }else {
            setInputValue(field.value || '')
        }
    },[field.value])
    const fetchSuggestion = useMemo(
        () => debounce(async(query: string) => {
            if(!query|| query.length < 3) {
                setSuggestions([]);
                return;
            }
            setLoading(true)
            try {
                const res = await axios.get<LocationIQSuggestion[]>(`${locationUrl}q=${query}`)
                setSuggestions(res.data)
            } catch (error) {
                console.log(error)
            }finally
            {
                setLoading(false)
            }
        }, 500), [locationUrl]
    )
    useEffect(() => {
        return () => {
            if (typeof fetchSuggestion.clear === 'function') {
                fetchSuggestion.clear();
            }
        };
    }, [fetchSuggestion])
    const handleChange = (value: string) =>{
        field.onChange(value)
        fetchSuggestion(value)
    }
    const handleSelect =(location: LocationIQSuggestion) => {
        const city  = location.address?.city
            || location.address?.town
            || location.address?.village
            || location.address?.suburb
            || location.address?.county
            || location.address?.state
            || location.display_place
            || location.display_name;
        const venue = location.display_name
        const latitude = parseFloat(location.lat)
        const longitude = parseFloat(location.lon)

        setInputValue(venue);
        field.onChange({city, venue,latitude, longitude})
        setSuggestions([])
    }
    return (
       <Box>
            <TextField
                fullWidth
                label={label}
                name={field.name}
                value={inputValue}
                onChange={e => handleChange(e.target.value)}
                onBlur={field.onBlur}
                variant="outlined"
                error ={!!fieldState.error}
                helperText ={fieldState.error?.message}
                InputProps={
                    loading
                        ? {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <CircularProgress size={18} thickness={5} color="secondary" />
                                </InputAdornment>
                            ),
                        }
                        : undefined
                }
            />
            {suggestions.length > 0 && (
                <Paper elevation={6} sx={{ mt: 1, borderRadius: 3 }}>
                    <List>
                        {suggestions.map((suggestion) => (
                            <ListItemButton
                                divider
                                key={suggestion.place_id}
                                onClick={() => handleSelect(suggestion)}
                            >
                                <Typography variant="body2" fontWeight={500}>
                                    {suggestion.display_name}
                                </Typography>
                            </ListItemButton>
                        ))}
                    </List>
                </Paper>
            )}
            {!loading && inputValue.length > 2 && suggestions.length === 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                    No matches yet—try refining your search.
                </Typography>
            )}
       </Box>
    )
}
