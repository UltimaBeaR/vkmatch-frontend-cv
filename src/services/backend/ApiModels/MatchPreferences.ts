export interface MatchPreferences {
    vkGroupIds: number[],
    genderOption: GenderOption
    genderImportance: number
}

export enum GenderOption {
    Any = 0,
    Male = 1,
    Female = 2
}