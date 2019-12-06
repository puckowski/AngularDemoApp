import { GridApi, ColumnApi } from 'ag-grid-community';

export class AgGridReady {

    private readonly DEFAULT_TYPE: string = 'gridReady';

    public api: GridApi;
    public columnApi: ColumnApi;
    public type: string;

    constructor() {
        this.api = null;
        this.columnApi = null;
        this.type = this.DEFAULT_TYPE;
    }
}
