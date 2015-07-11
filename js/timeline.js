var margin = parseInt(d3.select("#timeline").style("width")) * 0.5
var width = parseInt(d3.select("#timeline").style("width")) - margin;
var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
var dataset, x, bar;

function getWidth(t) {
    var e;
    return e = x("" != t.enddate ? new Date(t.enddate) : new Date), e - x(new Date(t.startdate))
}

function getMargin(t) {
    return x(new Date(t.startdate))
}

function getStyle(t) {
    return "width: " + getWidth(t) + "px; margin-left: " + getMargin(t) + "px;"
}

function getDate(t) { 
 	
 	if (parseInt(d3.select("#timeline").style("width")) >= 1000) {
 		var format_month = d3.time.format("%B")
	 	var format_year = d3.time.format("%Y")
 	} else {
		var format_month = d3.time.format("%b")
	 	var format_year = d3.time.format("'%y")

 	}

	var startmonth = format_month(new Date(t.startdate))
 	var endmonth = format_month(new Date(t.enddate))
	var startyear = format_year(new Date(t.startdate))
 	var endyear = format_year(new Date(t.enddate))
 	

 	if (t.enddate == "") {
 		endmonth = "Present"
 		endyear = ""
 	}

 	if (startmonth == endmonth && startyear == endyear)  {
		return startmonth + " " + startyear + "&nbsp;"  
	} else if ( startyear ==  endyear ) {
		return startmonth + " - " + endmonth + " " + startyear + "&nbsp;"  
	} else {
		return startmonth + " " + startyear + " - " + endmonth + " " + endyear + "&nbsp;"  
	}

	
}

function getTitle(t) {

	if (parseInt(d3.select("#timeline").style("width")) >= 1000 || t.shorttitle == null) {
		return t.title
	} 
 	return t.shorttitle
}

function scrollTween(offset) {
  return function() {
    var i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, offset);
    return function(t) { scrollTo(0, i(t)); };
  };
}


function resize() {
    margin = .25 * parseInt(d3.select("#timeline").style("width"))
    width = parseInt(d3.select("#timeline").style("width")) - 2 * margin 

    x.range([0, width])

    bar.selectAll("div")
    	.transition()
		.ease("bounce")
		.duration(500)
		.delay(function(d,i) {return(i*100) })
		.style("width", function(t) { return getWidth(t) + "px"} )
		.style("margin-left", function(t) { return getMargin(t) + "px"} )
    
    d3.select("#present").style("margin-left", x(new Date())  + "px" )
}

function key_func(d) {
	return (d.title + d.startdate);
}

function draw() {

	x = d3.time.scale()
		.range([0, width])
		.domain(d3.extent(dataset, function(t) {
	        return new Date(t.startdate)
	    }));

	var minyear = d3.min(dataset, function(d) { return new Date(d['startdate']).getFullYear() })
	var maxyear = d3.max(dataset, function(d) { return new Date(d['enddate']).getFullYear() })
	var years = d3.range(minyear, maxyear + 1)

	var present = d3.select("#timeline")
		.append("div")
		.attr("id","present")
		.html("&nbsp;")

	present
		.transition()
		.duration(3000)
		.style("margin-left", x(new Date())  + "px")
		


	var g = d3.select("#timeline")
		.selectAll("div.foo")
		.data(dataset, key_func)

	bar = g
		.enter()
		.append("div")
		.attr("class", "foo")

	bar.append("div")

		.on("click", function(d) { 

			var target = d3.select("h3#target_" + dataset.indexOf(d));
			var a = target.node().getClientRects()[0].top - document.body.getClientRects()[0].top + 20;

			d3.transition()
    			.duration(1500)
    			.tween("scroll", scrollTween(a));
			})


		.on("mouseout", function(d) {
			d3.select("#timeline")
				.selectAll("div.foo")
				.data(dataset, key_func)
				.transition()
				.duration(500)
				.style("opacity",1)

			d3.select("#timeline .year")
				.transition()
				.duration(500)
				.style("width", 0)
				.style("margin-left", 0)
				.style("opacity",0)
		})

		.on("mouseover", function(d) {

			var filteredyears = years
				.filter(function(y) { 

					var startyear = new Date(d.startdate).getFullYear();

					if (d.enddate != "") {
						var endyear = new Date(d.enddate).getFullYear();
					} else {
						var endyear = new Date().getFullYear();
					}

					return (y <= endyear) && (y >= startyear) 

				})

			d3.select("#timeline")
				.selectAll("div.year")
				.remove()

			var yeardiv2 = d3.select("#timeline")
				.append("div")
				.attr("class","year")

			yeardiv2
				.style("width", x(new Date("" + (filteredyears[filteredyears.length-1] + 1))) - x(new Date("" + filteredyears[0])) + "px")
				.style("margin-left", x(new Date("" + filteredyears[0]))  + "px" )
				.style("background-color", "#eee")
				.html("&nbsp;")

			var filtereddata = dataset
				.filter(function(d) {
					return filteredyears.indexOf(new Date(d.startdate).getFullYear()) != -1;
				})

			d3.select("#timeline")
				.selectAll("div.foo")
				.data(filtereddata, key_func)
				.transition()
				.duration(500)
				.style("opacity",1)

			var filtereddata = dataset
				.filter(function(d) {
					return filteredyears.indexOf(new Date(d.startdate).getFullYear()) == -1;
				})
			
			d3.select("#timeline")
				.selectAll("div.foo")
				.data(filtereddata, key_func)
								.transition()
				.duration(500)
				.style("opacity",.2)

		})

		.attr("class", function(t) { return "bar " + t.type })
		.transition()
		.ease("bounce")
		.duration(1000)
		.delay(function(d,i) {return(1000*Math.random()) })
		.style("width", function(t) { return getWidth(t) + "px"} )
		.style("margin-left", function(t) { return getMargin(t) + "px"} )
		

	bar.append("b").html(function(t) { return(getDate(t)) } )

		.on("click", function(d) { 

			var target = d3.select("h3#target_" + dataset.indexOf(d));
			var a = target.node().getClientRects()[0].top - document.body.getClientRects()[0].top + 20;

			d3.transition()
    			.duration(1500)
    			.tween("scroll", scrollTween(a));
			});

	bar.append("span").html(function(t) {  return(getTitle(t)) })
	
		.on("click", function(d) { 

			var target = d3.select("h3#target_" + dataset.indexOf(d));
			var a = target.node().getClientRects()[0].top - document.body.getClientRects()[0].top + 20;

			d3.transition()
    			.duration(1500)
    			.tween("scroll", scrollTween(a));
		});

	bar.style("padding-left",function(t) { return getMargin(t) + "px";} )
		.style("text-indent", function(t) { return "-" + getMargin(t) + "px"} )

   	var filtered_exp = dataset
   		.filter(function(d) { return d.type == "job" })
   		.sort(function(a, b){ return d3.descending(a.startdate, b.startdate); });

    var experience = d3.select('#experience')
    	.selectAll('div')
    	.data(filtered_exp)
    	.enter()
    	.append('div')

    title = experience.append('h3')
    	.attr("id", function(d) { return "target_" + dataset.indexOf(d) });

    title.append("span")
    	.attr("class", function(d) {return "glyphicon glyphicon-" + d.glyph })
    	.attr("aria-hidden","true")

    title.append("b").html(function(t) { return( "&nbsp;" + getDate(t)) } );
    title.append("span").html(function(t) { return( getTitle(t)) } );

    experience.append("div")
    	.attr("class","description")
    	.html(function(t) { return t.description });

    var filtered_edu = dataset
    	.filter(function(d) { return d.type == "education" })
    	.sort(function(a, b){ return d3.descending(a.startdate, b.startdate); });

    var education = d3.select('#education')
    	.selectAll("div")
    	.data(filtered_edu)
    	.enter()
    	.append("div")

    title = education.append('h3')
    	.attr("id", function(d) { return "target_" + dataset.indexOf(d) });

    title.append("span")
    	.attr("class", function(d) {return "glyphicon glyphicon-" + d.glyph })
    	.attr("aria-hidden","true")

    title.append("b")
    	.html(function(t) { return( "&nbsp;" + getDate(t)) } );

    title.append("span")
    	.html(function(t) { return( getTitle(t)) } );

    education.append("div")
    	.attr("class","description")
    	.html(function(t) { return t.description });

	var filtered_other = dataset
    	.filter(function(d) { return d.type == "other" })
    	.sort(function(a, b){ return d3.descending(a.startdate, b.startdate); });
     var other = d3.select('#other')
    	.selectAll("div")
    	.data(filtered_other)
    	.enter()
    	.append("div")

    title = other.append('h3')
    	.attr("id", function(d) { return "target_" + dataset.indexOf(d) });

     title.append("span")
    	.attr("class", function(d) {return "glyphicon glyphicon-" + d.glyph })
    	.attr("aria-hidden","true")

    title.append("b")
    	.html(function(t) { return( "&nbsp;" + getDate(t)) } );

    title.append("span")
    	.html(function(t) { return( getTitle(t)) } );

    other.append("div")
    	.attr("class","description")
    	.html(function(t) { return t.description });
}


d3.json("data/timeline.json", function(error, json) {
	if (error) return console.warn(error);
	json.sort(function(a,b) { return( d3.ascending(a.startdate,b.startdate) ) })
	
	dataset = json
	draw();
	d3.select(window).on("resize", resize)

});