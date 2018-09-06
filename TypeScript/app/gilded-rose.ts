import { Item, UpdatableItem } from './item';

export class GildedRose {
    items: Array<Item>;

    constructor(items = []) {
        this.items = items;
    }

    updateQuality() {
        // Items were mutated in the original implementation 
        // so we should keep that behavior to avoid side effect in the consumers of this class
        this.items.forEach(item => {
            const updatableItem = new UpdatableItem(item);
            updatableItem.update();
        })
        return this.items;
    }
}

