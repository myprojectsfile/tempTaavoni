import { ClaimType } from "./claim";

export interface UserType {
    _id?: string;
    username?: string;
    password?: string;
    name?: string;
    family?: string;
    fullName?: string;
    codeMelli?: string;
    mobile?: string;
    enabled?: boolean
    claims?: ClaimType[]
}