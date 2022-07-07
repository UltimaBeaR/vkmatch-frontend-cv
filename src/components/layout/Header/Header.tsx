import classes from './Header.module.scss';
import { ReactComponent as LogoIcon } from 'images/svg/logo.svg';

import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, Paper, SvgIcon, Typography } from "@mui/material";

import appConfig from 'appConfig';
import ProfileAvatarButton from './ProfileAvatarButton';
import vkAuthorizeService from 'services/vkAuthorizeService';
import { useSelector } from 'react-redux';
import { Account } from "services/backend/ApiModels/Account";

function Header() {
    const account = useSelector((state: any) => (state.account.account as (Account | null)));

    const isLoggedIn = account !== null;

    const navigate = useNavigate();

    const authorizeVkClickHandler = async () => {
        const authorizeUrl = vkAuthorizeService.buildVkAuthorizeUrl();

        window.location.href = authorizeUrl;
    };

    const logoClickHandler = () => {
        navigate('/');
    };

    const siteLogoElement = (
        <Box sx={{ pt: 1.5, pb: 1.5 }} className={classes['site-logo']} onClick={logoClickHandler}>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <SvgIcon component={LogoIcon} viewBox="0 0 192 192" sx={{ mr: 1 }} />
                Match
                {appConfig.isDevelopment && (
                    <Typography sx={{ ml: 1 }} color="primary" variant="caption" display="block" gutterBottom>dev</Typography>
                )}
            </Typography>
        </Box>
    );

    const authorizationBlockContents = isLoggedIn
        ? (
            <ProfileAvatarButton />
        )
        : (
            <Button variant="contained" onClick={authorizeVkClickHandler}>Авторизация в вк</Button>
        );

    return (
        <>
            <Paper elevation={2} square>
                <Container>
                    <Grid container spacing={1}>
                        <Grid item xs={2}>
                            {siteLogoElement}
                        </Grid>
                        <Grid item xs={7} />
                        <Grid item xs={3}>
                            <Box sx={{ pt: 0.5, pb: 0.5, display: 'flex', flexDirection: 'row-reverse' }}>
                                {authorizationBlockContents}
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Paper>
        </>
    );
}

export default Header;