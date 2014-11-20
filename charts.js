var CHARTS = {
  colors: [
    '#2F5899',
    '#1D6FB7',
    '#19B7E4',
    '#61C3B0',
    '#89C764',
    '#FCDD3F',
    '#FAAC3F',
    '#F48032',
    '#EB5543',
    '#F06DA6',
    '#A5509C',
    '#7C3B79'
  ],
  addCommas: function (target) {
    target += '';

    var x = target.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;

    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    return x1 + x2;
  },
  init: function () {
    this.fetchData('http://transformtogeckoboard.herokuapp.com/eoy/donationsbycountry', function (data) {
      this.renderPieChart('#chart-country-data', this.modelData(data));
    });

    this.fetchData('http://transformtogeckoboard.herokuapp.com/eoy/donationsbysource', function (data) {
      this.renderBarChart('#chart-source-data', this.modelData(data));
    });
  },
  modelData: function (data) {
    var modeledData = [];

    data.forEach(function (item, index, array) {
      modeledData.push({
        country: item.country,
        eoyDonations: Math.round(Math.random() * 1000000) // TEMP : Waiting for realistic values from API
      });
    });

    modeledData = modeledData.sort(function (a, b) {
      return b.eoyDonations - a.eoyDonations;
    });

    modeledData = modeledData.slice(0,8);
    modeledData[0].eoyDonations = Math.round(modeledData[0].eoyDonations * (Math.random() * 3 + 1));

    return modeledData;
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
  renderBarChart: function (target, data) {
    var self = this,
      width = 340,
      barHeight = 27;

    var x = d3.scale.linear()
      .domain([0, d3.max(data.map(function (item) {return item.eoyDonations}))])
      .range([0, width]);

    var chart = d3.select(target + ' svg')
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
      .attr('fill', function(d, i) { return self.colors[i] });

    bar.append('text')
      .attr('x', function(d) { return x(d.eoyDonations) - 10})
      .attr('y', barHeight / 2)
      .attr('dy', '.35em')
      .text(function(d) { return d.country; });
  },
  renderPieChart: function (target, data) {
    var width = 340,
      height = 340,
      radius = 170,
      elTarget = document.querySelector(target),
      self = this;

    var chart = d3.select(target + ' svg')
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
      .attr('fill', function(d, i) { return self.colors[i]; } )
      .attr('d', arc);

    // Construct Key

    var keyHTML = '<div class="pie-chart-key">';

    data.forEach(function (item, index, array) {
      keyHTML += '<p><b style="color:' + self.colors[index] + '">&#9724;</b> ' + item.country + '<br/><span>$' + self.addCommas(item.eoyDonations) + '</span></p>';
    });

    elTarget.innerHTML = elTarget.innerHTML + keyHTML + '</div>';
  }
};

CHARTS.init();
