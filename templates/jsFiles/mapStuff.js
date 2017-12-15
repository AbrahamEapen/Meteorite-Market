var svg = d3.select("svg"),

width = 1200 
height = 1000 

var projection = d3.geoMercator()

var path = d3.geoPath()
.projection(projection);

var graticule = d3.geoGraticule();

//////////////////////////
//JSON for drawing the map
//////////////////////////
d3.json("https://unpkg.com/world-atlas@1/world/50m.json", function(error, world) {
if (error) throw error;

projection
    .scale((width - 3) / (5 * Math.PI))
    .translate([width / 4, height / 3])

svg.insert("path", ".graticule")
    .datum(topojson.feature(world, world.objects.land))
    .attr("class", "land")
    .attr("d", path)



/////////////////////////
//Load in meteorite json
/////////////////////////
var queryUrl = "https://raw.githubusercontent.com/AbrahamEapen/Meteorite-Market/master/templates/meteorites.json"

var rectangleData = [

    {
        "rx": 200,
        "ry": 310,
        "height": 30,
        "width": 90,
        "color": "red"
    }
];

var rectangles = svg.selectAll("rect")
    .data(rectangleData)
    .enter()
    .append("rect")
    .style("opacity", 100)
    .on("click", function(d) {
        start()
    })
    .transition()
    .duration(1000)
    .style("opacity", 100)
// .attr("transform", "rotate(" + (360) + ")");

var rectangleAttributes = rectangles
    .attr("x", 200)
    .attr("y", 600)
    .attr("height", 80)
    .attr("width", 200)
    .style("fill", "green");

//Text for the start button
svg.append("text")
    .attr("x", 200)
    .attr("y", 100)
    .attr("text-anchor", "left")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("To filter, enter a classification.  To start,  click the green rectangle")
    .transition()
    .attr("x", 200)
    .attr("y", 450)
    .duration(2000)
    .transition()
    .delay(3000)
    .style("opacity", 0)
    .duration(1000)
    .remove()



///////////////////////
//animation function
///////////////////////
function start() {

    d3.json(queryUrl, function(error, data) {
        console.log(data)


        //Rectangle is bound and will make into a bar chart?
        svg.selectAll("rect")
            .data(rectangleData)
            .transition()
            .duration(1000)
            //.delay(1000)
            .attr("x", 1875)
            .attr("y", 700)
            .attr("height", 50)
            .attr("width", 50)
            .style("fill", "#222")
            .style("transform", "skewX(-75deg)")
            .style("transform", "skewY(-15deg)")
            .remove()


        var circleGroup = svg.append("g");

        var circleGroup = circleGroup.selectAll("circle")
            .data(data)
            .text(function(d) {
                return d.name;
            })
            .attr("class", "label")
            //.append("g")
            .enter()
            .append("circle")

            /////////////////////////////////////////////////////////////////////////////////////
            //Filter function shows only the meteorites belonging to classifcation matching input
            /////////////////////////////////////////////////////////////////////////////////////
            .filter(
                function(d) {
                    var classification = document.getElementById("classification").value
                    if (classification != "") {
                        return d.recclass.toLowerCase() == classification.toLowerCase();
                    } else {
                        //console.log(d.recclass)
                        return d.recclass
                    }
                }
            )
            .style("opacity", 0.75)
            .style("fill: ", "4682b4")
            .style("transform", "skewY(15deg)")
            .transition()
            .duration(1000)
            .attr("opacity", 0)
            .transition()
            .attr("cx", 846)
            .attr("cy", -110)
            .attr("r", 3)
            .style("fill", "#4682b4")
            .transition()

            ////////////////////////////////////////////////////////
            //ease function in d3 affects approach of circles to map.  
            /////////////////////////////////////////////////////////
            .ease(d3.easeLinear)
            .style("fill", "red")

            .delay(function(d, i) {
                return 200 + parseInt(d.id);
            })
            .duration(2300)


            .attr("cy", function(d, i) {
                try {
                    return (projection(d.geolocation.coordinates)[1]);
                } catch (err) {
                    console.log("json entry missing long and lat")
                }
            })

            //end transition
            .attr("cx", function(d, i) {

                try {

                    return projection(d.geolocation.coordinates)[0];

                } catch (err) {
                    console.log("json entry missing long and lat")
                }
            }).style("transform", "skewY(-15deg)")
            .transition()

            //this code highlights the impact zone
            .attr('r', function(d, i) {
                try {
                    //console.log(d.mass);
                    //console.log("We made it to the " + i + " index")


                    //console.log(Math.sqrt(parseInt(d.mass)));
                    return (Math.sqrt(parseInt(d.mass) / 100))


                } catch (err) {
                    console.log("oh snap, error in radius expansion animation")
                }
            })
            .style("opacity", 0.9)
            .text(function(d, i) {
                return d.name
            }).attr("class", "label")
            .duration(500)
            //return circles to the original size
            .transition()
            .duration(300)
            .attr('r', 3)
            .transition()
            //end of code highlighting impact zone

            //.duration(3000)
            .attr("r", function(d, i) {
                try {
                    //
                    //Final sizing for the meteorite impact radius
                    //
                    return (Math.sqrt(Math.sqrt(parseInt(d.mass) / 100)))


                } catch (err) {
                    console.log("oh snap, error in radius expansion animation")
                }
            })
            .style("fill", "orange")
            .style("opacity", 0.5)
            .style("stroke", "#222")
            .style("stroke-width", "1px")


        ///////////////////////////////////////////////////
        ///////////////////////////////////////////////////
        d3.selectAll('circle')
            .on('mouseover', function(d, i) {
                d3.select('.meteorClass2')
                    .html(d.name + "<hr>" + d.recclass + "<hr>" + d.mass)
                    .style("text-align", "left")
                    
                   // .attr("y", 200);
            })



        d3.selectAll('.nodes')
            .on('mouseover', function(d, i) {
                d3.select('.nodes')
                    .text('Meteorite has a classification of ' + d.Name)
                    
            });
        ///////////////////////////////////////////////////

        d3.select('.meteorClass1')
            .html( "Name:<hr>Classification:<hr>Mass:")
            .style("text-align", "right")
           // .attr("y", 200)
            ;

        //////////////////////
        //Tool Tips
        //////////////////////
        var tooltip = d3.select("body")
            .append("div")
            .attr("class", "toolTip");
        
        //animation of the links on the tree
        svg.select('svg g.links')
            .selectAll('line.link')
            
            .transition()
            .duration(2000)
            .style("transform", "skewY(15deg)")

        //animation of the node movements
        svg.select('svg g.nodes')
            .selectAll('circle.node')
            .on("mouseover", function(d, i) {
                d3.select(this)
                    .style("fill", "orange")

            })
            // onmouseout event
            .on("mouseout", function(d, i) {
                // Use D3 to select element, change color back to normal
                d3.select(this)
                    .style("fill", "4682b4");
            })
            .transition()
            .duration(2000)
            .style("transform", "skewY(15deg)");
        //////////////////////
        //Tooltips - don't work
        //////////////////////
        d3.select('svg g.nodes')
            .on("mouseover", function(data) {
                return tooltip.style("visibility", "visible");
            })
            .on("mousemove", function(data) {
                return tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
            })
            .on("mouseout", function(data) {
                return tooltip.style("visibility", "hidden");
            });

        //Animation of the maps for skewing
        d3.selectAll("path")
            .transition()
            .duration(2000)
            .style("transform", "skewY(-15deg)");


        //Title for the tree map
        svg.append("text")
            .attr("x", 125)
            .attr("y", 25)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("text-decoration", "bold")
            .text("Meteorite Classifications")
            .transition()
            .attr("x", 825)
            .attr("y", 280)
            .duration(2000)
            .style("transform", "skewY(15deg)");

        //Title for the map
        svg.append("text")
            .attr("x", 125)
            .attr("y", 25)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("text-decoration",  "bold")
            .text("Locations of Strikes")
            .transition()
            .attr("x", 325)
            .attr("y", 600)
            .duration(2000)
            .style("transform", "skewY(-15deg)");


        //Our Names
        svg.append("text")
            .attr("x", 750)
            .attr("y", 25)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
           // .text("Jeff, Abe, Harshil, Amitabha")
            .transition()
            .attr("x", 925)
            .attr("y", 350)
            .duration(2000)
            .style("transform", "skewY(15deg)");


        svg.append(".status")
            .attr("x", 750)
            .attr("y", 25)
            .attr("text-anchor", "left")
            .style("font-size", "16px")
            .style("text-decoration", "underline")
            

            .transition()
            .attr("x", 725)
            .attr("y", 350)
            .duration(2000)




    })
}
});