/* 
// WRITE YOUR JAVASCRIPT BELOW THIS COMMENT 
Your name :  Vissers Vincent   
Date :  18/11/2019
Contact information : 
What does this script do ? 
...
*/

// Your scripting goes here...

// integration sous H1
let pTag = document.createElement("p");   
pTag.setAttribute("class","graphic");
let h1Tag = document.getElementById("firstHeading");   
h1Tag.appendChild(pTag);  

/////////////////////////////////////
/////           Tableau 1       ////
///////////////////////////////////

//recuperation json
async function returnGraphicOne(){ 
        try{
            let response = await fetch("https://inside.becode.org/api/v1/data/random.json"); 
            let data = await response.json();
            // Suppression du graphique pour qu'il puisse être regénéré
                let containerclear = d3.select("p.graphic").select("svg").remove(); 
                        //Mise en forme du graphique
                     let margin = {top: 20, right: 30, bottom: 40, left: 30}, 
                         width = 600 - margin.left - margin.right,
                         height = 500 - margin.top - margin.bottom;
                     let x = d3.scaleLinear()
                         .range([0, width]);
                     let y = d3.scaleBand()
                         .rangeRound([0, height])
                         .padding(0.1);
                     let xAxis = d3.axisBottom(x);
                     let yAxis = d3.axisLeft(y)
                         .tickSize(0)
                         .tickPadding(6);
                         //  creation du svg dans la balise p
                     let svg = d3.select("p.graphic").append("svg") 
                         .attr("width", width + margin.left + margin.right)
                         .attr("height", height + margin.top + margin.bottom)
                     .append("g")
                         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                // valeur retour de l'axe x et y du json
                     x.domain(d3.extent(data, function(d) { return d[1]; })).nice(); 
                     y.domain(data.map(function(d) { return d[0]; }));    
                     // creation des  barres lier aux donnee json             
                     svg.selectAll(".bar") 
                         .data(data)
                         .enter().append("rect") 
                         .attr("class", function(d) { return "bar bar--" + (d[1] < 0 ? "negative" : "positive"); })
                         .attr("x", function(d) { return x(Math.min(0, d[1])); })
                         .attr("y", function(d) { return y(d[0]); })
                         .attr("width", function(d) { return Math.abs(x(d[1]) - x(0)); })
                         .attr("height", y.bandwidth())
                         .attr("fill", "#2873e6");
                         
                     svg.append("g")
                         .attr("class", "x axis")
                         .attr("transform", "translate(0," + height + ")")
                         .call(xAxis);
                     svg.append("g")
                         .attr("class", "y axis")
                         .attr("transform", "translate(" + x(0) + ",0)")

                         .call(yAxis);

                     function type(d) {
                     d[1] = +d[1];
                     return d;
                     }

         } catch(e){
             console.log(e);
         }
     }
     // mise a jour du graphique et des données chaques secondes
     setInterval(function() {
        returnGraphicOne();
}, 1000);

///////////////////////////////////
//      Tableau 2               //
/////////////////////////////////
function returnGraphicTwo(){
    const getDataFromHTMLTable = (CSSSelectorOfTheRows) => {
        let data = [];
        let tableRows = d3.selectAll(CSSSelectorOfTheRows); // Collect d'information sur chaque ligne
        tableRows = [...tableRows.nodes()];
        let tableHeaders = [];
        let cellsOfHeaders = [...tableRows[0].cells];
        for(let h=0; h<cellsOfHeaders.length;h++){      // Récuperation de l'entete pour les dates
            if(h>1){
                tableHeaders.push(cellsOfHeaders[h].innerHTML); // injection dans le tableau
            }
        }
    
        for (let i = 1; i < tableRows.length; i++) {
            let cellsOfRow = [...tableRows[i].cells];  // cellules
            let countryData = [];
            
            for (let j = 1; j < cellsOfRow.length; j++) { // Iteration sur chaque cellule
                if(j > 1){                              // Itération suite
                    if(cellsOfRow[j].innerText == ":"){ // Replacement des emplacements sans données par 0
                        countryData.push(0)
                    }else{
                        countryData.push(parseFloat((cellsOfRow[j].innerText).replace(",",".")));
                    }
                    
                }
            }
            data[i-1] = {}; 
            data[i-1].dates = tableHeaders;
            data[i-1].country = cellsOfRow[1].innerHTML;
            data[i-1].data = countryData;
        }
        return data;
    }
    
    let dataTableOne = getDataFromHTMLTable("#table1 > tbody > tr")
    console.log(dataTableOne);
   
    // Définition de la structure du svg
    
    let margin = {top: 20, right: 20, bottom: 50, left: 50};
    let width = 800 - margin.left - margin.right;
    let height = 600 - margin.top - margin.bottom;

    // Creation du Graphique a proprement parlé
    function createGraphCrime(showCountry) {

    // Creation du svg   
    let svgCrime = d3.select('#mw-content-text').insert('svg','#table1')
                                    .attr('width', 900)
                                    .attr('height', 600)
                                    .style('background', '#fff')
                                    .attr('id','svgCrime')
    // Creation du graphique
    const graphic = svgCrime.append('g')
                        .attr('width', width)
                        .attr('height', height)
                        .attr('transform', "translate(" + margin.left + ", " + margin.top + ")");
    
    const xCrime = graphic.append('g')
                        .attr('transform', `translate(0, ${height})`);
    const yCrime = graphic.append('g');
    
    const x = d3.scaleBand()
                .domain(dataTableOne[showCountry].dates)
                .range([0, width])
                .paddingInner(0.2)
                .paddingOuter(0.1)
    
    const y = d3.scaleLinear()
                .domain([0, (Math.max(...dataTableOne[showCountry].data)*1.2)])
                .range([height, 0]);
    
    // Définition de l'axe x
    const axeX = d3.axisBottom(x)
    
    xCrime.call(axeX)
            .style('font-size', '14px')
            
    xCrime.selectAll('text')
            .attr('transform', 'rotate(-60) translate(0,5)')
            .attr('text-anchor', 'end');

    // Définition de l'axe Y
    
    const axeY = d3.axisLeft(y)
                    .ticks(20);
    
    yCrime.call(axeY)
            .style('font-size', '13px');
            
        // Définition de la fonction Hover du graphique
      function mouseOver(d, i) {
        d3.select(this)
          .style("opacity", 0.8)
          .attr('fill', 'orange')
          
        graphic.append('text')
                .attr('id', `data${d}${i}`)
                .style('font-weight', 'bold')
                .style('font-size', '1.7rem')
                .attr('fill', 'steelblue')
                .attr('x', function(){return x(d)+7})
                .attr('y', this.y.animVal.value-15)
                .text(dataTableOne[showCountry].data[i])
                
      }
      // définition de la fonction Hover leave du graphique
      function mouseLeave(d, i) {
        d3.select(this)
          .style("opacity", 1)
          .attr('fill', 'steelblue');
    
        d3.select(`#data${d}${i}`).remove();
      } 

      // Ajout des différents éléments dans le graphique
    const rects = graphic.selectAll("rect")
                        .data(dataTableOne[showCountry].data)
                        .enter()
                        .append('rect')
                        .on("mouseover", mouseOver)
                        .on("mouseleave", mouseLeave)
                        .attr('width', x.bandwidth())
                        .attr('height', function(d){return height - y(d)})
                        .attr('fill', 'steelblue')
                        .attr('y', function(d){return y(d)})
                        .data(dataTableOne[showCountry].dates)
                        .attr('x', function(d){return x(d)});
}    
createGraphCrime(0);    
    
    // Creation du DropDown
    
    let dropdown = d3.select('#mw-content-text').insert("select","#svgCrime")
                                                .attr('name','countries')
                                                .attr('id','selectCountry')
                                                .on('change', switchCountry)
                                            
                                        dropdown.selectAll("option")
                                                .data(dataTableOne)
                                                .enter()
                                                .append("option")
                                                .attr("value", function(d,i){return i})
                                                .text(function(d){return d.country})                                                             

     function switchCountry(){
     d3.select("#svgCrime").remove();
     createGraphCrime(this.value);
     }
}
returnGraphicTwo();
//////////////////////////////
////    tableau 3        ////
////////////////////////////
function returnGraphicTree (){
        // Récup donnée tableau
            const getDataFromHTMLTable = (CSSSelectorOfTheRows) => {
                let data = [];
                let tableRows = d3.selectAll(CSSSelectorOfTheRows); // Collect d'information sur chaque ligne
                tableRows = [...tableRows.nodes()];
                let tableHeaders = [];
                let cellsOfHeaders = [...tableRows[0].cells];
                for(let h=0; h<cellsOfHeaders.length;h++){      // Récuperation de l'entete pour les dates
                    if(h>1){
                        tableHeaders.push(cellsOfHeaders[h].innerHTML); // injection dans le tableau
                    }
                }
            
                for (let i = 1; i < tableRows.length; i++) {
                    let cellsOfRow = [...tableRows[i].cells];  // cellules
                    let countryData = [];
                    
                    for (let j = 1; j < cellsOfRow.length; j++) { // Iteration sur chaque cellule
                        if(j > 1){                              // Itération suite
                            if(cellsOfRow[j].innerText == ":"){ // Replacement des emplacements sans données par 0
                                countryData.push(0)
                            }else{
                                countryData.push(parseFloat((cellsOfRow[j].innerText).replace(",",".")));
                            }
                            
                        }
                    }
                    data[i-1] = {}; 
                    data[i-1].dates = tableHeaders;
                    data[i-1].country = cellsOfRow[1].innerHTML;
                    data[i-1].data = countryData;
                }
                return data;
            }