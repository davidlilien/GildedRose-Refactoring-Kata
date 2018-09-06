import { Item, ItemUpdater } from './item';

export class GildedRose {
    items: Array<Item>;

    constructor(items = []) {
        this.items = items;
    }

    updateQuality() {
        // Items were mutated in the original implementation 
        // so we should keep that behavior to avoid side effect in the consumers of this class
        this.items.forEach(item => ItemUpdater.update(item));
        return this.items;
    }
}

