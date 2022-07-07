import { MenuItem, TextField } from "@mui/material";
import React, { useState } from "react";
import { GenderOption } from 'services/backend/ApiModels/MatchPreferences';

const genderOptions = [
    {
        title: 'Любой',
        gender: GenderOption.Any
    },
    {
        title: 'Мужской',
        gender: GenderOption.Male
    },
    {
        title: 'Женский',
        gender: GenderOption.Female
    }
];

export interface Props {
    value?: GenderOption,
    onChanged: (gender: GenderOption) => void
}

function GenderSelector(props: Props) {
    const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value) as GenderOption;

        props.onChanged(value);
    };

    return (
        <TextField
            fullWidth={true}
            select
            label="Пол"
            value={props.value}
            onChange={handleGenderChange}
            variant="standard"
        >
            {genderOptions.map((option) => (
                <MenuItem key={option.gender} value={option.gender}>
                    {option.title}
                </MenuItem>
            ))}
        </TextField>
    );
}

export default GenderSelector;