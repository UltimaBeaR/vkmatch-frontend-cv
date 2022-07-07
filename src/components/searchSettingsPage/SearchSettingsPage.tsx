import { Box, Grid, Paper } from "@mui/material";
import { LoadingButton } from '@mui/lab';

import * as backend from 'services/backend/backend';
import GenderSelector from "./GenderSelector";
import Importance from "./Importance";
import VkGroupSelector from "./VkGroupSelector";
import { useState } from "react";
import { GenderOption } from "services/backend/ApiModels/MatchPreferences";

function SearchSettingsPage() {
    const [isSaving, setIsSaving] = useState(false);

    const [vkGroupIds, setVkGroupIds] = useState<number[]>([ 49423435 ]);
    const [genderOption, setGenderOption] = useState<GenderOption>(GenderOption.Female);
    const [genderImportance, setGenderImportance] = useState<number>(70);

    const saveMatchPreferences = async () => {
        setIsSaving(true);

        const saved = await backend.matchPreferences.save({
            vkGroupIds: vkGroupIds,
            genderOption: genderOption,
            genderImportance: genderImportance
        });

        setIsSaving(false);

        if (!saved) {
            alert('Не удалось сохранить (другое сохранение уже в процессе)');
        }
    };

    const groupsChangedHandler = (groupIds: number[]) => {
        setVkGroupIds(groupIds);
    };

    const genderChangedHandler = (gender: GenderOption) => {
        setGenderOption(gender);
    };

    const importanceChangedHandler = (value: number) => {
        setGenderImportance(value);
    };

    return (
        <Paper sx={{ minHeight: '50vh', padding: '50px' }}>
            <Box sx={{ color: 'primary.main', mb: '20px' }}>
                Настройки поиска
            </Box>
            <Grid container spacing={2} sx={{ mb: '20px' }}>
                <Grid item xs={12} sm={9} md={7} lg={6}>
                    <VkGroupSelector value={vkGroupIds}  onChanged={groupsChangedHandler} />
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: '20px' }}>
                <Grid item xs={12} sm={3} md={2} lg={2}>
                    <GenderSelector value={genderOption} onChanged={genderChangedHandler} />
                </Grid>
                <Grid item xs={12} sm={9} md={7} lg={6}>
                    <Importance value={genderImportance} onChanged={importanceChangedHandler} />
                </Grid>
            </Grid>
            <Box>
                <LoadingButton loading={isSaving} variant="contained" onClick={saveMatchPreferences}>Сохранить</LoadingButton>
            </Box>
        </Paper>
    );
}

export default SearchSettingsPage;