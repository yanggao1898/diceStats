const diceTmpl = function() {
  ___tmpl = {"dice": {}, "groups": {}};

  //// Dark Souls Dice ////
  ___tmpl.dice.d6_DarkSouls_black = {
    "label" : "DS-Black",
    "numFaces": 6,
    "faces" : [0, 1, 1, 1, 2, 2],
    "symbols" : new Array(6).fill(null),
    "color": "black",
    "visible": true,
    "group": "Dark Souls" // new in v0.2
  }
  ___tmpl.dice.d6_DarkSouls_blue = {
    "label" : "DS-Blue",
    "numFaces": 6,
    "faces" : [1, 2, 2, 2, 3, 3],
    "symbols" : new Array(6).fill(null),
    "color" : "blue",
    "visible": true,
    "group": "Dark Souls"
  }
  ___tmpl.dice.d6_DarkSouls_orange = {
    "label" : "DS-Orange",
  	"numFaces": 6,
    "faces" : [1, 2, 2, 3, 3, 4],
    "symbols" : new Array(6).fill(null),
  	"color": "orange",
  	"visible": true,
  	"group": "Dark Souls"
  }

  //// Massive Darkness Dice ////
  ___tmpl.dice.d6_MassiveDarknes_red = {
    "label" : "MD-Red",
  	"numFaces": 6,
  	"faces" : [0, 1, 1, 2, 2, 3],
  	"symbols" : [,,,"fa-sun-o",	"fa-sun-o",	"fa-diamond"],
  	"color": "orangered",
  	"visible": true,
  	"group": "Massive Darkness"
  }
  ___tmpl.dice.d6_MassiveDarknes_yellow = {
    "label" : "MD-Yellow",
  	"numFaces": 6,
  	"faces" : [0, 1, 1, 1, 1, 2],
  	"symbols" : [,,,,,"fa-sun-o"],
  	"color" : "gold",
  	"visible": true,
  	"group": "Massive Darkness"
  }
  ___tmpl.dice.d6_MassiveDarknes_blue = {
    "label" : "MD-Blue",
  	"numFaces": 6,
  	"faces" : [0, 0, 1, 1, 1, 2],
  	"symbols" : [,,,,,"fa-sun-o"],
  	"color": "skyblue",
  	"visible": true,
  	"group": "Massive Darkness"
  }
  ___tmpl.dice.d6_MassiveDarknes_green = {
    "label" : "MD-Green",
  	"numFaces": 6,
  	"faces" : [0, 0, 1, 2, 2, 3],
  	"symbols" : [,,,"fa-sun-o",	"fa-sun-o",	"fa-diamond"],
  	"color": "lawngreen",
  	"visible": true,
  	"group": "Massive Darkness"
  }

  //*//
  ___tmpl.dice.d4_DnD = {
    "label" : "d4",
  	"numFaces": 4,
  	"faces" : Array.apply(null, {length: 4}).map(Number.call, Number),
  	"symbols" : new Array(4).fill(null),
  	"color": "lightblue",
  	"visible": true,
  	"group": "DnD"
  }

  ___tmpl.dice.d6_DnD = {
    "label" : "d6",
  	"numFaces": 6,
  	"faces" : Array.apply(null, {length: 6}).map(Number.call, Number),
  	"symbols" : new Array(4).fill(null),
  	"color": "darkorange",
  	"visible": true,
  	"group": "DnD"
  }

  ___tmpl.dice.d8_DnD = {
    "label" : "d8",
  	"numFaces": 8,
  	"faces" : Array.apply(null, {length: 8}).map(Number.call, Number),
  	"symbols" : new Array(4).fill(null),
  	"color": "orchid",
  	"visible": true,
  	"group": "DnD"
  }

  ___tmpl.dice.d10_DnD = {
    "label" : "d10",
  	"numFaces": 10,
  	"faces" : Array.apply(null, {length: 10}).map(Number.call, Number),
  	"symbols" : new Array(4).fill(null),
  	"color": "darkslategray",
  	"visible": true,
  	"group": "DnD"
  }

  ___tmpl.dice.d12_DnD = {
    "label" : "d12",
  	"numFaces": 12,
  	"faces" : Array.apply(null, {length: 12}).map(Number.call, Number),
  	"symbols" : new Array(4).fill(null),
  	"color": "crimson",
  	"visible": true,
  	"group": "DnD"
  }

  ___tmpl.dice.d20_DnD = {
    "label" : "d20",
  	"numFaces": 20,
  	"faces" : Array.apply(null, {length: 20}).map(Number.call, Number),
  	"symbols" : new Array(4).fill(null),
  	"color": "springgreen",
  	"visible": true,
  	"group": "DnD"
  }

  ___tmpl.dice.d100_DnD = {
    "label" : "d100",
  	"numFaces": 100,
  	"faces" : Array.apply(null, {length: 100}).map(Number.call, Number),
  	"symbols" : new Array(4).fill(null),
  	"color": "lightcyan",
  	"visible": true,
  	"group": "DnD"
  }
  //*//

  //// new in v0.3 ////
  ___tmpl.groups.DarkSouls = {};
  ___tmpl.groups.DarkSouls.label = "Dark Souls";
  ___tmpl.groups.DarkSouls.members = [
    "d6_DarkSouls_black",
    "d6_DarkSouls_blue",
    "d6_DarkSouls_orange"
  ];

  ___tmpl.groups.MassiveDarkness = {}
  ___tmpl.groups.MassiveDarkness.label = "Massive Darkness";
  ___tmpl.groups.MassiveDarkness.members = [
    "d6_MassiveDarknes_red",
    "d6_MassiveDarknes_yellow",
    "d6_MassiveDarknes_blue",
    "d6_MassiveDarknes_green"
  ];

  ___tmpl.groups.DnD = {}
  ___tmpl.groups.DnD.label = "DnD";
  ___tmpl.groups.DnD.members = [
    "d4_DnD",
    "d6_DnD",
    "d8_DnD",
    "d10_DnD",
    "d12_DnD",
    "d20_DnD",
    "d100_DnD"
  ];

  Object.freeze(___tmpl);

  return ___tmpl;
}();
