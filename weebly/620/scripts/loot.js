'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['game', 'item', 'goblet'], function (game, Item, Goblet) {
  //*******************************************************************************************************************
  // ** Loot Handler
  //*******************************************************************************************************************
  var Loot = function () {
    function Loot() {
      _classCallCheck(this, Loot);

      this.itemsGained = 0;
      this.highestMonsterLevel = 1;
      this.gobletsGained = [];
    }

    _createClass(Loot, [{
      key: 'distribute',
      value: function distribute(monster) {
        this.highestMonsterLevel = Math.max(monster.level, this.highestMonsterLevel);
        for (var i = 0; i < monster.reward; i++) {
          var probability = game.encounter.floor < game.world.area.furthestReached ? 4 : 2;
          probability += Math.max(game.world.area.itemsGained - 5, 0);
          if (Math.floor(Math.random() * probability) == 0) {
            var level = Math.floor(Math.random() * 2) == 0 ? Math.min(monster.level + 5, this.highestMonsterLevel) : monster.level;
            var item = game.loot.generateItem(level);
            game.player.gainItem(item);
            game.world.area.itemsGained += 1;
          }
        }
        var exp = (monster.level + 1) * 3 * monster.reward;
        var penalty = 1 / Math.pow(1.7, Math.max(game.player.lvl - monster.level - 1, 0));
        exp *= penalty;
        game.player.gainExperience(exp);
      }
    }, {
      key: 'giveAreaLoot',
      value: function giveAreaLoot(area) {
        if (area.goblet && !this.gobletsGained[area.goblet]) {
          var goblet = new Goblet(area.goblet);
          game.player.gainItem(goblet);
          this.gobletsGained[area.goblet] = true;
        }
      }
    }, {
      key: 'generateItem',
      value: function generateItem() {
        var aLevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var aType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var aRarity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        var level = aLevel === null ? this.highestMonsterLevel : aLevel;
        var type = aType === null ? this.itemsGained == 0 ? 0 : this.generateRandomType() : aType;
        var rarity = aRarity === null ? this.generateRandomRarity() : aRarity;
        var item = new Item(level, type, rarity);
        this.itemsGained += 1;
        return item;
      }
    }, {
      key: 'generateRandomType',
      value: function generateRandomType() {
        var possible = this.possible();
        return possible[Math.floor(Math.random() * possible.length)];
      }
    }, {
      key: 'generateRandomRarity',
      value: function generateRandomRarity() {
        var bonusRarity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        var roll = Math.random();
        var rarities = [0, 0.85, 0.95, 0.99];
        for (var i = rarities.length - 1; i >= 0; i--) {
          var iir = (game.player.iir + bonusRarity) / 100;
          var threshold = rarities[i] - (1 - rarities[i]) * iir;
          if (roll > threshold) {
            return i;
          }
        }
      }
      //*******************************************************************************************************************
      // * Other
      //*******************************************************************************************************************

    }, {
      key: 'possible',
      value: function possible() {
        return [0, 1, 2, 3, 4, 5].filter(function (t) {
          return game.player.unlockedItemType(t);
        });
      }
    }]);

    return Loot;
  }();

  return Loot;
});