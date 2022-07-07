/* eslint-disable react-hooks/exhaustive-deps */

import { Params, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { setPage } from 'store/currentUserSlice';
import { setIsLoading } from 'store/globalSlice';
import { useDispatch } from 'react-redux'
import * as backend from 'services/backend/backend';
import UserView from "components/userViewPage/UserView/UserView";
import { UserDistribution } from "services/backend/ApiModels/UserPage";

function getVkUserIdFromParams(params: Readonly<Params<string>>): number | null {
    const vkUserIdStr = params['vkUserId'];

    if (vkUserIdStr !== undefined) {
        const vkUserId = parseInt(vkUserIdStr);
        if (isNaN(vkUserId)) {
            return null;
        }

        return vkUserId;
    }

    return null;
}

function getListFromParams(params: Readonly<Params<string>>): UserDistribution | null {
    const list = params['list'];

    if (list !== undefined) {
        const userList = parseInt(list);
        if (isNaN(userList)) {
            return null;
        }

        return userList as UserDistribution;
    }

    return null;
}

function UserViewRoute() {
    const params = useParams();

    const userIdFromParams = getVkUserIdFromParams(params);
    const listFromParams = getListFromParams(params);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            dispatch(setIsLoading(true));

            const userPageFromBackend = await backend.userViewPageController.getPage(
                listFromParams,
                userIdFromParams
            );

            dispatch(setIsLoading(false));

            // Если текущий роут это дефолтная страница (без указания юзера) и при этом такой юзер нашелся на бэке - переходим на роут с этим юзером
            if (userIdFromParams == null && userPageFromBackend.userDetails !== null) {
                navigate(`/users/${userPageFromBackend.userDetails.userId}`, { replace: true });
                return;
            }

            dispatch(setPage(userPageFromBackend));
        })();
    }, [userIdFromParams, listFromParams]);

    return <UserView />;
}

export default UserViewRoute;
