# biojs-vis-exon-intron-map

**Create an exon intron map for alternative spliceforms with decorations**


[![NPM version](http://img.shields.io/npm/v/biojs-vis-exon-intron-map.svg)](https://www.npmjs.org/package/biojs-vis-exon-intron-map) 

![exon_intron LOGO](https://user-images.githubusercontent.com/8477977/43047557-e06f3cb4-8da6-11e8-8de4-c86a5de43c91.png)


## Getting Started in the browser 
```HTML
<script src="js/d3.js"></script>
<script src="js/biojs-vis-exon-intron-map.js"></script>
<link rel="stylesheet" href="css/biojs-vis-exon-intron-map.css">
```

- exons are in `UPPERCASE` and introns in `lowercase`  
- sequences supplied in `fastA format` with line break `\n` after identifier

```javascript
let myMap = new exonIntronMap(">C10G8.5a\nATGACTCGATTAGGGTGTTGGCTAGCAGTAGCCTTTCTGGTGGCCCTCGCTGGACTCGCAGATGCTGGATCCAACTGTTCAGCAGCCGACGCCACTAGAAACTGCATCGATGGACTTGTTATACCTATTTGgtgaggatttaaactaaaacaaagcttgaat>C10G8.5b\nATGACTCGATTAGGGTGTTGGCTAGCAGTAGCCTTTCTGGTGGCCCTCGCTGGACTCGCAGATGCTGGATCCAACTGTTCAGCAGCCGACGCCACTAGAAACTGCATCGATGGACTTGTTATACCTATTTGgtgaggatttaaactaaaacaaagcttgaatcaaaatttga>C10G8.5c\nATGAAGGAGGGAGAGATCGTTTTTGAAGACAACCAGACTGAgtacatcacctaccaatatcgtttttcttcaactttttttccagAGCTCTTGTTGAAATTGGAATTGTCGATACTGAACAATACGAACGCTCCGACTACTTCTACATCGAGCTTTCCCCACCAATCTGGGCCAAGAAGATGAATGgtgagtatttttggaactatttttttaagtgaaacaacaaaaacgcttctacatatacatatgtgcacattgttaatttcactacaacaacacaacaacaaaaacaatcaattaat");
		
```

- add coordinates to position the spliceforms relative to one another and correctly number the scale   
- __Must__ be supplied in the same order as the sequences

```javascript
myMap.coords = "5303692,5303692,5307700";
```

label the scale:
```javascript
myMap.chromosomeName = "Chromosome II";
```

add decorations:  
1. SNP
```javascript
myMap.snpPoint = 3800;
const Arrow = '\u2192';
myMap.snpText = "ATG" + Arrow + "GTG";
```
2. Deletion
```javascript
myMap.deletion = "1200,1650";
myMap.delName = "ems deletion";
```
3. Insertion
```javascript
myMap.knockinPoint = 5650;
myMap.knockinText =  "GFP CRISPR insert";
myMap.knockinColor = "green";
```
  
render the SVG image
```javascript
myMap.render();
```

## Getting started with Node.js 
- `git clone git clone https://github.com/dohalloran/biojs-vis-exon-intron-map.git`
- `cd` into repo
- `npm install` 
- alternatively `npm install biojs-vis-exon-intron-map` 

## Output 
- Exon intron graphic with lesion decorations in high resolution Scalable Vector Graphics (SVG) format

## Example directory  
- sample files are rendered from the `examples` dir at the [BioJS registry](http://biojs.io/d/biojs-vis-exon-intron-map) 
- __note__: will take a minute to render the sample files at BioJS

## Contributing

All contributions are welcome.

## Support

If you have any problem or suggestion please open an issue [here](https://github.com/dohalloran/biojs-vis-exon-intron-map/issues).

## License 

The MIT License

Copyright (c) 2016, dohalloran

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
