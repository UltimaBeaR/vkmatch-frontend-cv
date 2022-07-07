import classes from './UserListItem.module.scss';

import { Avatar, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { UserDistributionItem } from "services/backend/ApiModels/UserDistributionItem";

import Badge from '@mui/material/Badge';

interface Props {
    user: UserDistributionItem,
    isSelected: boolean,
    isHandled: boolean,
    onUserClick(vkUserId: number): void,
    showText: boolean
}

function UserListItem({ user, isSelected, isHandled, onUserClick, showText }: Props) {
    const name = user.firstName + ' ' + user.lastName;

    const avatarInner = <Avatar sx={{ width: 40, height: 40 }} alt={name} src={user.photoUrl50} />;
    let avatar;

    if (user.isOnline) {
        avatar = (
            <Badge
                badgeContent={<div className={classes['online-circle']} />}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                {avatarInner}
            </Badge>
        );
    }
    else {
        const ms = (new Date()).getTime() - user.lastSeen.getTime();

        const minutesMs = 1000 * 60;

        if (ms < minutesMs * 60) {
            avatar = (<Badge
                badgeContent={<div className={classes['seen-recently-circle']} />}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                {avatarInner}
            </Badge>);
        }
        else
        {
            avatar = avatarInner;
        }
    }

    return (
        <ListItem disablePadding>
            <ListItemButton selected={isSelected} onClick={() => onUserClick(user.userId)} className={ isHandled ? classes.grayscale : undefined }>
                <ListItemIcon>{avatar}</ListItemIcon>
                { showText && <ListItemText primary={name} primaryTypographyProps={{ fontSize: '14px' }} /> }
            </ListItemButton>
        </ListItem>
    );
}

export default UserListItem;