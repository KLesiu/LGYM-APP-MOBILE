import { MeasurementForm } from "../types/Measurements";

export default interface AddMeasurementsPopUpProps{
    measurements: MeasurementForm,
    hideForm: ()=>void
}