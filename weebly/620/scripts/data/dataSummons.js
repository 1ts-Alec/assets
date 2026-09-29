'use strict';

define([''], function () {
  //*******************************************************************************************************************
  // ** Monster Summoning Data
  //*******************************************************************************************************************
  var summons = [{}, { monsters: ['puppetball'], count: 1, upto: 2, timer: 150, mods: ['shielding'] }, { monsters: ['scythe'], count: 1, upto: 2, timer: 120, mods: ['death'], modFrequency: 2 }, { monsters: ['troglodyte', 'deider'], count: 1, upto: 2, timer: 90, mods: [] }, { monsters: ['beholder', 'tarus'], count: 1, upto: 2, timer: 150, mods: ['poison'], modFrequency: 2 }, { monsters: ['manticore', 'freet'], count: 1, upto: 2, timer: 120, mods: ['shielding'], modFrequency: 2 }, { monsters: ['rubble', 'claysnail', 'clayrock'], count: 2, upto: 9, timer: 0, mods: [] }, { monsters: ['rubble', 'claysnail', 'clayrock'], count: 3, upto: 9, timer: 0, mods: ['powerful'], modFrequency: 3 }, { monsters: ['golem', 'spiked'], count: 2, upto: 9, timer: 0, mods: ['clayfallb'] }, { monsters: ['rubble', 'claysnail', 'clayrock'], count: 5, upto: 9, timer: 0, mods: [] }];

  return summons;
});