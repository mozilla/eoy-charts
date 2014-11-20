var CHARTS = {
  init: function () {
    this.fetchData('http://transformtogeckoboard.herokuapp.com/eoy/donationsbysource', function (data) {
      this.renderSourceData(data);
    });

    this.fetchData('http://transformtogeckoboard.herokuapp.com/eoy/donationsbycountry', function (data) {
      this.renderCountryData(data);
    });
  },
  fetchData: function (url, callback) {
    var request = new XMLHttpRequest();
    var self = this;

    request.open('GET', url, true);

    request.onload = function() {
      if (this.status >= 200 && this.status < 400){
        var data = JSON.parse(this.response);
        callback.call(self, data);
      } else {
        console.error('Data request failed');
      }
    };

    request.onerror = function() {
      console.error('Data request failed');
    };

    request.send();
  },
  renderSourceData: function (data) {
    var width = 340,
      barHeight = 27;

    var colorScale = d3.scale.category20b();

    var x = d3.scale.linear()
      .domain([0, d3.max(data.map(function (item) {return item.eoyDonations}))])
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
      .attr('width', function(d) { return x(parseFloat(d.eoyDonations), 10) })
      .attr('height', barHeight - 2)
      .attr('fill', function(d, i) { return colorScale(i) });

    bar.append('text')
      .attr('x', function(d) { return x(d.eoyDonations) - 10})
      .attr('y', barHeight / 2)
      .attr('dy', '.35em')
      .text(function(d) { return d.country; });
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
      .value(function(d) { return parseFloat(d.eoyDonations, 10); });

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
      .text(function(d, i) { return data[i].country; });
  }
};

CHARTS.init();
