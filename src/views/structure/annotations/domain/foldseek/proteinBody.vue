<template>
  <div>
      <h1>11</h1>
    <svg id="chart" width="400" height="200"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  props: ['dataset'],
  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been re-rendered
      this.plot_protein_body()
    })
  },
  methods: {
    plot_protein_body() {
      let dataset = this.dataset
      // Width and height of SVG
const w = 500;
const h = 100; 

// Data with gene start, end, and match region
const data = [
  {start: 0, end: 100, matchStart: 20, matchEnd: 50},
  {start: 0, end: 80, matchStart: 10, matchEnd: 30},
];

// Create SVG
const svg = d3.select('body')
  .append('svg')
  .attr('width', w) 
  .attr('height', h);

// Create line generator
const lineGen = d3.line()
  .x(d => xScale(d.start)) 
  .y(h/2)
  .curve(d3.curveLinear); 

// Create scale for x-axis
const xScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, w]);

// Draw line 
svg.append('path')
  .attr('d', lineGen(data))
  .attr('stroke', 'black')
  .attr('fill', 'none');

// Draw match rectangles
svg.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
    .attr('x', d => xScale(d.matchStart))
    .attr('y', 0)
    .attr('width', d => xScale(d.matchEnd) - xScale(d.matchStart)) 
    .attr('height', h)
    .attr('fill', 'blue')

// Tooltip rectangle 
const tooltip = svg.append('rect')
  .attr('x', 0)
  .attr('y', 0)
  .attr('width', 0)
  .attr('height', 0)
  .style('fill', 'white')
  .style('opacity', 0);
  
// Text element   
const text = svg.append('text')
  .attr('x', 0)
  .attr('y', 0)
  .text('');

// On mouseover show tooltip  
svg.selectAll('rect')
  .on('mouseover', function(d) {
    
    tooltip.transition()
      .style('opacity', 1);  
      
    text.text( `Match: ${d.matchStart} - ${d.matchEnd}` );
    
  })
  // On mouseout hide tooltip
  .on('mouseout', function(d) {
    
    tooltip.transition()
      .style('opacity', 0);
  });
    },
  },
}
</script>

<style>
</style>