'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(['game', 'panelBase'], function (game, PanelBase) {
  //*******************************************************************************************************************
  // ** Panel for Area selection
  //*******************************************************************************************************************
  var PanelWorld = function (_PanelBase) {
    _inherits(PanelWorld, _PanelBase);

    function PanelWorld(position, active) {
      _classCallCheck(this, PanelWorld);

      return _possibleConstructorReturn(this, (PanelWorld.__proto__ || Object.getPrototypeOf(PanelWorld)).call(this, position, active));
    }

    _createClass(PanelWorld, [{
      key: 'initialize',
      value: function initialize() {
        _get(PanelWorld.prototype.__proto__ || Object.getPrototypeOf(PanelWorld.prototype), 'initialize', this).call(this);
        this.act = 0;
      }
    }, {
      key: 'setupElements',
      value: function setupElements() {
        this.labels.area = { x: 4, y: 56 };
        this.bars.acts = { x: 33, y: 4, w: 26, h: 11, s: 6, n: 3, l: 3 };
        this.bars.areas = { x: 23, y: 19, w: 32, h: 32, s: 8, n: 3, l: 3 };
      }
      //*******************************************************************************************************************
      // * Create Sprites
      //*******************************************************************************************************************

    }, {
      key: 'actsBarSetupSprites',
      value: function actsBarSetupSprites(sprites, rect, index) {
        sprites.text = game.graphics.addText(Math.round(rect.x + rect.w / 2), rect.y, 'Act ' + (index + 1));
        sprites.rect = game.graphics.addRect(rect, 8, 2);
        sprites.text.anchor.x = 0.5;
      }
    }, {
      key: 'areasBarSetupSprites',
      value: function areasBarSetupSprites(sprites, rect, index) {
        sprites.icon = game.graphics.addSprite(rect.x, rect.y, '');
        sprites.rect = game.graphics.addRect(rect, 8, 2);
      }
      //*******************************************************************************************************************
      // * Update Sprites
      //*******************************************************************************************************************

    }, {
      key: 'actsBarUpdateSprites',
      value: function actsBarUpdateSprites(sprites, rect, index) {
        var firstActCleared = game.world.unlocked(3);
        var actUnlocked = this.actUnlocked(index);
        var visible = firstActCleared && actUnlocked;
        var active = this.act == index;
        sprites.text.visible = visible;
        sprites.rect.visible = visible;
        sprites.text.tint = active ? 0xffffff : 0x4f4f4f;
        //game.graphics.redrawRect(sprites.rect, rect, null, active ? 1 : 2)
      }
    }, {
      key: 'areasBarUpdateSprites',
      value: function areasBarUpdateSprites(sprites, rect, index) {
        var available = this.unlockedAt(index);
        var borderColor = 2;
        var icon = 'area' + (available ? index + this.act * 3 : 'L');
        game.graphics.redrawRect(sprites.rect, rect, 8, borderColor);
        sprites.icon.texture = game.graphics.getTexture(icon);
      }
      //*******************************************************************************************************************
      // * Input
      //*******************************************************************************************************************

    }, {
      key: 'actsBarClicked',
      value: function actsBarClicked(index) {
        var actUnlocked = this.actUnlocked(index);
        if (actUnlocked) {
          this.act = index;
        }
      }
    }, {
      key: 'areasBarClicked',
      value: function areasBarClicked(index) {
        var available = this.unlockedAt(index);
        if (available && !this.getDraggedItem()) {
          var area = this.areaAt(index);
          game.panels.activate('Battle');
          game.panels.activate('Inventory');
          game.panels.all['Battle'].setupBattle(area);
          game.panels.all['Battle'].updateRects();
          game.panels.all['Battle'].updateSpriteset();
        } else {
          game.audio.playSound('buzzer');
        }
      }
      //*******************************************************************************************************************
      // * Tooltips
      //*******************************************************************************************************************
      //*******************************************************************************************************************
      // * Other
      //*******************************************************************************************************************

    }, {
      key: 'areaLabelText',
      value: function areaLabelText() {
        var index = this.hoveringIndex();
        var available = index !== undefined && this.unlockedAt(index);
        if (available) {
          var area = this.areaAt(index);
          var name = area.name;
          var floorInfo = ' (' + area.furthestReached + '/' + area.length + ')';
          return name + floorInfo;
        }
        return '';
      }
    }, {
      key: 'getFillColor',
      value: function getFillColor(item) {
        var colors = [0, 2, 3];
        if (item) {
          return colors[item.rarity];
        }
        return 0;
      }
    }, {
      key: 'actUnlocked',
      value: function actUnlocked(index) {
        return game.world.unlocked(index * 3);
      }
    }, {
      key: 'areaAt',
      value: function areaAt(index) {
        return game.world.areas[index + this.act * 3];
      }
    }, {
      key: 'unlockedAt',
      value: function unlockedAt(index) {
        var areaIndex = index + this.act * 3;
        return game.world.unlocked(areaIndex);
      }
    }, {
      key: 'hoveringIndex',
      value: function hoveringIndex() {
        var bar = this.bars.areas;
        for (var i = 0; i < bar.n; i++) {
          var x = this.getBarRectX(i, bar);
          var y = this.getBarRectY(i, bar);
          var rect = this.adjustedRect({ x: x, y: y, w: bar.w, h: bar.h });
          if (game.input.mouseWithin(rect)) {
            return i;
          }
        }
      }
    }]);

    return PanelWorld;
  }(PanelBase);

  return PanelWorld;
});