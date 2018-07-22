 /**
 * **exonIntronMap Class**
 *
 * sets defaults, parses user sequences 
 * renders exon intron map
 * 
 * Damien O'Halloran 2018
 */
"use strict";


//globals
let dnaArray = [];
let myTempArray = [];


class exonIntronMap {

        /** **constructor**
         * call this with `new exonIntronMap()`_
         * @param {String} sequence(s) in fastA format
         * @return {Object} exonIntronMap object
         * @api public
         */

        constructor(seq) {
                this.exonIntronMap_data = seq;
                //collect input, split to array based on case and get length
                //return alert if no DNA entered or if the input is not in fastA format
                /A|G|C|T|a|c|t|g/.test(this.exonIntronMap_data) || alert("no DNA sequence entered!"),
                        this.exonIntronMap_data.startsWith(">") || alert("enter sequence in FASTA format");
                //get gene name 
                this.geneNames = this.exonIntronMap_data.match(/>.+\s/g).toString();
                //split gene names into array
                this.eachGeneName = this.geneNames.split(/>/g);
                //split based on fastA header to get sequence
                this.eachGene = this.exonIntronMap_data.split(/>.+\s/g);
                //remove empty array entry
                let removeEmptyGeneName = this.eachGene.shift();
                let longest = longestStringForLoop(this.eachGene);
                longest = longest.replace(/(\r\n\t|\n|\r\t)/gm, "");
                this.longest = longest.replace(/\s+/g, "").trim();

        }
        // Method within exonIntronMap Class that get called by user
        // to parse decoration inputs i.e. deletion, snp, insertion
        render() {
                if (!this.coords) {
                        alert("enter starting position of each gene in order")
                }
                this.eachCoords = this.coords.split(/,/g);
                this.eachCoords.forEach(function(el) {
                        if (isNaN(el) || el < 1) {
                                alert("Enter starting number for each gene in order");
                        };
                });

                if (this.deletion) {
                        this.delPoint = this.deletion.split(/,/g);
                        this.delPoint.forEach(function(item) {
                                if (isNaN(item)) {
                                        alert("Enter starting and ending point for deletion");
                                };
                        });
                }

                if (this.snpPoint) {
                        if (isNaN(this.snpPoint)) {
                                alert("Enter SNP position");
                        }
                }

                if (this.knockinPoint) {
                        if (isNaN(this.knockinPoint)) {
                                alert("Enter knock-in position");
                        }
                }

                if (!this.knockinText) {
                	this.knockinText = "knockin";
                }


                if (!this.knockinColor) {
                	this.knockinColor = "green";
                }

                this.smallestEl = Array.min(this.eachCoords);

                this.scale();

        }
        // method to design scale bar 
        // with user supplies coordinates
        scale() {

                let margin = {
                                top: 150,
                                right: 50,
                                bottom: 0,
                                left: 80
                        },
                        width = 1000,
                        height = 20
                //add d3 svg
                this.svg2 = d3.select("body").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .attr("id", "exon_intron")
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


                //build axis using d3.js
                this.myScale = d3.scale.linear()
                        .domain([this.smallestEl, (this.longest.length + this.smallestEl)])
                        .range([0, width]);
                this.svg2.append("g")
                        .attr("class", "x axis")
                        .call(d3.svg.axis().scale(this.myScale).orient("top").ticks(8).tickSubdivide(3).tickPadding(6).tickSize(-6, -6, 4));

                let scaleText = this.svg2.append("text")
                        .attr("y", -30)
                        .attr("x", -10)
                        .attr("class", "scale label")
                        .style("font-size", "13px")
                        .style("fill", "black")
                        .text(this.chromosomeName);

                this.init();

        }
        // method to begin decorating with lesions
        // i.e. deltions, knockin, snp
        init() {

                //set margin
                let margin = {
                                top: 5,
                                right: 50,
                                bottom: 0,
                                left: 80
                        },
                        width = funcAdjustSvg(this.longest.length, this.longest, 1000),
                        height = 30;
                //add d3 svg
                let svg3 = d3.select("body").append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .attr("id", "deco")
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                //draw deletion
                if (this.deletion) {
                        let startDel = this.delPoint[0];
                        let endDel = this.delPoint[1];
                        let sizeDel = endDel - startDel;
                        let delPoints = funcAdjustSvg(startDel, this.longest, funcAdjustSvg(this.longest.length, this.longest, 1000)) + ' ' + 25 + ', ' + (funcAdjustSvg(startDel, this.longest, funcAdjustSvg(this.longest.length, this.longest, 1000)) + funcAdjustSvg(sizeDel, this.longest, funcAdjustSvg(this.longest.length, this.longest, 1000))) + ' ' + 25;
                        svg3.append('polyline')
                                .attr('points', delPoints)
                                .style('stroke', 'red')
                                .attr("stroke-width", 3);

                        let delText = svg3.append("text")
                                .attr("y", 20)
                                .attr("x", (funcAdjustSvg(startDel, this.longest, funcAdjustSvg(this.longest.length, this.longest, 1000))))
                                .attr("class", "deletion label")
                                .style("font-size", "11px")
                                .style("fill", "red")
                                .text(this.delName);
                }
                ////// end of deletion
                ///////////////////////////////////////////
                //draw insertion
                if (this.knockinPoint) {
                        let knockinPoint = this.knockinPoint;
                        let startIns = knockinPoint - (this.longest.length / 20);
                        let endIns = knockinPoint + (this.longest.length / 20);
                        let sizeIns = endIns - startIns;

                        let insPoints = funcAdjustSvg(knockinPoint, this.longest, funcAdjustSvg(this.longest.length, this.longest, 1000)) + ' ' + 30 + ', ' + funcAdjustSvg(startIns, this.longest, funcAdjustSvg(this.longest.length, this.longest, 1000)) + ' ' + 10 + ', ' + (funcAdjustSvg(startIns, this.longest, funcAdjustSvg(this.longest.length, this.longest, 1000)) + funcAdjustSvg(sizeIns, this.longest, funcAdjustSvg(this.longest.length, this.longest, 1000))) + ' ' + 10 + ', ' + funcAdjustSvg(knockinPoint, this.longest, funcAdjustSvg(this.longest.length, this.longest, 1000)) + ' ' + 30;
                        svg3.append('polyline')
                                .attr('points', insPoints)
                                .style("stroke-dasharray", ("3,3"))
                                .style('stroke', this.knockinColor)
                                .attr("stroke-width", 2)
                                .style("fill", "#fff");

                        let insText = svg3.append("text")
                                .attr("y", 7)
                                .attr("x", funcAdjustSvg(startIns, this.longest, funcAdjustSvg(this.longest.length, this.longest, 1000)))
                                .attr("class", "insertion label")
                                .style("font-size", "12px")
                                .style("fill", this.knockinColor)
                                .text(this.knockinText);
                }
                ////// end of insertion
                ///////////////////////////////////////////
                //draw SNP mutation
                if (this.snpPoint) {
                        let posSNP = this.snpPoint;

                        let snpPoints = funcAdjustSvg(posSNP, this.longest, funcAdjustSvg(this.longest.length, this.longest, 1000)) + ' ' + 10 + ', ' + funcAdjustSvg(posSNP, this.longest, funcAdjustSvg(this.longest.length, this.longest, 1000)) + ' ' + 30;
                        svg3.append('polyline')
                                .attr('points', snpPoints)
                                .style('stroke', 'blue')
                                .attr("stroke-width", 2);

                        //const Arrow = '\u2192';

                        let snpText = svg3.append("text")
                                .attr("y", 25)
                                .attr("x", (funcAdjustSvg(posSNP, this.longest, funcAdjustSvg(this.longest.length, this.longest, 1000)) + 1))
                                .attr("class", "SNP label")
                                .style("font-size", "11px")
                                .style("fill", "blue")
                                .text(this.snpText);
                }
                ////// end of mutation
                ///////////////////////////////////////////
                let removeEmptyEl1 = this.eachGeneName.shift();

                //loop through genes and gene names
                for (let g = 0; g < this.eachGene.length; g++) {

                        //figure out which is the longest spliceform
                        let currentCoord = this.eachCoords.shift();
                        let coordDiff = currentCoord - this.smallestEl;
                        let startIncrement = funcAdjustSvg(coordDiff, this.longest, 1000);
                        let scaledFactor = 1000 - startIncrement;


                        let currentName = this.eachGeneName.shift();

                        let endIncrement = funcAdjustSvg(this.eachGene[g].length, this.longest, 1000);

                        this.eachGene[g] = this.eachGene[g].replace(/(\r\n\t|\n|\r\t)/gm, "");
                        this.eachGene[g] = this.eachGene[g].replace(/\s+/g, "").trim();

                        //set margin
                        let margin = {
                                        top: 0,
                                        right: 50,
                                        bottom: 0,
                                        left: 80 + startIncrement
                                },
                                width = endIncrement,
                                height = 80;
                        let count = "svg" + g;
                        //add d3 svg
                        let svg = d3.select("body").append("svg")
                                .attr("width", width + margin.left + margin.right)
                                .attr("height", height + margin.top + margin.bottom)
                                .attr("id", count)
                                .append("g")
                                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                        //insert gene name
                        let geneName = svg.append("text")
                                .attr("y", 8)
                                .attr("x", 0)
                                .attr("class", "gene name label")
                                .style("font-size", "11px")
                                .style("fill", "#451256")
                                .text(currentName.replace(/[, ]+/g, " ").trim());

                        ///firstly we need to check if dna starts with 
                        ///an intron or an exon
                        //and loop differently based on the result
                        //EXON LOOP//////////////////////////////////////////
                        /////////////////////////////////////////////////////
                        //loop over dnaArray containing introns and exons
                        //split based on case
                        dnaArray = this.eachGene[g].match(/(?:[A-Z]+|[^A-Z]+)/g);

                        for (let i = 0; i < dnaArray.length; i++) {
                                dnaArray[i] = dnaArray[i].replace(/(\r\n\t|\n|\r\t)/gm, "");
                                dnaArray[i] = dnaArray[i].replace(/\s+/g, "").trim();

                                let totalEx = 0;

                                myTempArray = dnaArray.slice(0, i);
                                for (let k = 0; k < myTempArray.length; k++) {
                                        totalEx += myTempArray[k].length;
                                }


                                if (hasLowerCase(dnaArray[i]) == false) {
                                        let sizeExon = this.eachGene[g].length / dnaArray[i].length;
                                        let sizeTotal;
                                        let totalDraw;
                                        if (totalEx != 0) {
                                                sizeTotal = this.eachGene[g].length / totalEx;
                                        } else {
                                                sizeTotal = 0;
                                        }
                                        let sizeDraw = endIncrement / sizeExon;


                                        if (sizeTotal != 0) {
                                                totalDraw = endIncrement / sizeTotal;
                                        } else {
                                                totalDraw = 0;
                                        }

                                        if (dnaArray.length - 1 == myTempArray.length) {

                                                let endTri = totalDraw + sizeDraw;
                                                let recTri = (endTri - totalDraw) / 3;
                                                let recEnd = sizeDraw - recTri;

                                                let trianglePoints = totalDraw + ' ' + 25 + ', ' + totalDraw + ' ' + 45 + ', ' + (totalDraw + recEnd) + ' ' + 45 + ', ' + endTri + ' ' + 35 + ', ' + (totalDraw + recEnd) + ' ' + 25;
                                                svg.append('polyline')
                                                        .attr('points', trianglePoints)
                                                        .attr("class", "final exon")
                                                        .style("fill", "#000");

                                        } else {
                                                //draw a rectangle exon
                                                let rectangle = svg.append("rect")
                                                        .attr("x", totalDraw)
                                                        .attr("y", 25)
                                                        .attr("class", "exon")
                                                        .attr("width", sizeDraw)
                                                        .attr("height", 20)
                                                        .style("fill", "#000");
                                        }

                                } else {
                                        //INTRON LOOP
                                        //scale the introns
                                        let sizeIntron = this.eachGene[g].length / dnaArray[i].length;
                                        let sizeIntTotal = this.eachGene[g].length / totalEx;
                                        let sizeDrawInt = endIncrement / sizeIntron;
                                        let sizeIntDraw = endIncrement / sizeIntTotal;
                                        //draw the introns
                                        let halfInt = sizeDrawInt / 2;

                                        if ((dnaArray.length - 1 == myTempArray.length) || (myTempArray.length === 0)) {

                                                let trianglePoints = (sizeIntDraw - 1) + ' ' + 35 + ', ' + (sizeIntDraw + halfInt) + ' ' + 35 + ', ' + ((sizeIntDraw + sizeDrawInt) + 1) + ' ' + 35;
                                                svg.append('polyline')
                                                        .attr('points', trianglePoints)
                                                        .style("fill", "#fff")
                                                        .style('stroke', 'black')
                                                        .attr("stroke-width", 2);

                                        } else {

                                                let trianglePoints = (sizeIntDraw - 1) + ' ' + 35 + ', ' + (sizeIntDraw + halfInt) + ' ' + 30 + ', ' + ((sizeIntDraw + sizeDrawInt) + 1) + ' ' + 35;
                                                svg.append('polyline')
                                                        .attr('points', trianglePoints)
                                                        .style("fill", "#fff")
                                                        .style('stroke', '#000')
                                                        .attr("stroke-width", 2);
                                        }
                                }
                        }
                }
        }
}
///////////////////////////////////////////
///////////////////////////////////////////
////////END OF DRAW DNA SEQUENCES//////////
///////////////////////////////////////////
///////////////////////////////////////////
 /**
 * **Functions**
 *
 * convert from base pair to svg pixels 
 * identify smallest element in @array
 * Identify longest string in @array
 * Check case in string to determine exon/intron
 * 
 *
 */
///////////////////////////////////////////
///////////////////////////////////////////
//function to scale from DNA sequence position to svg 
function funcAdjustSvg(bp, glen, scale) {
		let geneScale = glen.length / bp;
        let divScale = scale / geneScale;
        return Math.round(divScale);
}
///////////////////////////////////////////

Array.min = function(array) {
        return Math.min.apply(Math, array);
};
///////////////////////////////////////////

function longestStringForLoop(arr) {
        let word = "";
        for (let i = 0; i < arr.length; i++) {
                if (word.length < arr[i].length) {
                        word = arr[i];
                }
        }
        return word;
}
///////////////////////////////////////////
//this fnctions checks if the first string in 
//@dnaArray is an intron or exon
function hasLowerCase(str) {
        if (str.toUpperCase() != str) {
                return true;
        }
        return false;
}
///////////////////////////////////////////

////////////////////////////////////////////
////									
////									
////		     THE END				
////									
////									
////////////////////////////////////////////
