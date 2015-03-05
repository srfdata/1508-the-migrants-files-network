$(function() {
    console.log('SRF Data here, welcome to the console.');
    console.log('Authors: Maximilian Schaefer (Spiegel), Timo Grossenbacher (SRF Data)');
    // Variabeln
    var data = [],
        width, height, radius, link_distance, charge, color, svg, force, node, link, value, key, jTool;




    color = ["#555555", "#fe0000"];

    // Variabeln Set für www
    data.www = {};
    data.www.width = 592;
    data.www.height = 592;
    data.www.radius = 2;
    data.www.link_distance = 120; //130 für alle Links
    data.www.charge = -17; //-150 für alle Links

    /*// Variabeln Set für mobile
    data.mobile = {};
    data.mobile.width = 320;
    data.mobile.height = 320;
    data.mobile.radius = 0.5;
    data.mobile.link_distance = 70;
    data.mobile.charge = -5; //charge für größere Zahl von Nodes angepasst*/

    function initGraph() {

        /*if ($(window).width() > 500) { // bin ich breiter als 500px ---> www
            key = "www";
        } else { // sonst mobile
            key = "mobile";
            $("body").addClass("mobile");
        }*/
        key = 'www';


        jTool = $(".vis-tooltip");
        width = data[key].width;
        height = data[key].height;
        radius = data[key].radius;
        link_distance = data[key].link_distance;
        charge = data[key].charge;

        svg = d3.select("div#vis").append("svg")
            .attr("width", width)
            .attr("height", height);

        force = d3.layout.force()
            .linkDistance(link_distance)
            .charge(charge)
            .size([width, height]);

        d3.json("data/IMI-klein2.json", function(error, json) {

            force
                .nodes(json.nodes)
                .links(json.links)
                .start();

            link = svg.selectAll(".link")
                .data(json.links)
                .enter().append("line")
                .attr("class", "link")
                .style("stroke-width", function(d) {
                    return d.value / 10;
                })
                .classed('strong', function(d) {
                    return (d.value > 10);
                });

            node = svg.selectAll(".node")
                .data(json.nodes)
                .enter().append("g")
                .attr("class", "node")
                // .call(force.drag);

            node.append("circle")
                .attr("r", function(d) {
                    return Math.sqrt(d.anzahl * 1.5) + radius;
                }) //hier (und unten!) Radius für Vernetzungsgrad einstellen
                .attr("class", "kreis")
                // .style("fill", function(d) { return "#1f77b4"; });

            node.append("circle")
                .attr("r", radius * 4)
                .attr('class', 'sausage')
                .style("opacity", 0)
                .on('mouseover', function(d) {
                    if (d.tooltip !== "") {
                        var rollx = (d3.event.pageX),
                            rdif;

                        if (rollx + jTool.width() > $(window).width()) {
                            rdif = (rollx + jTool.width()) - $(window).width();
                            rollx = d3.event.pageX - (rdif + 20);
                        }

                        jTool.css({
                            "left": rollx + "px",
                            "top": d3.event.pageY - 20 + "px"
                        });
                        jTool.html(d.name).show();
                    }
                })
                .on('mouseout', function(d) {
                    jTool.hide();
                });

            force.on("tick", function() {
                link.attr("x1", function(d) {
                        return d.source.x;
                    })
                    .attr("y1", function(d) {
                        return d.source.y;
                    })
                    .attr("x2", function(d) {
                        return d.target.x;
                    })
                    .attr("y2", function(d) {
                        return d.target.y;
                    });

                node.attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

                d3.selectAll("select").
                on("change", function() {

                    value = this.value;

                    if (value == "zurueck") {
                        svg.selectAll(".kreis")
                            .transition()
                            .duration(1000)
                            .style("fill", function(d) {
                                return color[0];
                            });
                        svg.selectAll(".link.strong")
                            .transition()
                            .duration(1000)
                            .style("stroke", function(d) {
                                return color[1];
                            });
                    } else if (value == "unis") {
                        svg.selectAll(".kreis")
                            .transition()
                            .duration(1000)
                            .style("fill", function(d) {
                                if (d.typ == "UNI") return color[1];
                                else return color[0];
                            });
                            svg.selectAll(".link.strong")
                            .transition()
                            .duration(1000)
                            .style("stroke", function(d) {
                                return color[0];
                            });
                    } else if (value == "firma") {
                        svg.selectAll(".kreis")
                            .transition()
                            .duration(1000)
                            .style("fill", function(d) {
                                if (d.typ == "EFPIA") return color[1];
                                else return color[0];
                            });
                        svg.selectAll(".link.strong")
                            .transition()
                            .duration(1000)
                            .style("stroke", function(d) {
                                return color[0];
                            });
                    }
                });
            });
        });
    }
    $(document).ready(initGraph);

});
