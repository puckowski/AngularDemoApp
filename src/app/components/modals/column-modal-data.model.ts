export class ColumnModalData {

    private gridApiKey; number;

    constructor(gridApiKey: number) {
        this.gridApiKey = gridApiKey;
    }

    public getApiKey(): number {
        return this.gridApiKey;
    }
}
