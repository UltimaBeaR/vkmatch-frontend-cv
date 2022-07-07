import { Box, InputLabel, Slider } from "@mui/material";
import { useState } from "react";
import { useLocalId } from 'hooks/useLocalId';

function getImportanceText(value: number) {
    if (value < 10)
        return 'Не важно';

    if (value < 30)
        return 'Не очень важно';

    if (value < 35)
        return 'Не очень важно';

    if (value < 75)
        return 'Важно';

    return 'Очень важно';
}

export interface Props {
    value?: number,
    onChanged: (value: number) => void
}

function Importance(props: Props) {
    const localId = useLocalId();

    const [importance, setImportance] = useState<number>(props.value ?? 50);

    const handleImportanceChange = (event: Event, newValue: number | number[]) => {
        const value = newValue as number;

        setImportance(value);

        props.onChanged(value);
    };

    return (
        <Box>
            <InputLabel shrink={true} variant="standard" htmlFor={localId('slider')}>
                {getImportanceText(importance)}
            </InputLabel>
            <Slider valueLabelDisplay="auto" id={localId('slider')} aria-label="gender-importance" value={props.value ?? importance} onChange={handleImportanceChange} />
        </Box>
    );
}

export default Importance;