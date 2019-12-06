export class DataHelper {

    private static readonly DEFAULT_CURRENCY_TYPE_STRING: string = 'USD';
    private static readonly DEFAULT_LOCALE_CODE: string = 'en-US';

    public static deepCopyObjectArray(objectArray: Array<any>): Array<any> {
        return objectArray.map((ele: any) => ({ ...ele }));
    }

    public static deepCopyObject(object: object): object {
        return Object.assign({ }, object);
    }

    public static formatNumberToCost(costNumber: number): string {
        const costFormatter = new Intl.NumberFormat(this.DEFAULT_LOCALE_CODE, {
            style: 'currency',
            currency: this.DEFAULT_CURRENCY_TYPE_STRING,
        });

        return costFormatter.format(costNumber);
    }

    public static isDefined(data: any): boolean {
        if (data !== null && data !== undefined) {
            return true;
        } else {
            return false;
        }
    }
}
