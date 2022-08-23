import { Component, createRef } from 'react';
import * as d3 from 'd3';

const imagePadding = 14;

const aggregationTypeDict = {
    "continent": "class",
    "weight": "decile",
    "height": "decile",
    "horns": "class"
};

const displayMetricNameDict = {
    "continent": "continent",
    "weight": "weight decile",
    "height": "height decile",
    "horns": "horn shape"
}

class SpeciesBarChart extends Component {
    constructor(props) {
      super(props);
      this.state = {metric: 'continent'};
  
      this.handleChange = this.handleChange.bind(this);

      this.ref = createRef();
      this.rawData = require('./data/species.json');
    }
  
    handleChange(event) {
      this.setState({metric: event.target.value});
      this.updateChart(event.target.value);
    }
    componentDidMount() {
        this.updateChart();
    }

    componentWillUnmount(){
    }

    updateChart(metric=this.state.metric){
        let aggreg;
        if (aggregationTypeDict[metric] === "class"){
            aggreg = Array.from(d3.rollup(this.rawData, v=>v, d => d[metric]))
                .sort((a,b) => d3.ascending(a[0],b[0]));
        }
        else if (aggregationTypeDict[metric] === "decile"){
            aggreg = [];
            let max = d3.max(this.rawData.map(d => d[metric]));
            let min = d3.min(this.rawData.map(d => d[metric]));
            let step = (max - min) / 10;
            for (let i = 0; i < 10; i ++){
                let values = [];
                let name = String(min + Math.ceil(i * step)) + ' - ' + String(min + Math.floor((i+1)*step));
                for (let dat of this.rawData){
                    if (min + Math.ceil(i * step) < dat[metric] && dat[metric] <= min + Math.floor((i+1)*step)){
                        values.push(dat);
                    }
                }
                aggreg.push([name, values]);
            }
        }

 
        var margin = {top: 30, right: 30, bottom: 70, left: 60};
        var width = window.innerWidth / 2 - margin.left - margin.right,
        height = window.innerHeight / 2 - margin.top - margin.bottom;

        let svg = d3.select(this.ref.current).select('svg');
        svg.selectAll('*').remove();
        let g = svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand()
            .range([ 0, width ])
            .domain(aggreg.map(function(d) { return d[0]; }))
            .padding(.2);
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        var y = d3.scaleLinear()
            .domain([0, d3.max(aggreg.map(function(d){return d[1].length}))])
            .range([ height, 0]);
        g.append("g")
            .call(d3.axisLeft(y));

        g.selectAll(".bar")
            .data(aggreg)
            .enter()
        .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1].length); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d[1].length); })
            .attr("fill", "#69b3a2")
            .on('mousemove', function(event, data) {
                d3.select(event.target).attr("fill", "#8bd5c4");
                let div = d3.select("body").select("#row-hover");
                if (!div.node()){
                    div = d3.select("body").append("div");
                    div.attr("id", "row-hover");
                    for (let dat of data[1].sort((a,b) => d3.ascending(a,b))){
                        div.append("div").text(dat.name);
                    }   
                }
                div.style("top", event.clientY + imagePadding + "px")
                    .style("left", event.clientX + imagePadding + "px");
            })
            .on('mouseleave', function(event, data){
                d3.select(event.target).attr("fill", "#69b3a2");
                let div = d3.select("body").select("#row-hover");
                if (div.node()){div.remove();}
            })
    }
  
    render() {
        return (
        <div className="bar-chart" ref={this.ref}>
            <select id="aggregSelect" onChange={this.handleChange}>
                <option value="continent">continent</option>
                <option value="weight">weight</option>
                <option value="height">height</option>
                <option value="horns">horns</option>
            </select>
            <div id='chart-title'>Species count by {displayMetricNameDict[this.state.metric]}</div>
            <svg/>
        </div>
        );
    }
  }

export default SpeciesBarChart;
