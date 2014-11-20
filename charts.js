var CHARTS = {
  init: function () {
    var dummySourceData = [
      {
        source: 'Twitter',
        count: Math.floor(Math.random() * 1000000)
      },
      {
        source: 'Facebook',
        count: Math.floor(Math.random() * 1000000)
      },
      {
        source: 'Homepage',
        count: Math.floor(Math.random() * 1000000)
      },
      {
        source: 'Snippet',
        count: Math.floor(Math.random() * 1000000)
      }
    ];

    this.renderSourceData(dummySourceData);
    this.renderCountryData(dummySourceData);
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
      .enter()
      .append('g')
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
    var width = 340,
      height = 340,
      radius = 170,
      color = d3.scale.category20b();

    var chart = d3.select('#chart-graphic-country')
      .data([data])
      .attr('width', width)
      .attr('height', height)
      .append('svg:g')
      .attr('transform', 'translate(' + radius + ',' + radius + ')');

    var arc = d3.svg.arc()
      .outerRadius(radius);

    var pie = d3.layout.pie()
      .value(function(d) { return d.count; });

    var arcs = chart.selectAll('g.slice')
      .data(pie)
      .enter()
      .append('svg:g')
      .attr('class', 'slice');

    arcs.append('svg:path')
      .attr('fill', function(d, i) { return color(i); } )
      .attr('d', arc);

    arcs.append('svg:text')
      .attr('transform', function(d) {
        d.innerRadius = 50;
        d.outerRadius = 100;
        return 'translate(' + arc.centroid(d) + ')';
      })
      .attr('text-anchor', 'middle')
      .text(function(d, i) { return data[i].source; });
  }
};

CHARTS.init();
