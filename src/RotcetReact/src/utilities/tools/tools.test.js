import { assert } from 'chai';
import {addZeroForBelowTen} from './tools.js'

describe('Tools tests', () => {
    describe('addZeroForBelowTen tests', () => {
        it('adds zero', () => {
            let numbers = [0, 5, 9, 10, 15, 27]
            numbers = numbers.map(number => {return addZeroForBelowTen(number)})
            assert.deepEqual(numbers, ['00', '05', '09', 10, 15, 27])
        });
    });
});