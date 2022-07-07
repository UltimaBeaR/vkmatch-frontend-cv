/* eslint-disable react-hooks/exhaustive-deps */

import classes from './UserView.module.scss';

import { Box, Paper, Stack } from "@mui/material";
import LeftMenu from "../left/LeftMenu";
import { useSelector } from 'react-redux'
import { UserPage } from "services/backend/ApiModels/UserPage";
import Gallery from "../photos/Gallery";
import UserInfo from "../userInfo/UserInfo";
import DistributeButtons from "../DistributeButtons";

function UserViewPage() {
    const isPageLoaded = useSelector((state: any) => (state.currentUser.isPageLoaded as boolean));

    const userPage = useSelector((state: any) => (state.currentUser.page as UserPage));

    let pageContentsElement: JSX.Element | null = null;

    if (!isPageLoaded)
    {
        pageContentsElement = (
            <Box sx={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Загрузка юзеров...
            </Box>
        );
    }
    else if (userPage.isAnyUserNotFound) {
        pageContentsElement = (
            <Paper sx={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Нет юзеров. Зайдите в настройки поиска.
            </Paper>
        );
    }
    else if (userPage.isUserInListNotFound) {
        pageContentsElement = (
            <Paper sx={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Это пустой список.
            </Paper>
        );
    }
    else if (userPage.isSpecificUserNotFound) {
        pageContentsElement = (
            <Paper sx={{ height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Такого юзера нет ни в одном из ваших списков.
            </Paper>
        );
    }
    else {
        pageContentsElement = (
            <Stack>
                <Paper elevation={2} sx={{ mb: 2, padding: 1 }}>
                    <DistributeButtons userId={userPage.userDetails!.userId} />
                    <UserInfo userPage={userPage} />
                </Paper>
                <Gallery userId={userPage.userDetails!.userId} />
            </Stack>
        );
    }

    return (
        <div className={classes.root}>
            <div className={classes.left}>
                <LeftMenu />
            </div>
            <div className={classes.right}>
                {pageContentsElement}
            </div>
        </div>
    );
}

export default UserViewPage;
