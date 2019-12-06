import { Deserializable } from '@app/helpers/deserializable.helper';

export class PlannedPart extends Deserializable {

    public partNumber: string;
    public nomenclature: string;
    public mrpType: string;
    public unitCostNew: number;
    public unitCostUsed: number;
    public repairable: string;
    public leadTime: number;
    public availableQuantity: number;
    public totalQuantity: number;
    public shopRequiredQuantity: number;
    public bondedQuantity: number;
    public forecastQuantity90Days: number;
    public reorderPoint: number;
    public supplierCode: string;
    public supplierName: string;
    public partHealth: string;

    constructor(data: any) {
        super(data);
    }
}
