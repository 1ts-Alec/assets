'use strict';

define([''], function () {
    //*******************************************************************************************************************
    // ** Monster Mod Data
    //*******************************************************************************************************************
    var monsterMods = {
        powerful: { icon: 1, multis: [['dmg', 4], ['mhp', 2], ['aps', 0.5]], specialAttack: true,
            tooltip: 'Powerfull attacks:\nDeals 4x damage.' },

        poison: { icon: 3, multis: [['mhp', 1.5], ['aps', 0.8]], stats: [['poi', 4]], specialAttack: true,
            tooltip: 'Poison attacks:\nDeals 4% of max life\nas damage until death.\nMultiple poisons can stack.' },

        death: { icon: 4, multis: [['mhp', 1.3], ['aps', 0.7]], stats: [['det', 100]], specialAttack: true,
            tooltip: 'Death attacks:\nReduces life to 0.' },

        shielding: { icon: 2, multis: [['mhp', 1.3]], stats: [['shl', 1]], tooltip: 'Other monsters take\n 75% reduced damage.' },

        puppetmaster: { icon: 0, stats: [['ret', 50]] },
        puppetstand: { icon: 0, stats: [['smn', 1]] },
        scytheweave: { icon: 0, stats: [['smn', 2]] },

        portala: { icon: 0, stats: [['smn', 3]] },
        portalb: { icon: 0, stats: [['smn', 4]] },
        portalc: { icon: 0, stats: [['smn', 5]] },

        clayfalla: { icon: 0, stats: [['div', 6]] },
        clayfallb: { icon: 0, stats: [['div', 7]] },
        clayfallc: { icon: 0, stats: [['div', 8]] },
        clayfalld: { icon: 0, stats: [['div', 9]] }
    };

    return monsterMods;
});