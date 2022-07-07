import { useState } from 'react';

import {
    Avatar, Menu, MenuItem, ListItemIcon, IconButton, Tooltip, Divider
} from '@mui/material';

import {
    Logout as LogoutIcon,
    Settings as SettingsIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import vkAuthorizeService from 'services/vkAuthorizeService';
import { useSelector } from 'react-redux';
import { Account } from "services/backend/ApiModels/Account";

function ProfileAvatarButton() {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const accountProfileMenuItemHandler = () => {
        navigate('/account-profile');
    };

    const settingsMenuItemHandler = () => {
        navigate('/search-settings');
    };

    const logoutHandler = async () => {
        vkAuthorizeService.logout();
    };

    const account = useSelector((state: any) => (state.account.account as (Account | null)));

    const name = account!.firstName + ' ' + account!.lastName;

    const menuElement = (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
            <MenuItem onClick={accountProfileMenuItemHandler}>
                <Avatar alt={name} src={account!.photoUrl50} /> {name}
            </MenuItem>
            <Divider />
            <MenuItem onClick={settingsMenuItemHandler}>
                <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Настройки поиска
            </MenuItem>
            <MenuItem onClick={logoutHandler}>
                <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Выход
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <Tooltip title={name}>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <Avatar sx={{ width: 32, height: 32 }} alt={name} src={account!.photoUrl50} />
                    <KeyboardArrowDownIcon sx={{ color: '#b0b0b0' }} />
                </IconButton>
            </Tooltip>
            {menuElement}
        </>
    );
}

export default ProfileAvatarButton;