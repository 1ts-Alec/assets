'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define(['monster', 'dataMonsters'], function (Monster, DataMonsters) {
  //*******************************************************************************************************************
  // ** An Encounter
  //*******************************************************************************************************************
  var Encounter = function () {
    function Encounter(floor) {
      _classCallCheck(this, Encounter);

      this.floor = floor;
      this.monsters = [];
      this.active = [];
      this.monstersChanged = true;
    }

    _createClass(Encounter, [{
      key: 'getTargets',
      value: function getTargets(monster, type) {
        switch (type) {
          case 'cri':
            return [monster];break;
          case 'swp':
            return this.getActive();break;
          case 'cas':
            return this.getActive();break;
          case 'spl':
            return this.getSplashTargets(monster);break;
          default:
            [monster];
        }
      }
    }, {
      key: 'getSplashTargets',
      value: function getSplashTargets(monster) {
        var _this = this;

        var targets = [];
        var index = this.active.indexOf(monster);
        var surrounding = [-1, 1];
        surrounding.forEach(function (dir) {
          var withinBounds = index + dir >= 0 && index + dir < _this.active.length;
          var monster = _this.active[index + dir];
          var alive = monster && monster.hp > 0;
          if (withinBounds && monster && alive) {
            targets.push(monster);
          }
        });
        return targets;
      }
    }, {
      key: 'getActive',
      value: function getActive() {
        return this.active.filter(function (m) {
          return m;
        });
      }
    }, {
      key: 'removeMonster',
      value: function removeMonster(monster) {
        var id = this.active.indexOf(monster);
        this.active[id] = null;
      }
    }, {
      key: 'summon',
      value: function summon(summoner, data) {
        var summonerIndex = this.active.indexOf(summoner);
        //debugger
        for (var i = 0; i < data.count; i++) {
          if (this.getActive().filter(function (m) {
            return m.summoned;
          }).length >= data.upto) {
            break;
          }

          var name = data.monsters[Math.floor(Math.random() * data.monsters.length)];
          var monster = new Monster(name);
          monster.summoned = true;
          monster.timers.appear = 5;

          if (data.mods.length > 0) {
            var frequency = data.modFrequency || 1;
            if (summoner.summonCount % frequency == 0) {
              var modName = data.mods[Math.floor(Math.random() * data.mods.length)];
              monster.applyMod(modName);
            }
          }
          monster.resetAttackTimer();
          monster.setStartingStates();

          var monsterDifference = this.active.filter(function (m, i) {
            return m && i < summonerIndex;
          }).length - this.active.filter(function (m, i) {
            return m && i > summonerIndex;
          }).length;
          var l = monsterDifference == 0 && summoner.summonCount % 2 == 0 || monsterDifference < 0;
          for (var _i = summonerIndex; l ? _i >= 0 : _i < 8; l ? _i-- : _i++) {
            if (!this.active[_i] || this.active[_i].hp == 0) {
              this.monsters.push(monster);
              this.active[_i] = monster;
              summoner.summonCount += 1;
              this.summonCount += 1;
              //debugger
              break;
            }
          }
        }
      }
    }, {
      key: 'getMonsterAt',
      value: function getMonsterAt(index) {
        var monster = this.active[index];
        if (monster && monster.hp > 0) {
          return monster;
        }
      }
    }]);

    return Encounter;
  }();

  return Encounter;
});