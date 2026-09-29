'use strict';

define([''], function () {
  //*******************************************************************************************************************
  // ** Monster Data
  //*******************************************************************************************************************
  var types = [{ icon: 2, stats: [['buf', 130]], tooltip: 'Used when life drops below 75%.\nGrants 30% Damage for 4 seconds.' }, { icon: 1, stats: [['spe', 160]], tooltip: 'Used when life drops below 50%.\nGrants 60% Atk Speed for\n2 seconds.' }, { icon: 3, stats: [['hph', 10]], tooltip: 'Used when life drops below 25%.\nRestore 30% Life over 3 seconds.' }];

  return types;
});