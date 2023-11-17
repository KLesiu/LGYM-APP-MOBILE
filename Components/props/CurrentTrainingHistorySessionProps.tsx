import Training from "../types/Training"
export default interface CurrentTrainingHistorySessionProps{
    id:string,
    date:string,
    getInformationAboutHistorySession:(id: string) => Promise<Training | string>
    offCurrentTrainingHistorySession:VoidFunction
}