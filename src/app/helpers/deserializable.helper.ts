export class Deserializable {

    constructor(data: object = {}) {
        Object.assign(this, data);
    }
}
