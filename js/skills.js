/* Helper functions */

var accentColor = "#69c";

function colorSkills(aclass, acolor) {
	d3.selectAll(aclass)
		.transition()
		.duration(400)
		.style("background-color", acolor);
}

function resetSkills() {
	colorSkills(".label-skill", "black");
}

function containsObject(skill, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].skill === skill) {
            return i;
        }
    }
    return -1;
}

function addHoverToCategories(categories, color) {
	categories.forEach( function(label) {
		d3.select("#" + label)
			.on("mouseover", function(d) {colorSkills(".label-" + label, color)})
			.on("mouseout", function(d) {resetSkills() } )
	})

}

function getClassLabel(d) {
	return "label label-skill " + d.class.map(function(d) { return "label-" + d }).join(" ")
}

function getClassLabelWd(d) {
	return d.class.map(function(d) { return ".label-" + d }).join(",")
}

/* Add stuff to page */

function addSkills() {

	var skillset = d3.select("#listofskills").append("h4")

	/* Add skill labels */

	skillset
		.selectAll("span")
		.data(skills)
		.enter()
		.append("span")
		.html(function(d) { return d.skill; })
		.attr("class", function(d) { return getClassLabel(d) }) 
		.on("mouseover", function(d) { colorSkills( getClassLabelWd(d) , accentColor) })
		.on("mouseout", function(d) { resetSkills() } )

	/* Hover effects on categories */

	addHoverToCategories(["skillset1", "skillset2", "skillset3"], accentColor );

}

/* Load data and add skills */

d3.json("data/skills.json", function(error, json) {
	if (error) return console.warn(error);

	var myarray = []

	for (key in json) {

		json[key].forEach(function (d) { 

			var i = containsObject(d, myarray)
			if (i == -1) {
				myarray[myarray.length] = { "skill": d, "class": [key]}
			} else {
				myarray[i].class.push(key);
			}
			

		});
	}
	
	skills = myarray
	skills.sort(function(a,b) { return( d3.ascending(a.skill.toLowerCase(),b.skill.toLowerCase()) ) })

	addSkills();

});