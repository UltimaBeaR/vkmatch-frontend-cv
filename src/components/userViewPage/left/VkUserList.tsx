/* eslint-disable react-hooks/exhaustive-deps */

import UserList, { UsersChunk } from "components/reusable/UserList/UserList";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserPage } from "services/backend/ApiModels/UserPage";
import * as backend from 'services/backend/backend';
import { reset } from 'store/vkUserListSlice';
import { useNavigate } from "react-router-dom";

export interface Props {
    showText?: boolean
}

function VkUserList({ showText = true }: Props) {
    const userPage = useSelector((state: any) => (state.currentUser.page as UserPage));
    const handledUserIds = useSelector((state: any) => (state.vkUserList.handledUserIds as number[]));

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(reset());
    }, []);

    async function getNextChunk(offset: number, limit: number): Promise<UsersChunk> {
        const usersChunk = await backend.userDistribution.getDistribution(offset, limit, userPage.openedDistribution);

        return {
            totalCount: usersChunk.totalCount,
            users: usersChunk.items
        };
    }

    async function userClickedHandler(vkUserId: number) {
        navigate(`/users/${vkUserId}/${userPage.openedDistribution}`);
    }

    return (
        <UserList
            getNextUsersChunk={getNextChunk}
            onUserClick={userClickedHandler}
            width="100%" height="100%"
            chunkSize={50}
            selectedUserId={userPage.userDetails === null ? undefined : userPage.userDetails.userId}
            handledUserIds={handledUserIds}
            showText={showText}
        />
    );
}

export default VkUserList;