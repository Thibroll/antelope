import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const titles = ["name",
    "continent",
    "weight",
    "height",
    "horns"
];

const imagePadding = 14;

function SpeciesTable(){
    const data = require('./data/species.json');

    const tableRef = useRef(null);

    useEffect(() => {
        var sortAscending = true;
        const table = d3.select(tableRef.current);
        table.selectAll("*").remove();
        const headers = table.append('thead').append('tr')
		                   .selectAll('th')
		                   .data(titles).enter()
		                   .append('th')
		                   .text(function (d) {
			                    return d;
		                    })
		                   .on('click', function (event, target) {
                                headers.attr('class', 'header');
                                if (sortAscending) {
                                    rows.sort(function(a, b) { return d3.ascending(a[target], b[target]); });
                                    sortAscending = false;
                                    this.className = 'aes';
                                } else {
                                    rows.sort(function(a, b) { return d3.descending(a[target], b[target]); });
                                    sortAscending = true;
                                    this.className = 'des';
                                }
		                   });
        const rows = table.append('tbody').selectAll('tr')
            .data(data).enter()
            .append('tr')
            .on('mousemove', function(event, data) {
                let div;
                div = d3.select("body").select("#row-hover");
                if (!div.node()){
                    div = d3.select("body").append("div");
                    div.attr("id", "row-hover");
                    div.append("div").text(data["name"]);
                    div.append("img").attr("src", data["picture"]);
                }
                
                div.style("top", event.clientY + imagePadding + "px")
                    .style("left", event.clientX + imagePadding + "px");
            })
            .on('mouseleave', function(event, data){
                let div = d3.select("body").select("#row-hover");
                if (div.node()){div.remove();}
            });

        rows.selectAll('td')
        .data(function (d) {
            return titles.map(function (k) {
                return { 'value': d[k], 'name': k};
            });
        }).enter()
        .append('td')
        .attr('data-th', function (d) {
            return d.name;
        })
        .text(function(d) {return d.value})
    });

    return (
    <div className='table-wrapper'>
        <table ref={tableRef} />
    </div>);

}

export default SpeciesTable;