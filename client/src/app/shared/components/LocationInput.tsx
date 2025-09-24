import { Box, debounce, List, ListItemButton, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useController, type FieldValues, type UseControllerProps } from "react-hook-form"
import type { LocationIQSuggestion } from "src/lib/types";

type Props<T extends FieldValues> = {
    label: string
} & UseControllerProps<T> 
export default function LocationInput<T extends FieldValues>(props: Props<T>) {
    const { field, fieldState } = useController({ ...props });
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
    const handleChange = async(value: string) =>{
        field.onChange(value)
        await fetchSuggestion(value)
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
                {...props}
                value={inputValue}
                onChange={e => handleChange(e.target.value)}
                fullWidth
                variant="outlined"
                error ={!!fieldState.error}
                helperText ={fieldState.error?.message}
            />
            {loading && <Typography>Loading...</Typography>}
            {suggestions.length > 0 && (
                <List sx={{border:1}}>
                    {suggestions.map(suggestions => (
                        <ListItemButton
                            divider
                            key={suggestions.place_id}
                            onClick={() => handleSelect(suggestions)}
                        >
                            {suggestions.display_name}
                        </ListItemButton>
                    ))}
                </List>
            )}
       </Box>
    )
}
