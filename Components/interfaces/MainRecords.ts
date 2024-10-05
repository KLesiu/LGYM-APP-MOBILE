import { WeightUnits } from "../enums/Units";

export interface MainRecordsForm{
    _id?:string,
    weight:number,
    date: Date,
    exercise:string,
    unit:WeightUnits
}