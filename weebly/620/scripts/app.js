'use strict';

requirejs.config({
  baseUrl: 'scripts',

  paths: {
    'howler': 'lib/howler',
    'polyfill': 'lib/polyfill',

    'dataAffixes': 'data/dataAffixes',
    'dataAreas': 'data/dataAreas',
    'dataForgeRewards': 'data/dataForgeRewards',
    'dataGoblets': 'data/dataGoblets',
    'dataItems': 'data/dataItems',
    'dataMonsters': 'data/dataMonsters',
    'dataMonsterMods': 'data/dataMonsterMods',
    'dataPassives': 'data/dataPassives',
    'dataStats': 'data/dataStats',
    'dataSummons': 'data/dataSummons',
    'dataTips': 'data/dataTips',

    'panelBase': 'panels/panelBase',
    'panelWorld': 'panels/panelWorld'
  }
});

requirejs(['polyfill', 'main'], function () {});