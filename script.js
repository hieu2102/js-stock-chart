function setNonTrendingIndicators(chart, mapping, valueMapping, volumeMapping) {
    var stockPricePlot = chart.plot(0),
        rsiPlot = chart.plot(1),
        volumePlot = chart.plot(2);

    // plot volume
    volumePlot.height('30%');
    volumePlot
        .yAxis()
        .labels()
        .format('{%Value}{scale:(1000000)(1000)|(m)(k)}');

    // create and setup volume+MA indicator
    var volumeMaIndicator = volumePlot.volumeMa(
            volumeMapping,
            20,
            'sma',
            'column',
            'splineArea'
        ),
        maSeries = volumeMaIndicator.maSeries();
    maSeries.stroke('red');
    maSeries.fill('red .2');
    volumeMaIndicator.volumeSeries('column');
    // end plot volume
    // plot bollinger
    var bbands = stockPricePlot.bbands(mapping, 20, 2, "spline", "spline", "spline");
    bbands.upperSeries().stroke('#bf360c');
    bbands.middleSeries().stroke('#ff6600');
    bbands.lowerSeries().stroke('#bf360c');
    bbands.rangeSeries().fill('#ffd54f 0.2');
    // end plot bollinger
    // plot rsi
    var rsi14 = rsiPlot.rsi(mapping, 14).series();
    rsi14.stroke('#bf360c');
    // end plot rsi
    // set bounds 
    // x, y, width, height
    rsiPlot.bounds(0, 0, "100%", "20%");

}

function setTrendingIndicators(chart, priceMapping, valueMapping, volumeMapping) {
    var stockPricePlot = chart.plot(0),
        adxPlot = chart.plot(1),
        volumePlot = chart.plot(2);
    // plot volume
    volumePlot.height('30%');
    volumePlot
        .yAxis()
        .labels()
        .format('{%Value}{scale:(1000000)(1000)|(m)(k)}');

    // create and setup volume+MA indicator
    var volumeMaIndicator = volumePlot.volumeMa(
            volumeMapping,
            20,
            'sma',
            'column',
            'splineArea'
        ),
        maSeries = volumeMaIndicator.maSeries();
    maSeries.stroke('red');
    maSeries.fill('red .2');
    volumeMaIndicator.volumeSeries('column');
    // end plot volume
    // plot adx 
    var dmi = adxPlot.dmi(mapping, 14, 14, true, "line", "line", "line");
    // end plot adx
    // plot sma
    sma10 = stockPricePlot.sma(priceMapping, 10).series();
    sma10.stroke('#bf360c');
    sma20 = stockPricePlot.sma(priceMapping, 20).series();
    sma20.stroke('#7700ff');
    sma50 = stockPricePlot.sma(priceMapping, 50).series();
    sma50.stroke('#0d5c1d');
    // end plot sma

}

function createContainer(id) {
    var container = document.createElement('div');
    container.setAttribute("id", id)
    container.className = 'chartContainer'
    document.body.appendChild(container);
}

function createChart(ticker, type) {
    // getData
    var url = `http://localhost:8080/tickerDdata/${ticker}`;
    fetch(url).then(response => {
        var data = response.data,
            dataTable = anychart.data.table();
        dataTable.addData(data);
        // mapping data
        var priceMapping = database.mapAs({
                open: 1,
                high: 2,
                low: 3,
                close: 4
            }),
            valueMapping = dataTable.mapAs({
                value: 5
            }),
            volumeMapping = dataTable.mapAs({
                value: 5
            });

        var chart = anychart.stock();
        chart.plot(0).candlestick(priceMapping);
        switch (type) {
            case 'trending':
                setTrendingIndicators(chart, priceMapping, valueMapping, volumeMapping);
                break;
            case 'non-trending':
                setNonTrendingIndicators(chart, priceMapping, valueMapping, volumeMapping);
                break;
        }
        createContainer(`${type}_${ticker}`);
        chart.container(`${type}_${ticker}`);
        chart.title(`${type} Chart: ${ticker}`);
        chart.draw();
    })
}

anychart.onDocumentReady(function() {
    var dataTable = anychart.data.table();
    dataTable.addData(get_msft_daily_short_data());
    var ohlcMapping = dataTable.mapAs({
        open: 1,
        high: 2,
        low: 3,
        close: 4
    });

    // map data for scroller and volume series
    var valueMapping = dataTable.mapAs({
        value: 5
    });
    var volumeMapping = dataTable.mapAs({
        volume: 5
    });

    // create stock chart
    var chart = anychart.stock();
    chart.plot(0).candlestick(ohlcMapping);
    setNonTrendingIndicators(chart, ohlcMapping, valueMapping, volumeMapping)

    // var container = document.createElement('div');
    createContainer('test')
    // chart.container('container');
    chart.container('test')
    chart.title("EUR USD Historical Trade Data");
    chart.selectRange('2016-04-01', '2016-06-12')

    // draw the chart
    chart.draw();



});