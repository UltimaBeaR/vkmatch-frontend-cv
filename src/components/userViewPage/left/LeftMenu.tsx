import classes from './LeftMenu.module.scss';

import { Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ListIcon from '@mui/icons-material/List';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { UserPage, UserDistribution } from "services/backend/ApiModels/UserPage";
import VkUserList from "./VkUserList";
import FillRemainingViewHeight from 'components/reusable/FillRemainingViewHeight';
import useMediaQuery from '@mui/material/useMediaQuery';

function LeftMenu() {
    const userPage = useSelector((state: any) => (state.currentUser.page as UserPage));

    const navigate = useNavigate();


    async function goToList(list: UserDistribution) {
        navigate(`/lists/${list}`);
    }

    const isBiggerThanSm = useMediaQuery((theme: any) => theme.breakpoints.up('md'));

    return (
        <div className={classes.root}>
            <List>
                <ListItem disablePadding >
                    <ListItemButton selected={userPage.openedDistribution === UserDistribution.Undistributed} onClick={() => { goToList(UserDistribution.Undistributed) }}>
                    <ListItemIcon><ListIcon fontSize='large' /></ListItemIcon>
                        { isBiggerThanSm && <ListItemText primary="Оценить" primaryTypographyProps={{fontSize: '14px'}} /> }
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton selected={userPage.openedDistribution === UserDistribution.Liked} onClick={() => { goToList(UserDistribution.Liked) }}>
                        <ListItemIcon><ThumbUpIcon fontSize='large' /></ListItemIcon>
                        { isBiggerThanSm && <ListItemText primary="Нравятся" primaryTypographyProps={{fontSize: '14px'}} /> }
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton selected={userPage.openedDistribution === UserDistribution.Disliked} onClick={() => { goToList(UserDistribution.Disliked) }}>
                        <ListItemIcon><ThumbDownIcon fontSize='large' /></ListItemIcon>
                        { isBiggerThanSm && <ListItemText primary="Не нравятся" primaryTypographyProps={{ fontSize: '14px' }} /> }
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider />
            <FillRemainingViewHeight bottomOffsetPx={24}>
                <VkUserList key={userPage.openedDistribution} showText={isBiggerThanSm} />
            </FillRemainingViewHeight>
        </div>
    );
}

export default LeftMenu;