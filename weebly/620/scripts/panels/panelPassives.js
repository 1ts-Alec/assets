'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['game', 'panelBase', 'dataStats'], function (game, PanelBase, DataStats) {
  //*******************************************************************************************************************
  // ** Panel for Passive Selection
  //*******************************************************************************************************************
  var PanelPassives = function (_PanelBase) {
    _inherits(PanelPassives, _PanelBase);

    function PanelPassives(position, active) {
      _classCallCheck(this, PanelPassives);

      return _possibleConstructorReturn(this, (PanelPassives.__proto__ || Object.getPrototypeOf(PanelPassives)).call(this, position, active));
    }

    _createClass(PanelPassives, [{
      key: 'initialize',
      value: function initialize() {
        _get(PanelPassives.prototype.__proto__ || Object.getPrototypeOf(PanelPassives.prototype), 'initialize', this).call(this);
      }
    }, {
      key: 'setupElements',
      value: function setupElements() {
        this.labels.passivePoints = { x: 4, y: 2 };
        this.bars.passives = { x: 20, y: 16, w: 16, h: 16, s: 1, n: 21, l: 3, d: 'down' };
      }
      //*******************************************************************************************************************
      // * Create Sprites
      //*******************************************************************************************************************

    }, {
      key: 'passivesBarSetupSprites',
      value: function passivesBarSetupSprites(sprites, rect, index) {
        sprites.rect = game.graphics.addSprite(rect.x, rect.y, 'skillBorderInactive');
        sprites.icon = game.graphics.addSprite(rect.x, rect.y, 'skill' + game.player.passives[index].icon);
      }
      //*******************************************************************************************************************
      // * Update Sprites
      //*******************************************************************************************************************

    }, {
      key: 'passivesBarUpdateSprites',
      value: function passivesBarUpdateSprites(sprites, rect, index) {
        var passive = this.passiveAt(index);
        var available = this.availableAt(index);
        var borderColor = passive.active ? 3 : 2;
        sprites.rect.texture = game.graphics.getTexture(passive.active ? 'skillBorderActive' : 'skillBorderInactive');
        sprites.icon.texture = this.getSkillTexture(passive);
        sprites.icon.visible = this.availableAt(index);
      }
      //*******************************************************************************************************************
      // * Input
      //*******************************************************************************************************************

    }, {
      key: 'passivesBarClicked',
      value: function passivesBarClicked(index) {
        var passive = this.passiveAt(index);
        if (passive.active && this.canRespec(index)) {
          passive.active = false;
          game.player.passivePoints += 1;
          game.audio.playSound('select');
        } else if (!passive.active && this.availableAt(index) && game.player.passivePoints > 0) {
          passive.active = true;
          game.player.passivePoints -= 1;
          game.audio.playSound('select');
        } else {
          game.audio.playSound('buzzer');
        }
        game.player.refreshStats();
        game.player.reset();
      }
      //*******************************************************************************************************************
      // * Tooltips
      //*******************************************************************************************************************

    }, {
      key: 'passivesBarUpdateTooltip',
      value: function passivesBarUpdateTooltip(rect, index) {
        var passive = this.passiveAt(index);
        if (this.availableAt(index)) {
          var tooltip = passive.tooltip || passive.stats.tooltip();
          this.setTooltip(rect.x, rect.y, tooltip);
        }
      }
      //*******************************************************************************************************************
      // * Labels
      //*******************************************************************************************************************

    }, {
      key: 'passivePointsLabelText',
      value: function passivePointsLabelText() {
        var s = game.player.passivePoints > 1 ? 's' : '';
        return game.player.passivePoints > 0 ? '' + game.player.passivePoints + ' Skill point' + s : '';
      }
      //*******************************************************************************************************************
      // * Passives
      //*******************************************************************************************************************

    }, {
      key: 'passiveAt',
      value: function passiveAt(index) {
        return game.player.passives[index];
      }
    }, {
      key: 'availableAt',
      value: function availableAt(index) {
        var all = game.player.passives;
        var levelReached = game.player.lvl >= 3;
        var tier = Math.floor(index / 3);
        var required = all.filter(function (p, i) {
          return Math.floor(i / 3) == tier - 1 && p.active;
        });
        return levelReached && (tier == 0 || required.length >= 1);
      }
    }, {
      key: 'canRespec',
      value: function canRespec(index) {
        var all = game.player.passives;
        var tier = Math.floor(index / 3);
        var specced = all.filter(function (p, i) {
          return Math.floor(i / 3) == tier + 1 && p.active;
        });
        var inTier = all.filter(function (p, i) {
          return Math.floor(i / 3) == tier && p.active;
        });
        return specced.length == 0 || inTier.length >= 2;
      }
    }, {
      key: 'getSkillTexture',
      value: function getSkillTexture(passive) {
        var iconName = 'skill' + passive.icon;
        return passive.active ? game.graphics.getTexture(iconName) : game.graphics.getModifiedTexture(iconName, 'disabled');
      }
    }]);

    return PanelPassives;
  }(PanelBase);

  return PanelPassives;
});