<template>
  <div>
      <h1>11</h1>
    <!-- <svg id="chart" width="400" height="200"></svg> -->
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
      let width = 800
      let height = 400
      let gene_svg = d3
        .select(this.$el)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
    
    // Sample gene data (replace this with your actual gene data)
    const geneData = [
      { name: "GeneA", start: 10, end: 100, row: 1, description: "Gene A description" },
      { name: "GeneB", start: 40, end: 200, row: 2, description: "Gene B description" },
      { name: "GeneC", start: 120, end: 250, row: 3, description: "Gene C description" },
      // Add more gene fragments as needed
    ];

     // Define scales and layout
    const xScale = d3.scaleLinear()
      .domain([0, 300]) // Adjust the domain based on your genomic positions
      .range([50, 550]); // Adjust the range to position the rectangles horizontally

    const yScale = d3.scaleLinear()
      .domain([1, 4]) // Adjust the domain based on the number of rows
      .range([100, 20]); // Adjust the range to position the rows vertically
     
     let axis = d3.axisTop(xScale)
     
     // console.log(axis)
     gene_svg.selectAll("rect")
        .data(geneData)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.start))
        .attr('y', d => d.row * 25 + 30 )
        .attr('width', d =>xScale(d.end) - xScale(d.start) )
        .attr('height', 20)
        .attr('fill', 'red')

    // 
    const axis_plot = gene_svg
        .append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(10,45)')
        .call(axis)



    },
  },
}
</script>

<style>
</style>