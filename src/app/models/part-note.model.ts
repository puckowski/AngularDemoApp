import { Deserializable } from '@app/helpers/deserializable.helper';

export class PartNote extends Deserializable {

    public id: number;
    public title: string;
    public description: string;
    public createdAt: Date;
    public updatedAt: Date;
    public createdAtString: string;
    public updatedAtString: string;

    constructor(data: any) {
        super(data);

        this.createdAtString = new Date(this.createdAt).toLocaleString();
        this.updatedAtString = new Date(this.updatedAt).toLocaleString();
    }
}
