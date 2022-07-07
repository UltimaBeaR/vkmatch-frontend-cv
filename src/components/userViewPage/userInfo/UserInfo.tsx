import { Link } from "@mui/material";
import { UserPage } from "services/backend/ApiModels/UserPage";

export interface Props {
    userPage: UserPage
}

function UserInfo({ userPage }: Props) {
    const userDetails = userPage.userDetails!;

    return (
        <>
            {userDetails.firstName} {userDetails.lastName} <Link href={`https://vk.com/id${userDetails.userId}`} target="_blank">Профиль VK</Link>
        </>
    );
}

export default UserInfo;