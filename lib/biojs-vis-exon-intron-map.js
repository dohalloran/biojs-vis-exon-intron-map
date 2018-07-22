var d3 = require("d3");
var fabric = require("./fabric/dist/fabric").fabric;

var ei = module.exports = {};

"use strict";

let exonIntronMap_data, isDown, longest, canvas, smallestEl, snpPoint;
let eachGeneName = [];
let eachGene = [];
let dnaArray = [];
let myTempArray = [];
let eachCoords = [];


window.onload = function() {
    canvas = new fabric.Canvas('primerCanvas', {
        hoverCursor: 'pointer',
        selection: false,
        backgroundColor: "#e6f9ff",
    });
    fabric.Object.prototype.transparentCorners = false;
}


let nn_s = {
    'AA': '240',
    'AC': '173',
    'AG': '208',
    'AT': '239',
    'AN': '215',
    'CA': '129',
    'CC': '266',
    'CG': '278',
    'CT': '208',
    'CN': '220',
    'GA': '135',
    'GC': '267',
    'GG': '266',
    'GT': '173',
    'GN': '210',
    'TA': '169',
    'TC': '135',
    'TG': '129',
    'TT': '240',
    'TN': '168',
    'NA': '168',
    'NC': '210',
    'NG': '220',
    'NT': '215',
    'NN': '203',
    'aa': '240',
    'ac': '173',
    'ag': '208',
    'at': '239',
    'an': '215',
    'ca': '129',
    'cc': '266',
    'cg': '278',
    'ct': '208',
    'cn': '220',
    'ga': '135',
    'gc': '267',
    'gg': '266',
    'gt': '173',
    'gn': '210',
    'ta': '169',
    'tc': '135',
    'tg': '129',
    'tt': '240',
    'tn': '168',
    'na': '168',
    'nc': '210',
    'ng': '220',
    'nt': '215',
    'nn': '203'
}
let nn_h = {
    'AA': '91',
    'AC': '65',
    'AG': '78',
    'AT': '86',
    'AN': '80',
    'CA': '58',
    'CC': '110',
    'CG': '119',
    'CT': '78',
    'CN': '91',
    'GA': '56',
    'GC': '111',
    'GG': '110',
    'GT': '65',
    'GN': '85',
    'TA': '60',
    'TC': '56',
    'TG': '58',
    'TT': '91',
    'TN': '66',
    'NA': '66',
    'NC': '85',
    'NG': '91',
    'NT': '80',
    'NN': '80',
    'aa': '91',
    'ac': '65',
    'ag': '78',
    'at': '86',
    'an': '80',
    'ca': '58',
    'cc': '110',
    'cg': '119',
    'ct': '78',
    'cn': '91',
    'ga': '56',
    'gc': '111',
    'gg': '110',
    'gt': '65',
    'gn': '85',
    'ta': '60',
    'tc': '56',
    'tg': '58',
    'tt': '91',
    'tn': '66',
    'na': '66',
    'nc': '85',
    'ng': '91',
    'nt': '80',
    'nn': '80'
}

ei.render = function() {

scale();

function scale() {

    let loaderBtn = document.getElementById("loader");
    loaderBtn.disabled = "disabled";
    //collect input, split to array based on case and get length
    exonIntronMap_data = document.getElementById("fileInput").value;
    /A|G|C|T|a|c|t|g/.test(exonIntronMap_data) || alert("no DNA sequence entered!"),
        exonIntronMap_data.startsWith(">") || alert("enter sequence in FASTA format");
    let geneNames = exonIntronMap_data.match(/>.+\s/g).toString();
    eachGeneName = geneNames.split(/>/g);
    eachGene = exonIntronMap_data.split(/>.+\s/g);
    let removeEmptyEl12 = eachGene.shift();
    longest = longestStringForLoop(eachGene);
    longest = longest.replace(/(\r\n\t|\n|\r\t)/gm, "");
    longest = longest.replace(/\s+/g, "").trim();
    let coords = document.getElementById("coordinates").value;
    eachCoords = coords.split(/,/g);
    eachCoords.forEach(function(el){
    	if (isNaN(el) || el < 1) {
        alert("Enter starting number for each gene in order");
    };
    });
    snpPoint = document.getElementById("snp").value.trim();
    	if (isNaN(snpPoint) || snpPoint < 1) {
        alert("Enter SNP position");
    };
    smallestEl = Array.min(eachCoords);

    let margin = {
            top: 35,
            right: 50,
            bottom: 0,
            left: 80
        },
        width = 1000,
        height = 20
        //add d3 svg
    let svg2 = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("id", "exon_intron")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    //build axis using d3.js
    let x = d3.scale.linear()
        .domain([smallestEl, (longest.length + smallestEl)])
        .range([0, width]);
    svg2.append("g")
        .attr("class", "x axis")
        .call(d3.svg.axis().scale(x).orient("top").ticks(16).tickSubdivide(3).tickSize(-4, -4, 0));

    init();


}

function init() {

    let removeEmptyEl1 = eachGeneName.shift();

    //loop through genes and gene names
    for (let g = 0; g < eachGene.length; g++) {

        //figure out which is the longest spliceform
        let currentCoord = eachCoords.shift();
        let coordDiff = currentCoord - smallestEl;
        let startIncrement = funcAdjustSvg(coordDiff, longest, 1000);
        let scaledFactor = 1000 - startIncrement;

        let currentName = eachGeneName.shift();

        eachGene[g] = eachGene[g].replace(/(\r\n\t|\n|\r\t)/gm, "");
        eachGene[g] = eachGene[g].replace(/\s+/g, "").trim();

        //set margin
        let margin = {
                top: 0,
                right: 50,
                bottom: 0,
                left: 80 + startIncrement
            },
            width = scaledFactor,
            height = 120;
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

        //draw deletion
        let startDel = 220;
        let endDel = 240;
        let sizeDel = endDel - startDel;
        let delPoints = funcAdjustSvg(startDel, eachGene[g], scaledFactor) + ' ' + 20 + ', ' + (funcAdjustSvg(startDel, eachGene[g], scaledFactor) + funcAdjustSvg(sizeDel, eachGene[g], scaledFactor)) + ' ' + 20;
        svg.append('polyline')
            .attr('points', delPoints)
            .style('stroke', 'red')
            .attr("stroke-width", 3);

        let delText = svg.append("text")
            .attr("y", 20)
            .attr("x", (funcAdjustSvg(endDel, eachGene[g], scaledFactor) + 1))
            .attr("class", "deletion label")
            .style("font-size", "11px")
            .style("fill", "red")
            .text("tm1406");
        ////// end of deletion
        //////////////////////
        //draw insertion
        let knockinPoint = 150;
        let startIns = knockinPoint - (eachGene[g].length / 20);
        let endIns = knockinPoint + (eachGene[g].length / 20);
        let sizeIns = endIns - startIns;

        let insPoints = funcAdjustSvg(knockinPoint, eachGene[g], scaledFactor) + ' ' + 45 + ', ' + funcAdjustSvg(startIns, eachGene[g], scaledFactor) + ' ' + 85 + ', ' + (funcAdjustSvg(startIns, eachGene[g], scaledFactor) + funcAdjustSvg(sizeIns, eachGene[g], scaledFactor)) + ' ' + 85 + ', ' + funcAdjustSvg(knockinPoint, eachGene[g], scaledFactor) + ' ' + 45;
        svg.append('polyline')
            .attr('points', insPoints)
            .style("stroke-dasharray", ("3,3"))
            .style('stroke', 'green')
            .attr("stroke-width", 2)
            .style("fill", "#fff");

        let insText = svg.append("text")
            .attr("y", 100)
            .attr("x", funcAdjustSvg(startIns, eachGene[g], scaledFactor))
            .attr("class", "insertion label")
            .style("font-size", "12px")
            .style("fill", "green")
            .text("GFP knockin");
        ////// end of insertion
        ///////////////////
        //draw SNP mutation
        let posSNP = snpPoint;

        let snpPoints = funcAdjustSvg(posSNP, eachGene[g], scaledFactor) + ' ' + 45 + ', ' + funcAdjustSvg(posSNP, eachGene[g], scaledFactor) + ' ' + 60;
        svg.append('polyline')
            .attr('points', snpPoints)
            .style('stroke', 'blue')
            .attr("stroke-width", 2);

        const Arrow = '\u2192';

        let snpText = svg.append("text")
            .attr("y", 60)
            .attr("x", (funcAdjustSvg(posSNP, eachGene[g], scaledFactor) + 1))
            .attr("class", "SNP label")
            .style("font-size", "11px")
            .style("fill", "blue")
            .text("ATG" + Arrow + "GTG");

        ////// end of mutation

        ///firstly we need to check if dna starts with 
        ///an intron or an exon
        //and loop differently based on the result
        //EXON LOOP//////////////////////////////////////////
        /////////////////////////////////////////////////////
        //loop over dnaArray containing introns and exons
        //split based on case
        dnaArray = eachGene[g].match(/(?:[A-Z]+|[^A-Z]+)/g);

        for (let i = 0; i < dnaArray.length; i++) {
            dnaArray[i] = dnaArray[i].replace(/(\r\n\t|\n|\r\t)/gm, "");
            dnaArray[i] = dnaArray[i].replace(/\s+/g, "").trim();

            let totalEx = 0;

            myTempArray = dnaArray.slice(0, i);
            for (let k = 0; k < myTempArray.length; k++) {
                totalEx += myTempArray[k].length;
            }


            if (hasLowerCase(dnaArray[i]) == false) {
                let sizeExon = eachGene[g].length / dnaArray[i].length;
                let sizeTotal;
                let totalDraw;
                if (totalEx != 0) {
                    sizeTotal = eachGene[g].length / totalEx;
                } else {
                    sizeTotal = 0;
                }
                let sizeDraw = scaledFactor / sizeExon;


                if (sizeTotal != 0) {
                    totalDraw = scaledFactor / sizeTotal;
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
                //INTRON LOOP//////////////////////////////////////////
                //scale the introns
                let sizeIntron = eachGene[g].length / dnaArray[i].length;
                let sizeIntTotal = eachGene[g].length / totalEx;
                let sizeDrawInt = scaledFactor / sizeIntron;
                let sizeIntDraw = scaledFactor / sizeIntTotal;
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
                /////////////////////////////////
            }
        }
    }
    drawMyPrimers();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//DRAW DNA SEQUENCES
/////DRAW PRIMERS
function drawMyPrimers() {
    canvas.add(new fabric.Text('Primer canvas', {
        fontStyle: 'italic',
        fontFamily: 'Hoefler Text',
        fontSize: 12,
        left: 5,
        top: 0,
        hasControls: false,
        selectable: false
    }));
    // canvas.getObjects('text')[0].text = "Primer canvas";
    let getPosit = [];
    let line;

    canvas.on('mouse:down', function(o) {
        isDown = true;
        let pointer = canvas.getPointer(o.e);
        let posX1 = pointer.x;
        getPosit.push(posX1);
        let points = [pointer.x, pointer.y, pointer.x, pointer.y];
        line = new fabric.Line(points, {
            strokeWidth: 2,
            fill: 'green',
            stroke: 'green',
            originX: 'center',
            originY: 'center'
        });
        canvas.add(line);
    });

    canvas.on('mouse:move', function(o) {
        if (!isDown) return;
        let pointer = canvas.getPointer(o.e);
        line.set({
            x2: pointer.x,
            y2: pointer.y
        });
        canvas.renderAll();
    });

    canvas.on('mouse:up', function(o) {
        let pointer = canvas.getPointer(o.e);
        let posX2 = pointer.x;
        getPosit.push(posX2);
        isDown = false;
        let startPrimer = getPosit[0];
        let endPrimer = getPosit[1];
        let startScaled = funcAdjust(startPrimer, longest);
        let endScaled = funcAdjust(endPrimer, longest);
        console.log("start bp: " + startScaled + " end bp: " + endScaled);
        let dnaUpper = longest.toUpperCase();
        let primer = dnaUpper.substring(startScaled, endScaled);
        //calc primer tm and GC% and alert to user
        //two primer tm formulae - 1 for > 36bps and 1 for <= 36bps
        //see functions below for more details and comments
        if (primer.length > 36) {
            if (Math.abs(endScaled) >= Math.abs(startScaled)) {
                alert("Forward Primer: " + primer + "\n" + "GC percent: " + gcPercent(primer) + "%" + "\n" + "Primer Tm: " + calcTmLong(primer) + "\u2103");
            } else {
                alert("Reverse Primer: " + reverse(primer) + "\n" + "GC percent: " + gcPercent(reverse(primer)) + "%" + "\n" + "Primer Tm: " + calcTmLong(reverse(primer)) + "\u2103");
            }
        } else if (primer.length > 10) {
            if (Math.abs(endScaled) >= Math.abs(startScaled)) {
                alert("Forward Primer: " + primer + "\n" + "GC percent: " + gcPercent(primer) + "%" + "\n" + "Primer Tm: " + calcTm(primer) + "\u2103");
            } else {
                alert("Reverse Primer: " + reverse(primer) + "\n" + "GC percent: " + gcPercent(reverse(primer)) + "%" + "\n" + "Primer Tm: " + calcTm(reverse(primer)) + "\u2103");
            }
        } else {
            alert("Primer must be at least 10bps");
        }
        //empty position array so user can get more primers
        getPosit = [];
    });
}

/////////////////END OF DRAW DNA SEQUENCES//////
//this fnctions checks if the first string in dnaArray
//is and intron or exon
function hasLowerCase(str) {
    if (str.toUpperCase() != str) {
        return true;
    }
    return false;
}
///////////////////////////////////////////////
//The next few functions handle primer tm calcs
////////////////////////////////////////////////
//Calculate Tm of Primer if >36bps
function calcTmLong(dna) {
    let numberTmLong = 81.5 + (16.6 * (Math.log(50 / 1000.0) / Math.log(10))) +
        (41.0 * (gcPercent(dna) / 100)) - (600.0 / dna.length);
    return numberTmLong.toFixed(2);
}
//Calculate Tm of Primer if <=36bps
function calcTm(sequence) {
    let dH = 0;
    let dS = 108;
    let i;
    // Compute dH and dS
    for (i = 0; i < (sequence.length - 1); i++) {
        let pair = sequence.substr(i, 2);
        dH += parseInt(nn_h[pair], 10);
        dS += parseInt(nn_s[pair], 10);
    }
    dH *= -100.0;
    dS *= -0.1;
    let numberTm = dH / (dS + 1.987 * Math.log(100 / 4000000000.0)) - 273.15 +
        16.6 * (Math.log(50 / 1000.0) / Math.log(10));
    return numberTm.toFixed(2);
}
//Calculate GC Percentage of Primer
function gcPercent(dna) {
    let Arr_Primer = dna.split("");
    let gCount = 0;
    let tCount = 0;
    let cCount = 0;
    let aCount = 0;
    for (let i = 0; i < Arr_Primer.length; i++) {
        if (Arr_Primer[i] === 'A') {
            aCount++;
        } else if (Arr_Primer[i] === 'C') {
            cCount++;
        } else if (Arr_Primer[i] === 'T') {
            tCount++;
        } else if (Arr_Primer[i] === 'G') {
            gCount++;
        }
    }
    let number = ((gCount + cCount) / Arr_Primer.length) * 100;
    return number.toFixed(2);
}
//Reverse Complement Primer
function reverse(s) {
    return s.split("").map(complement).reverse().join("");
}
//gets other strand of dna
function complement(nucleotide) {
    let complements = {
        'A': 'T',
        'C': 'G',
        'G': 'C',
        'T': 'A'
    };
    return complements[nucleotide];
}
////////////////////////////////////////////
/////////function to scale from mouse coordinates to DNA sequence
function funcAdjust(start_bp, glen) {
    let divGene = 1000 / start_bp;
    let adjusted = glen.length / divGene;
    return Math.round(adjusted);
}
////////////////////////////////////////////////////////////////////////////////////
/////////function to scale from DNA sequence position to svg 
function funcAdjustSvg(bp, glen, scale) {
    let geneScale = glen.length / bp;
    let divScale = scale / geneScale;
    return Math.round(divScale);
}
////////////////////////////////////////////////////////////////////////////////////

Array.min = function(array) {
    return Math.min.apply(Math, array);
};

/////////////////////////////////////////

function longestStringForLoop(arr) {
    let word = "";
    for (let i = 0; i < arr.length; i++) {
        if (word.length < arr[i].length) {
            word = arr[i];
        }
    }
    return word;
}

//this fnctions checks if the first string in dnaArray
//is an intron or exon
function hasLowerCase(str) {
    if (str.toUpperCase() != str) {
        return true;
    }
    return false;
}

}