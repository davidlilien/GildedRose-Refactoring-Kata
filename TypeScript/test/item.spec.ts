import 'mocha';
import { expect } from 'chai';
import { GildedRose } from '../app/gilded-rose';
import { Item } from '../app/item';

describe('Item', function () {

    it('should have the given name', function() {
        const expectedValue = "aa"
        const item = new Item(expectedValue, 0, 0);
        expect(item.name).to.equal(expectedValue);
    });

    it('should have the given sellIn value', function() {
        const expectedValue = 2;
        const item = new Item(expectedValue, expectedValue, 0);
        expect(item.sellIn).to.equal(expectedValue);
    });

    it('should have the given quality value', function() {
        const expectedValue = 2;
        const item = new Item(expectedValue, 0, expectedValue);
        expect(item.quality).to.equal(expectedValue);
    });

});
