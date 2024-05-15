type UserInfo={
    _id:string,
    name: string,
    admin?:boolean,
    email:string,
    rank?:string,
    profileRank?:string,
    updatedAt?:string,
    createdAt:string,
    Bp?:number,
    Dl?:number,
    Sq?:number,
    _v:number,
    plan?:string
}
export default UserInfo

export type RankInfo = {
    rank:string,
    elo:number,
    nextRank:string,
    nextRankElo:number,
    startRankElo:number
}