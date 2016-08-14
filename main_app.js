angular.module('d3BubbleChart', [])
.controller('d3Controller',function($scope,$http){

})
.directive('bubbleChart',function($parse,$window,$http){
	return{
		restrict:'EA',
		link: function(scope, elem, attrs){

					var w = 300,
			        h = 300;
			    var d3 = $window.d3;

			    var elem = d3.select(elem[0])
			    var layerswidth = attrs.chartwidth - 10;
			    var layersheight = attrs.chartheight - 10;
			    var layers = elem.selectAll('div')
			    				.data([1,2,3])
			    				.enter().append('div')
			    				.attr("id", function(d, i) { return "layer-" + i; })
			    				.attr("width", layerswidth+"px")
			    				.attr("height", layersheight+"px")
			    				.attr('class',"layer")

			    var myTool = d3.select('body')
				                  .append("div")
				                  .attr("class", "mytooltip")
				                  .style("opacity", "0")
				                  .style("display", "none");

			    d3.json('data.json',function(error,data){
       			if(error) throw error;

       				var legend_div = d3.select('#layer-0').append('div').attr("class","legend");//div for legends
       				var svg_layer0 = d3.select('#layer-0')
										.append('svg')
										// .attr("viewbox","0 0 1000 300")
										.attr("width",layerswidth)
										.attr("height", layersheight)
										.append('g');

					var x = d3.scaleLinear().domain([0,100]).range([0,1000]);

       				var xAxis = d3.axisBottom(x);
							svg_layer0.append('g').attr("class","axis")
																		.attr("transform", "translate(0," + (layersheight-50) + ")")
																		.call(xAxis);

							var colors_svg_layer0 = data.map(function(d){
																				return getRandomColor();
																			})
       				var allCirclePosL0 =[];
       				svg_layer0.selectAll('circle')
       									.data(data)
       									.enter().append('circle')
												.attr("r", function(d,i) { 
													var r = (d.size)/2;
													allCirclePosL0.push({r:r});
													return 	r;
												}) // first layer circle radius calculations
         								.attr("cx",function(d,i){ 
         									var intialSpacing = i!==0?0:150;
       										var c = intialSpacing + allCirclePosL0[i].r;
	       									if(i>0){
	       										c = allCirclePosL0[i-1].c + allCirclePosL0[i-1].r + allCirclePosL0[i].r + 50;
	       									}
       										allCirclePosL0[i].c = c;
       										// var preCircleDiameter = i===0?0: (Math.sqrt(d.potentialSales - i*100) / Math.PI)*2;
       										// var renderedcenter = intialSpacing+ (preCircleDiameter) + 50;
       										return c;
       									})
         								.attr('cy',100)
												.style("stroke",function(d,i){return colors_svg_layer0[i]})
     										.style("fill", "none")
     										.style("stroke-width", 2)
     										.style("cursor", "pointer")    
     										.style("pointer-events","visible")
     										.on("click",function(d){
     											getSecondLayer(d)
     										})
     										.each(function(data,i){
     											var legend_span = legend_div.append('span').attr("class","legend-span")

     													legend_span.append("p").attr('class',"legend-icon-p")
     																		.append('svg').attr("class","legend-icon")
     																		.append('rect')
     																		// .attr("rx","10")
																				.attr("ry","20")
																				.attr("class","legend-icon")
																				// .attr("width","18")
																				// .attr("height","10")
																				.style("fill",colors_svg_layer0[i])
															legend_span.append('p')
																					.attr('class',"legend-text")
						              								.html(function(d,i){return data.keyword})

     										})

       				
       		})

       		function getSecondLayer (data){ // for rendering second layer of circles
       			var allCirclePosL1 =[];
						d3.select('#layer-1').selectAll("*").remove();

						showLayer("#layer-0","#layer-1");//for removing elements of layer1

       			var legend_div = d3.select('#layer-1').append('div').attr("class","legend");//div for legends
       				
       			var svg_layer1 = d3.select('#layer-1')
 																.append('svg')
 																// .attr("viewbox","0 0 1000 300")
 																.attr("width",layerswidth)
																.attr("height", layersheight)
																.append('g');

						var x = d3.scaleLinear().domain([0,100]).range([0,1000]);

						d3.select('#layer-1').append('button')
																	.attr('class',"back-button")
																	.on("click",showLayer.bind(null,"#layer-1","#layer-0"))
																	.html("back")


     				var xAxis = d3.axisBottom(x);
						svg_layer1.append('g')
											.attr("class","axis")
											.attr("transform", "translate(0," + (layersheight-50) + ")")
											.call(xAxis); // appending x-axis on bottom of the layer-1

						var colors_svg_layer1 = data.data.map(function(d){
																				return getRandomColor();
																			})

       			svg_layer1.selectAll('circle')
       								.data(data.data)
     									.enter().append('circle')
											.attr("r", function(d,i) {
												var r =  Math.sqrt(d.potentialSales - i*100) / Math.PI;
												allCirclePosL1.push({r:r})
												return r	 }) // second layer circle radius calculations
       								.attr("cx",function(d,i){

       									var intialSpacing = i!==0?0:150;
       									var c = intialSpacing + allCirclePosL1[i].r;
       									if(i>0){
       										c = allCirclePosL1[i-1].c + allCirclePosL1[i-1].r + allCirclePosL1[i].r + 50;
       									}
       									allCirclePosL1[i].c = c;
       									return c;
       								})
       								.attr('cy',100)
											.style("stroke",function(d,i){return colors_svg_layer1[i]})
   										.style("fill", "none")
       								.style("pointer-events","visible")
   										.style("stroke-width", 2)
   										.each(function(data,i){
   											var legend_span = legend_div.append('div').attr("class","legend-span")

												legend_span.append("p").attr('class',"legend-icon-p")
																	.append('svg').attr("class","legend-icon")
																	.append('rect')
																	// .attr("rx","10")
																	.attr("ry","20")
																	.attr("class","legend-icon")
																	// .attr("width","18")
																	// .attr("height","10")
																	.style("fill",colors_svg_layer1[i])
												legend_span.append('p')
																	.attr('class',"legend-text")
		              								.html(function(d,i){return data.name})

     									})
     									.on('mouseover',function(d,i){
     										showLayer(null,"#layer-2")
     										getHoverData(d,i,colors_svg_layer1[i])
     									})
     									.on('mouseout',function(d){
     										// showLayer("#layer-2",null);
     										// d3.select('#layer-2').selectAll("*").remove();
     									})
       		}

       		function getRandomColor() {
				    var letters = '0123456789ABCDEF';
				    var color = '#';
				    for (var i = 0; i < 6; i++ ) {
				        color += letters[Math.floor(Math.random() * 16)];
				    }
				    return color;
					}

       		function showLayer(toHide,toShow){

       				if(toShow =="#layer-2"){
       					d3.select("#layer-1").style("opacity","0.4")
       					return d3.select(toShow).style("opacity","1").style("z-index","103");
       				}

       				if(toHide =="#layer-2"){
       					d3.select("#layer-1").style("opacity","1")
       					return d3.select(toHide).style("opacity","0").style("z-index","90");
       				}
       				
       				d3.select(toShow).style("opacity","1").style("z-index","101")
       				d3.select(toHide).style("opacity","0").style("z-index","100")
       				
       		}

       		function packNormalizer(data,color){
       			var a = JSON.parse(JSON.stringify(data));
       			a.children = a.leads;
       			delete a.leads;
       			return a;
       		}

       		function getHoverData (data,index,color){

						// d3.select('#layer-2').selectAll("*").remove();
       			var pack = d3.pack().size([w, h]).padding(15);
			    					// var nodes = pack(data);
			      			// 							.value(function(d) { return d.size; })
	       		normalizedData 		= 	packNormalizer(data);
   					var heiarchyData 	= d3.hierarchy(normalizedData)
							      					// .each(function(d) { if (/^other[0-9]+$/.test(d.data.name)) d.data.name = null; })
							      						.sum(function(d) { return d.leadValue; })
							      						.sort(function(a, b) { return b.value - a.value; });

						pack(heiarchyData);

				    var layer2_close = d3.select('#layer-2')
				    										.append("a")
				    										.attr("class","close-classic")
				    										.on("click",function(){
				    											showLayer("#layer-2",null);
     															d3.select('#layer-2').selectAll("*").remove();
				    										})

	       		var svg_layer2 = d3.select('#layer-2')
	       															.attr("class","overlay")
       																.append('svg')
       																.attr("width",layerswidth)
																			.attr("height", layersheight)
																			.style("margin-left","38%")
																			.append('g');

	       		svg_layer2.selectAll("circle")
		       							.data(heiarchyData.descendants())
			       						.enter().append('g').append("circle")
			      						.attr("id", function(d, i) { return "node-" + i; })
			      						.attr("r", function(d) { return d.r; })
			      						.attr("cx",function(d,i){ return d.x})
			           				.attr('cy',function(d,i){ return d.y})
			      						.attr('fill', "none")
			        					.attr('stroke',color)
       									.style("pointer-events","visible")
			        					.style("stroke-width",2)
			        					.on("mouseover", function(d){
			        						var data = d.data;
			        						if(d.children) return;
			        						var state = decideTooltipPosition(d);
							            d3.select(this)
						                .style("cursor", "pointer")
						                .style("stroke-width",5)
						           			.transition()
							            	.duration(500);

									        var leftPosition = state[0] ==='left'?(d3.event.pageX - d.parent.r):(d3.event.pageX + d.r);
									        // var topPosition = state[1] ==='top'?(d3.event.pageY - 100):(d3.event.pageY + 100);
									        var caret = state[0] ==='left'?"right-arrow":"left-arrow";

									        myTool
									              .style("opacity", "1")                           
									              .attr("width","auto")
									              .attr("height","auto")
									              .style("display", "block")
									              .style("left", (leftPosition) + "px")
									              .style("top", d3.event.pageY + "px")
									              .attr("class",caret)
									              .html(function(d,i){return "<p class=\"tooltip-content\">"+data.firstName+" "+data.lastName+"</p><p class=\"tooltip-content\">"+data.company+"</p><p class=\"tooltip-content\">$"+data.leadValue+"</p>"})
									              .transition()  //Opacity transition when the tooltip appears
									              .duration(500)
									               //The tooltip appears
									    	})
									    .on("mouseout", function(d){
			        					if(d.children) return;
							            d3.select(this)
							                .style("cursor", "normal")
							                .style("stroke-width", 2)
							                .transition()
							                .duration(500)

							            myTool
							                .style("opacity", "0")            
							                .style("display", "none")  //The tooltip disappears
							                .transition()  //Opacity transition when the tooltip disappears
							                .duration(500)
								    	});

						var tableData = normalizedData.children;
			    	// var columns = Object.keys(tableData[0]);
			    	var columns = ["Name","Company","Lead Value","# Session Attended"];
			    	var normalizeTableData = normalizeForTable(tableData,columns);
						getTableData(normalizeTableData,columns,"#layer-2");
	       	}

	       	function normalizeForTable (tableData,columns){

	       		return tableData.map(function(obj,i){
	       				var a = {};
	       				columns.map(function(key){
	       					switch(key){
	       						case "Name":
	       						a[key] = obj.firstName +" "+obj.lastName ;
	       						break;

	       						case "Company":
	       						a[key] = obj.company;
	       						break;

	       						case "Lead Value":
	       						a[key] = obj.leadValue;
	       						break;

	       						case "# Session Attended":
	       						a[key] = obj.sessionsAttended;
	       						break;
	       					}
	       				})
	       				return a;
	       		})
	       	}

   				function decideTooltipPosition (d){
   					var Xposition = (d.parent.x - d.x)>0?"left":"right"
   					var Yposition = (d.parent.y - d.y)>0?"top":"bottom"
   					return [Xposition,Yposition]
   				}

   				function getTableData(data,columns,elem){

   					var table = d3.select(elem).append('table').attr("class", "up-arrow");
    				var thead = table.append("thead")
    				var tbody = table.append("tbody")

				    // append the header row
				    thead.append("tr")
				        .selectAll("th")
				        .data(columns)
				        .enter()
				        .append("th")
				        .text(function(column) { return column; });

				    // create a row for each object in the data
				    var rows = tbody.selectAll("tr")
										        .data(data)
										        .enter()
										        .append("tr");

			    	// create a cell in each row for each column
				    var cells = rows.selectAll("td")
										        .data(function(row) {
										            return columns.map(function(column) {
										                return {column: column, value: row[column]};
										            });
										        })
										        .enter()
										        .append("td")
										        .html(function(d) { return d.value; });
   				}
		}
	}
});