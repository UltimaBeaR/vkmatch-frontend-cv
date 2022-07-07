import { Autocomplete, Avatar, Box, TextField } from "@mui/material";

interface GroupDefinition {
    title: string,
    groupId: number,
    avatarUrl: string
}

// TODO: этот список групп нужно будет брать из бэка и оттуда надо брать также аватарки этих групп и отображать их в списке.
const groups: GroupDefinition[] = [
    {
        title: 'League of Legends',
        groupId: 49423435,
        avatarUrl: 'https://sun1.userapi.com/sun1-27/s/v1/ig2/IZ-S4PqHsrcptalsvsYwc-bgEhHLt29-XBbRkYmM1B5aDAGUSMLuBnWzUehMLpsMF5N-e3puCQpIpDzHl-FfN5YH.jpg?size=50x50&quality=95&crop=0,0,400,400&ava=1'
    },
    {
        title: 'Леонардо Дайвинчик',
        groupId: 91050183,
        avatarUrl: 'https://sun1.userapi.com/sun1-90/s/v1/ig2/FbCy7JKAStnjCk1YXGJSFwJwPjm3tXt1bh-r8mINMTTVreh8_tWs52NzX0mTdxWj0rV9HIuo_gTH4mrBibwZpBY2.jpg?size=50x50&amp;quality=95&amp;crop=90,246,718,718&amp;ava=1'
    }
];

export interface Props {
    value?: number[],
    onChanged: (vkGroupNameOrIds: number[]) => void
}

function VkGroupSelector(props: Props) {
    const changeHandler = (event: React.SyntheticEvent, value: GroupDefinition[]) => {
        props.onChanged(value.map(x => x.groupId));
    };

    const groupsValue = props.value !== undefined
        ? groups.filter(x => props.value!.indexOf(x.groupId) !== -1)
        : undefined;

    return (
        <Autocomplete
            value={groupsValue}
            onChange={changeHandler}
            multiple
            options={groups}
            getOptionLabel={(option) => option.title}
            renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Avatar alt={option.title} src={option.avatarUrl} />
                    <Box sx={{ ml: '10px' }}>
                        {option.title}
                    </Box>
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    variant="standard"
                    label="Группы VK"
                    placeholder="Выберите одну или несколько групп"
                />
            )}
        />
    );
}

export default VkGroupSelector;