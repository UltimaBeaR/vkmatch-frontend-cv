export interface UserDistributionItem {
    userId: number,
    firstName: string,
    lastName: string,
    photoUrl50: string,

    isOnline: boolean,
    lastSeen: Date,

    score: number
}