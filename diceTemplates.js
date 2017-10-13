var ___dice = {"dice" : {}, "diceGroups" : {}, "settings" : {}, "meta" : {}};

___dice.meta.version = 0.3;

//// Dark Souls Dice ////
___dice.dice.d6_DarkSouls_black = {
  "label" : "DS-Black",
  "numFaces": 6,
  "faces" : [0, 1, 1, 1, 2, 2],
  "symbols" : new Array(6).fill(null),
  "color": "black",
  "visible": true,
  "group": "Dark Souls" // new in v0.2
}
___dice.dice.d6_DarkSouls_blue = {
  "label" : "DS-Blue",
  "numFaces": 6,
  "faces" : [1, 2, 2, 2, 3, 3],
  "symbols" : new Array(6).fill(null),
  "color" : "blue",
  "visible": true,
  "group": "Dark Souls"
}
___dice.dice.d6_DarkSouls_orange = {
  "label" : "DS-Orange",
	"numFaces": 6,
  "faces" : [1, 2, 2, 3, 3, 4],
  "symbols" : new Array(6).fill(null),
	"color": "orange",
	"visible": true,
	"group": "Dark Souls"
}

//// Massive Darkness Dice ////
___dice.dice.d6_MassiveDarknes_red = {
  "label" : "MD-Red",
	"numFaces": 6,
	"faces" : [0, 1, 1, 2, 2, 3],
	"symbols" : [,,,"fa-sun-o",	"fa-sun-o",	"fa-diamond"],
	"color": "orangered",
	"visible": true,
	"group": "Massive Darkness"
}
___dice.dice.d6_MassiveDarknes_yellow = {
  "label" : "MD-Yellow",
	"numFaces": 6,
	"faces" : [0, 1, 1, 1, 1, 2],
	"symbols" : [,,,,,"fa-sun-o"],
	"color" : "gold",
	"visible": true,
	"group": "Massive Darkness"
}
___dice.dice.d6_MassiveDarknes_blue = {
  "label" : "MD-Blue",
	"numFaces": 6,
	"faces" : [0, 0, 1, 1, 1, 2],
	"symbols" : [,,,,,"fa-sun-o"],
	"color": "skyblue",
	"visible": true,
	"group": "Massive Darkness"
}
___dice.dice.d6_MassiveDarknes_green = {
  "label" : "MD-Green",
	"numFaces": 6,
	"faces" : [0, 0, 1, 2, 2, 3],
	"symbols" : [,,,"fa-sun-o",	"fa-sun-o",	"fa-diamond"],
	"color": "lawngreen",
	"visible": true,
	"group": "Massive Darkness"
}

//// new in v0.3 ////
___dice.diceGroups.DarkSouls = {};
___dice.diceGroups.DarkSouls.label = "Dark Souls";
___dice.diceGroups.DarkSouls.members = [
  "d6_DarkSouls_black",
  "d6_DarkSouls_blue",
  "d6_DarkSouls_orange"
];

___dice.diceGroups.MassiveDarkness = {}
___dice.diceGroups.MassiveDarkness.label = "Massive Darkness";
___dice.diceGroups.MassiveDarkness.members = [
  "d6_MassiveDarknes_red",
  "d6_MassiveDarknes_yellow",
  "d6_MassiveDarknes_blue",
  "d6_MassiveDarknes_green"
];

___dice.diceGroups.UserAdded = {};
___dice.diceGroups.UserAdded.label = "User Added";
___dice.diceGroups.UserAdded.members = [];
