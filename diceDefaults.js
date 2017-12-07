var ___dice = {"dice" : {}, "diceGroups" : {}, "settings" : {}, "meta" : {}};

___dice.meta.version = "0.4";

//// Dark Souls Dice ////
___dice.dice.d6_DarkSouls_black = {
  "label" : "DS-Black",
  "numFaces": 6,
  "faces" : [0, 1, 1, 1, 2, 2],
  "symbols" : new Array(6).fill(null),
  "color": "black",
  "visible": false,
  "group": "Dark Souls" // new in v0.2
}
___dice.dice.d6_DarkSouls_blue = {
  "label" : "DS-Blue",
  "numFaces": 6,
  "faces" : [1, 2, 2, 2, 3, 3],
  "symbols" : new Array(6).fill(null),
  "color" : "blue",
  "visible": false,
  "group": "Dark Souls"
}
___dice.dice.d6_DarkSouls_orange = {
  "label" : "DS-Orange",
	"numFaces": 6,
  "faces" : [1, 2, 2, 3, 3, 4],
  "symbols" : new Array(6).fill(null),
	"color": "orange",
	"visible": false,
	"group": "Dark Souls"
}

//// Massive Darkness Dice ////
___dice.dice.d6_MassiveDarknes_red = {
  "label" : "MD-Red",
	"numFaces": 6,
	"faces" : [0, 1, 1, 2, 2, 3],
	"symbols" : [,,,"fa-sun-o",	"fa-sun-o",	"fa-diamond"],
	"color": "orangered",
	"visible": false,
	"group": "Massive Darkness"
}
___dice.dice.d6_MassiveDarknes_yellow = {
  "label" : "MD-Yellow",
	"numFaces": 6,
	"faces" : [0, 1, 1, 1, 1, 2],
	"symbols" : [,,,,,"fa-sun-o"],
	"color" : "gold",
	"visible": false,
	"group": "Massive Darkness"
}
___dice.dice.d6_MassiveDarknes_blue = {
  "label" : "MD-Blue",
	"numFaces": 6,
	"faces" : [0, 0, 1, 1, 1, 2],
	"symbols" : [,,,,,"fa-sun-o"],
	"color": "skyblue",
	"visible": false,
	"group": "Massive Darkness"
}
___dice.dice.d6_MassiveDarknes_green = {
  "label" : "MD-Green",
	"numFaces": 6,
	"faces" : [0, 0, 1, 2, 2, 3],
	"symbols" : [,,,"fa-sun-o",	"fa-sun-o",	"fa-diamond"],
	"color": "lawngreen",
	"visible": false,
	"group": "Massive Darkness"
}


//// dnd dice added in 0.3.1
___dice.dice.d4_DnD = {
  "label" : "d4",
  "numFaces": 4,
  "faces" : Array.apply(null, new Array(4)).map((_,i) => i+1),
  "symbols" : new Array(4).fill(null),
  "color": "lightblue",
  "visible": true,
  "group": "DnD"
}

___dice.dice.d6_DnD = {
  "label" : "d6",
  "numFaces": 6,
  "faces" : Array.apply(null, new Array(6)).map((_,i) => i+1),
  "symbols" : new Array(4).fill(null),
  "color": "darkorange",
  "visible": true,
  "group": "DnD"
}

___dice.dice.d8_DnD = {
  "label" : "d8",
  "numFaces": 8,
  "faces" : Array.apply(null, new Array(8)).map((_,i) => i+1),
  "symbols" : new Array(4).fill(null),
  "color": "orchid",
  "visible": true,
  "group": "DnD"
}

___dice.dice.d10_DnD = {
  "label" : "d10",
  "numFaces": 10,
  "faces" : Array.apply(null, new Array(10)).map((_,i) => i+1),
  "symbols" : new Array(4).fill(null),
  "color": "darkslategray",
  "visible": true,
  "group": "DnD"
}

___dice.dice.d12_DnD = {
  "label" : "d12",
  "numFaces": 12,
  "faces" : Array.apply(null, new Array(12)).map((_,i) => i+1),
  "symbols" : new Array(4).fill(null),
  "color": "crimson",
  "visible": true,
  "group": "DnD"
}

___dice.dice.d20_DnD = {
  "label" : "d20",
  "numFaces": 20,
  "faces" : Array.apply(null, new Array(20)).map((_,i) => i+1),
  "symbols" : new Array(4).fill(null),
  "color": "springgreen",
  "visible": true,
  "group": "DnD"
}

___dice.dice.d100_DnD = {
  "label" : "d100",
  "numFaces": 100,
  "faces" : Array.apply(null, new Array(100)).map((_,i) => i+1),
  "symbols" : new Array(4).fill(null),
  "color": "lightcyan",
  "visible": true,
  "group": "DnD"
}

// ORDER new in v0.4

//// new in v0.3 ////
___dice.diceGroups.DarkSouls = {};
___dice.diceGroups.DarkSouls.label = "Dark Souls";
___dice.diceGroups.DarkSouls.members = [
  "d6_DarkSouls_black",
  "d6_DarkSouls_blue",
  "d6_DarkSouls_orange"
];
___dice.diceGroups.DarkSouls.order = 2;

___dice.diceGroups.MassiveDarkness = {}
___dice.diceGroups.MassiveDarkness.label = "Massive Darkness";
___dice.diceGroups.MassiveDarkness.members = [
  "d6_MassiveDarknes_red",
  "d6_MassiveDarknes_yellow",
  "d6_MassiveDarknes_blue",
  "d6_MassiveDarknes_green"
];
___dice.diceGroups.MassiveDarkness.order = 3;

//// new in v0.3.1
___dice.diceGroups.DnD = {}
___dice.diceGroups.DnD.label = "DnD";
___dice.diceGroups.DnD.members = [
  "d4_DnD",
  "d6_DnD",
  "d8_DnD",
  "d10_DnD",
  "d12_DnD",
  "d20_DnD",
  "d100_DnD"
];
___dice.diceGroups.DnD.order = 1;

___dice.diceGroups.UserAdded = {};
___dice.diceGroups.UserAdded.label = "User Added";
___dice.diceGroups.UserAdded.members = [];
___dice.diceGroups.UserAdded.order = 0;
