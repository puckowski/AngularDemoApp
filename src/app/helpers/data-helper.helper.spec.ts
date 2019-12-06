import { TestBed } from '@angular/core/testing';

import { DataHelper } from './data-helper.helper';

describe('DataHelper', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    const origObject1: object = {
        cost: 1.00,
        name: 'John Doe',
        colorList: [
            'red', 'green', 'blue'
        ],
        isActive: true,
        petList: [
            {
                type: 'dog',
                gender: 'M'
            },
            {
                type: 'cat',
                gender: 'F'
            }
        ]
    };

    const origObject2: object = {
        shoppingCart: [
            {
                itemName: 'candy',
                price: 1.25
            },
            {
                itemName: 'soda',
                price: 1.50
            },
            {
                itemName: 'popcorn',
                price: 1.75
            }
        ],
        userName: 'johndoe2'
    };

    const origObjectArray1: Array<object> = [
        origObject1,
        origObject2
    ];

    it('deep copy object - unique reference', () => {
        const copiedObject: object = DataHelper.deepCopyObject(origObject1);

        const isUniqueReference: boolean = (origObject1 !== copiedObject);

        expect(isUniqueReference).toBeTruthy();
    });

    it('deep copy object - same data', () => {
        const copiedObject: object = DataHelper.deepCopyObject(origObject1);

        const isDataSame: boolean = (JSON.stringify(origObject1) === JSON.stringify(copiedObject));

        expect(isDataSame).toBeTruthy();
    });

    it('deep copy object array - unique reference', () => {
        const copiedObjectArray: Array<object> = DataHelper.deepCopyObjectArray(origObjectArray1);

        const isUniqueReference: boolean = (origObjectArray1 !== copiedObjectArray);

        expect(isUniqueReference).toBeTruthy();
    });

    it('deep copy object array - same data', () => {
        const copiedObjectArray: Array<object> = DataHelper.deepCopyObjectArray(origObjectArray1);

        const isDataSame: boolean = (JSON.stringify(origObjectArray1) === JSON.stringify(copiedObjectArray));

        expect(isDataSame).toBeTruthy();
    });
});
