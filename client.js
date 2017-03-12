(function () {

  var timeout = null;
  var chartAreaOptions = {
    bottom: 50,
    top: 50,
    left: 70,
    right: 28
  };

  function loadScript(src) {
    var element = document.createElement('script');

    element.src = src;
    document.body.appendChild(element);
  }

  function renderCurrentStoryTypeRatioChart() {
    var element = document.getElementById('current-story-type-ratio');
    var chart = new window.google.visualization.PieChart(element);
    var mostRecentRatio = window.Data.StoryTypeRatios[window.Data.StoryTypeRatios.length - 1];
    var data = new window.google.visualization.arrayToDataTable([
      ['Story Type', 'Current Ratio'],
      ['Features', mostRecentRatio[1]],
      ['Bugs', mostRecentRatio[2]],
      ['Chores', mostRecentRatio[3]]
    ]);

    var options = {
      title: 'Current Story Type Ratio',
      titleTextStyle: { fontSize: 16 },
      chartArea: chartAreaOptions,
      pieHole: 0.4
    };

    chart.draw(data, options);
  }

  function renderEstimateRatiosChart() {
    var element = document.getElementById('estimate-ratios');
    var chart = new window.google.visualization.BarChart(element);
    var a = [['Story Estimate', 'Story Count']];

    for (var key in window.Data.EstimateChart) {
      if (window.Data.EstimateChart.hasOwnProperty(key)) {
        a.push([key, window.Data.EstimateChart[key]]);
      }
    }

    var data = new window.google.visualization.arrayToDataTable(a);

    var options = {
      title: 'Story Estimate Distribution',
      titleTextStyle: { fontSize: 16 },
      chartArea: chartAreaOptions,
      legend: 'none'
    };

    chart.draw(data, options);
  }

  function renderStoryTypeRatioChart() {
    var element = document.getElementById('story-type-ratios');
    var chart = new window.google.visualization.AreaChart(element);
    var data = new window.google.visualization.DataTable();

    data.addColumn('date', 'Date');
    data.addColumn('number', 'Features');
    data.addColumn('number', 'Bugs');
    data.addColumn('number', 'Chores');
    data.addRows(window.Data.StoryTypeRatios);

    var options = {
      title: 'Story Type Ratios',
      isStacked: 'percent',
      focusTarget: 'category',
      titleTextStyle: { fontSize: 16 },
      legend: 'none',
      chartArea: chartAreaOptions,
      vAxis: {
        format: '#%'
      }
    };

    chart.draw(data, options);
  }

  function renderStoryTypeChart() {
    var element = document.getElementById('story-type-data');
    var chart = new window.google.visualization.AreaChart(element);
    var data = new window.google.visualization.DataTable();

    data.addColumn('date', 'Date');
    data.addColumn('number', 'Features');
    data.addColumn('number', 'Bugs');
    data.addColumn('number', 'Chores');
    data.addRows(window.Data.StoryTypeData);

    var options = {
      title: 'Completed Stories by Story Type',
      titleTextStyle: { fontSize: 16 },
      isStacked: true,
      chartArea: chartAreaOptions,
      focusTarget: 'category',
      legend: 'none'
    };

    chart.draw(data, options);
  }

  function renderMonthlyVelocityChart() {
    var element = document.getElementById('monthly-velocity-chart');
    var chart = new window.google.visualization.ColumnChart(element);
    var data = new window.google.visualization.DataTable();

    data.addColumn('date', 'Date');
    data.addColumn('number', 'Stories');
    data.addRows(window.Data.MonthlyVelocityChart.slice(-12));

    var options = {
      title: 'Monthly Velocity, Last 12 Months',
      titleTextStyle: { fontSize: 16 },
      focusTarget: 'category',
      isStacked: true,
      chartArea: chartAreaOptions,
      trendlines: {
        0: {
          type: 'exponential'
        }
      },
      legend: 'none'
    };

    chart.draw(data, options);
  }

  function renderCycleTimeChart() {
    var element = document.getElementById('cycle-time-chart');
    var data = new window.google.visualization.DataTable();
    var chart = new window.google.visualization.LineChart(element);

    data.addColumn('date', 'Date');
    data.addColumn('number', 'Max');
    data.addColumn('number', 'Average');
    data.addColumn('number', 'Min');
    data.addRows(window.Data.CycleTimeChart.slice(-12));

    var options = {
      title: 'Project Cycle Time in Days, Last 12 Months',
      titleTextStyle: { fontSize: 16 },
      focusTarget: 'category',
      chartArea: chartAreaOptions,
      legend: 'none'
    };

    chart.draw(data, options);
  }

  function renderProjectSelect() {
    var element = document.getElementById('project-selector');
    var html = '<option>Select Project...</option>';
    window.ClubhouseProjects.forEach(function (project) {
      html += '<option value="' + project.id + '">' + project.name + '</option>';
    });

    element.innerHTML = html;
    window.scrollTo(0, 0);
  }

  function getSelectedProjectID() {
    var element = document.getElementById('project-selector');
    return element.options[element.selectedIndex].value;
  }

  window.onProjectSelect = function () {
    var id = getSelectedProjectID();
    window.Data = null;
    loadScript('data/project-' + id + '.js');
    clearTimeout(timeout);
    renderCharts();
  };

  function renderNoDataForProject() {
    var element = document.getElementById('no-chart-found');
    element.innerHTML = 'No data found for this project! Run <code>node fetch.js ' + getSelectedProjectID() + '</code> in your terminal to generate the data.';
    element.style.display = 'block';

    document.getElementById('chart-container').style.display = 'none';
  }

  function hideNoDataForProject() {
    var element = document.getElementById('no-chart-found');
    element.innerHTML = '';
    element.style.display = 'none';

    document.getElementById('chart-container').style.display = 'block';
  }

  function renderLastFetched() {
    var element = document.getElementById('last-fetched');
    element.innerHTML = 'This data was fetched on <strong>' + window.Data.LastFetched + '</strong>.';
  }

  function renderCharts(counter) {
    if (counter) {
      counter += 1;
    } else {
      counter = 1;
    }

    if (counter > 5) {
      renderNoDataForProject();
      return false;
    }

    if (!window.Data) {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        renderCharts(counter);
      }, 100);
      return false;
    }

    hideNoDataForProject();
    renderLastFetched();

    renderCurrentStoryTypeRatioChart();
    renderStoryTypeRatioChart();
    renderStoryTypeChart();
    renderMonthlyVelocityChart();
    renderEstimateRatiosChart();
    renderCycleTimeChart();
  }

  function initGoogleLibrary() {
    window.google.charts.load('current', { packages: ['corechart', 'line'] });
  }

  function init() {
    initGoogleLibrary();
    renderProjectSelect();
  }

  init();

}());
