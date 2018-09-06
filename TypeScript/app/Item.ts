// This could be splitted in multiple files for better clarity

export enum ItemType {
  AgedBrie = 'Aged Brie',
  Conjured = 'Conjured',
  Sulfuras = 'Sulfuras, Hand of Ragnaros',
  BackstagePasses = 'Backstage passes to a TAFKAL80ETC concert',
}

export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
      this.name = name;
      this.sellIn = sellIn;
      this.quality = quality;
  }
}

export class UpdateStrategy {

  public update(item: Item) {
    this.updateSellIn(item);
    this.updateQuality(item);
    this.checkMinimum(item);
    this.checkMaximum(item);
  }

  protected updateSellIn(item) {
    item.sellIn--;
  }

  protected updateQuality(item) {
    if (item.sellIn >= 0) {
      item.quality -= 1;
    } else {
      item.quality -= 2;
    }
  }

  protected checkMaximum(item) {
    if (item.quality > 50) {
      item.quality = 50;
    }
  }

  protected checkMinimum(item) {
    if (item.quality < 0) {
      item.quality = 0;
    }
  }
}

export class AgedBrieUpdateStrategy extends UpdateStrategy {
  protected updateQuality(item) {
    item.quality++;
  }
}

export class LegendUpdateStrategy extends UpdateStrategy {
  public update() {
  }
}

export class ConjuredUpdateStrategy extends UpdateStrategy {
  protected updateQuality(item: Item) {
    if (item.sellIn >= 0) {
      item.quality -= 2;
    } else {
      item.quality -= 4;
    }
  }
}

export class BackstagePassUpdateStrategy extends UpdateStrategy {
  protected updateQuality(item: Item) {
    if (item.sellIn >= 10) {
      item.quality += 1;
    } else if (item.sellIn < 10 && item.sellIn >= 5) {
      item.quality += 2;
    } else if (item.sellIn < 5 && item.sellIn >= 0) {
      item.quality += 3
    } else {
      item.quality = 0;
    }
  }
}

export class ItemUpdater  {
  public static update(item: Item) {
    const strategy = ItemUpdater.getUpdateStrategy(item);
    strategy.update(item);
  }

  private static getUpdateStrategy(item): UpdateStrategy {
    switch(item.name) {
      case ItemType.AgedBrie: return new AgedBrieUpdateStrategy();
      case ItemType.Conjured: return new ConjuredUpdateStrategy();
      case ItemType.Sulfuras: return new LegendUpdateStrategy();
      case ItemType.BackstagePasses: return new BackstagePassUpdateStrategy();
      default: return new UpdateStrategy();
    }
  }
}
