import { Route, Routes } from "react-router-dom"
import Layout from "components/layout/Layout";
import AccountProfilePage from "components/AccountProfilePage";
import NotFoundPage from "components/NotFoundPage";
import NotLoggedInPage from "components/NotLoggedInPage";
import SearchSettingsPage from "components/searchSettingsPage/SearchSettingsPage";
import { useSelector } from 'react-redux';
import { Account } from "services/backend/ApiModels/Account";
import UserViewRoute from "./UserViewRoute";

function RouteConfig() {
    const account = useSelector((state: any) => (state.account.account as (Account | null)));

    const isLoggedIn = account !== null;

    const pages = isLoggedIn
        ? (
            <>
                <Route index element={<UserViewRoute />} />
                <Route path="users/:vkUserId" element={<UserViewRoute />} />
                <Route path="users/:vkUserId/:list" element={<UserViewRoute />} />
                <Route path="lists/:list" element={<UserViewRoute />} />
                <Route path="account-profile" element={<AccountProfilePage />} />
                <Route path="search-settings" element={<SearchSettingsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </>
        )
        : (
            <Route path="*" element={<NotLoggedInPage />} />
        );

    const element = (
        <Routes>
            <Route element={<Layout />}>
                {pages}
            </Route>
        </Routes>
    );

    return element;
}

export default RouteConfig;