var CHARTS = {
  init: function () {
    var dummySourceData = [
      {
        source: 'Twitter',
        count: 66666
      },
      {
        source: 'Facebook',
        count: 102999
      },
      {
        source: 'Homepage',
        count: 344322
      },
      {
        source: 'Snippet',
        count: 408392
      }
    ];

    this.renderSourceData(dummySourceData);
  },
  renderSourceData: function (data) {
    var width = 340,
      barHeight = 27;

    var colorScale = d3.scale.category20b();

    var x = d3.scale.linear()
      .domain([0, d3.max(data.map(function (item) {return item.count}))])
      .range([0, width]);

    var chart = d3.select('#chart-graphic-source')
      .attr('width', width)
      .attr('height', barHeight * data.length);

    var bar = chart.selectAll('g')
      .data(data)
    .enter().append('g')
      .attr('transform', function(d, i) { return 'translate(0,' + i * barHeight + ')'; });

    bar.append('rect')
      .attr('width', function(d) { return x(d.count) })
      .attr('height', barHeight - 2)
      .attr('fill', function(d, i) { return colorScale(i) });

    bar.append('text')
      .attr('x', function(d) { return x(d.count) - 10})
      .attr('y', barHeight / 2)
      .attr('dy', '.35em')
      .text(function(d) { return d.source; });
  },
  renderCountryData: function (data) {

  }
};

CHARTS.init();
