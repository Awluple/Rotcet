import { assert } from 'chai';

import {toDateObjects, checkIfOutdated, organizeScreenings} from './scripts.js'

describe('Utilities screenings scripts tests', () => {
    describe('toDateObjects tests', () => {
        it('converts dates', () => {
            const datesAsString = ["2020-02-26T12:09:43Z", "2020-02-26T14:31:38Z",]
            const returned = toDateObjects(datesAsString)
            const date1 = new Date('2020-02-26T12:09:43')
            const date2 = new Date('2020-02-26T14:31:38')
            assert.deepEqual(returned, [date1,date2])
        });
    });
    describe('checkIfOutdated tests', () => {
        it('handles outdates', () => {
            const date = new Date()
            date.setDate(date.getDate() - 10)
            assert.isTrue(checkIfOutdated(date))
        })

        it('passes correct dates', () => {
            const date = new Date()
            date.setDate(date.getDate() + 10)
            assert.isFalse(checkIfOutdated(date))
        } )
    })
    describe('checkIfOutdated tests', () => {
        it('passes correct dates', () => {
            let date = new Date()
            date.setDate(date.getDate() - 10)
            assert.isTrue(checkIfOutdated(date))
        })

        it('handles outdates', () => {
            let date = new Date()
            date.setDate(date.getDate() + 10)
            assert.isFalse(checkIfOutdated(date))
        } )
    })
    
    describe('organizeScreenings tests', () => {
        beforeEach(() => {
            global.date1 = new Date(2200, 6, 20, 9, 9)
            global.date2 = new Date(2200, 6, 20, 11, 11)
            global.date3 = new Date(2200, 6, 25, 11, 11)
            global.date4 = new Date(2000, 1, 10)
        })

        it('creates dates list', () => {
            const returned = organizeScreenings([global.date1, global.date2, global.date3, global.date4])
            const expectedDays = ['20.7.2200', '25.7.2200']
            assert.deepEqual(returned['days'], expectedDays)
        })

        it('sorts ascending', () => {
            const returned = organizeScreenings([global.date3, global.date1])
            const expectedDays = ['20.7.2200', '25.7.2200']
            assert.deepEqual(returned['days'], expectedDays)
        })

        it('organize screenings', () => {
            const returned = organizeScreenings([global.date1, global.date2, global.date3, global.date4])
            const expected = {
                days: ['20.7.2200', '25.7.2200'],
                '20.7.2200': ['9:09', '11:11'],
                '25.7.2200': ['11:11']
            }
            assert.deepEqual(returned, expected)
        })

        it('adds 0 for minutes below 10', () => {
            const returned = organizeScreenings([global.date1])
            assert.equal(returned['20.7.2200'][0], '9:09')
        })
    })
});