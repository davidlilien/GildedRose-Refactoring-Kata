import 'mocha';
import { expect } from 'chai';
import { GildedRose } from '../app/gilded-rose';
import Item from '../app/Item';

enum ItemType {
    AgedBrie = 'Aged Brie',
    Conjured = 'Conjured',
    Sulfuras = 'Sulfuras, Hand of Ragnaros',
    BackstagePasses = 'Backstage passes to a TAFKAL80ETC concert',
}

class ItemFactory {
    public static createAgedBrieItem = (sellIn: number, quality: number) => 
        ItemFactory.createItem(ItemType.AgedBrie, sellIn, quality);
    public static createConjuredItem = (sellIn: number, quality: number) => 
        ItemFactory.createItem(ItemType.Conjured, sellIn, quality);
    public static createSulfurasItem = () => 
        ItemFactory.createItem(ItemType.Sulfuras, 0, 80);
    public static createBackstagePassItem = (sellIn: number, quality: number) => 
        ItemFactory.createItem(ItemType.BackstagePasses, sellIn, quality);
    public static createItem = (name: ItemType | string, sellIn: number, quality: number) => 
        new Item(name, sellIn, quality);
}

describe('Gilded Rose', function () {

    it('updateQuality without items should do nothing', function() {
        const gildedRose = new GildedRose();
        expect(gildedRose.items).to.equal([]);
    });

    it('Item quality should never be more than 50 except for legendary items', function() {
        const items = [
            ItemFactory.createAgedBrieItem(10, 10),
            ItemFactory.createBackstagePassItem(10, 10),
            ItemFactory.createConjuredItem(10,10),
            ItemFactory.createItem('generic',10,10),
        ];
        run(items, item => item.quality <= 50);
    });

    it('Item quality should always be positive', function() {
        const items = [
            ItemFactory.createAgedBrieItem(10, 10),
            ItemFactory.createBackstagePassItem(10, 10),
            ItemFactory.createSulfurasItem(),
            ItemFactory.createConjuredItem(10,10),
            ItemFactory.createItem('generic',10,10),
        ];
        run(items, item => item.quality >= 0);
    });

    it('quality should descrease by one if remaining days is posisive', function() {
        const initialQuality = 100;
        const item = ItemFactory.createItem("Generic", 10, initialQuality);
        const gildedRose = new GildedRose([item]);
        gildedRose.updateQuality();
        expect(item.quality === initialQuality - 1).to.be.true;
    });

    it('quality should descrease by two if remaining days is over', function() {
        const initialQuality = 100;
        const item = ItemFactory.createItem("Generic", -1, initialQuality);
        const gildedRose = new GildedRose([item]);
        gildedRose.updateQuality();
        expect(item.quality === initialQuality - 2).to.be.true;
    });

    it('quality should increase for Aged Brie before sellIn 0', function() {
        const initialQuality = 10;
        const item = ItemFactory.createAgedBrieItem(20, initialQuality);
        const gildedRose = new GildedRose([item]);
        gildedRose.updateQuality();
        expect(initialQuality < item.quality).to.be.true;
    });

    it('quality should increase for Aged Brie after sellIn 0', function() {
        const initialQuality = -1;
        const item = ItemFactory.createAgedBrieItem(20, initialQuality);
        const gildedRose = new GildedRose([item]);
        gildedRose.updateQuality();
        expect(initialQuality < item.quality).to.be.true;
    });

    it('Sulfuras quality should always be equal to 80', function() {
        const item = ItemFactory.createSulfurasItem();
        run([item], item => item.quality === 80);
    });

    it('Sulfuras sellIn value should always be 0', function() {
        const item = ItemFactory.createSulfurasItem();
        run([item], item => item.sellIn === 0);
    });

    it('quality should increase for backstage passes until sellIn 0', function() {
        const item = ItemFactory.createBackstagePassItem(20, 10);
        const gildedRose = new GildedRose([item]);
        for (let i = 0; i<100; i++) {
            const previousQuality = item.quality;
            gildedRose.updateQuality();
            if (item.sellIn >= 0) {
                expect(item.quality > previousQuality).to.be.true;
            }
        }
    });

    it('quality should increase by 2 for backstage passes between 10 and 5 sellIn', function() {
        const item = ItemFactory.createBackstagePassItem(20, 10);
        const gildedRose = new GildedRose([item]);
        for (let i = 0; i<100; i++) {
            const previousQuality = item.quality;
            gildedRose.updateQuality();
            if (item.sellIn < 10 && item.sellIn >= 5) {
                expect(item.quality - 2 === previousQuality).to.be.true;
            }
        }
    });

    it('quality should increase by 3 for backstage passes between 5 and 0 sellIn', function() {
        const item = ItemFactory.createBackstagePassItem(20, 10);
        const gildedRose = new GildedRose([item]);
        for (let i = 0; i<100; i++) {
            const previousQuality = item.quality;
            gildedRose.updateQuality();
            if (item.sellIn < 5 && item.sellIn >= 0) {
                expect(item.quality - 3 === previousQuality).to.be.true;
            }
        }
    });

    it('quality should drop to 0 for backstage passes when 0 sellIn', function() {
        const item = ItemFactory.createBackstagePassItem(0, 50);
        const gildedRose = new GildedRose([item]);
        gildedRose.updateQuality();
        expect(item.quality === 0).to.be.true;
    });
/*
    it('quality should decrease two times faster for conjured items', function() {
        const item = ItemFactory.createConjuredItem(20, 20);
        const gildedRose = new GildedRose([item]);
        gildedRose.updateQuality();
        expect(item.quality === 18).to.be.true;
    });
*/

});

const run = (items: Item[], condition: any) => {
    const gildedRose = new GildedRose(items);
    for (let i=0; i<100; i++) {
        gildedRose.updateQuality();
        gildedRose.items.forEach(item => {
            expect(condition(item)).to.be.true;
        })
    }
}
