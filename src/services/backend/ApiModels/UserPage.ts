export interface UserPage {
    isSpecificUserNotFound: boolean,
    isAnyUserNotFound: boolean,
    isUserInListNotFound: boolean,
    userDetails: UserPageUserDetails | null,
    openedDistribution: UserDistribution,
    userDistribution: UserDistribution,
    score: number
}

export interface UserPageUserDetails {
    userId: number,
    firstName: string
    lastName: string
    photoUrl50: string
}

export enum UserDistribution {
    Undistributed = 0,
    Liked = 1,
    Disliked = 2
}