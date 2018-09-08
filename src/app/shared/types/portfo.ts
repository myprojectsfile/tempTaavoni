import { MoamelehType } from "./moameleh";

export interface PortfoType {
    _id?: string;
    username?: string;
    userId?: string;
    fullName?: string;
    tedadSahm?: number;
    arzeshSahm?: number;
    moamelat?: MoamelehType[]
}