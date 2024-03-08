async render() {
  await getScriptPromisify(
      "https://cdn.staticfile.org/echarts/5.3.0/echarts.min.js"
  );

  if (!this._myDataSource || this._myDataSource.state !== "success") {
      return;
  }

  const measures = this._myDataSource.metadata.feeds.measures.values;
  const data = measures.map((measure) => {
      return {
          name: measure.label,
          value: this._myDataSource.data[0][measure.id].raw // Assuming all measures have the same number of data points
      };
  });

  const myChart = echarts.init(this._root, "wight");
  const option = {
      color: ['#D2EFFF', '#A6E0FF', '#89D1FF', '#1990FF', '#0057D2'],
      title: {
          text: "",
      },
      tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c}%",
      },
      toolbox: {
          feature: {
              dataView: { readOnly: false },
              restore: {},
              saveAsImage: {},
          },
      },
      legend: {
          data: measures.map(measure => measure.label),
      },
      series: [
          {
              name: "Funnel",
              type: "funnel",
              left: "10%",
              top: 60,
              bottom: 60,
              width: "80%",
              min: 0,
              max: 100,
              minSize: "0%",
              maxSize: "100%",
              sort: "descending",
              gap: 2,
              label: {
                  show: true,
                  position: "inside",
              },
              labelLine: {
                  length: 10,
                  lineStyle: {
                      width: 1,
                      type: "solid",
                  },
              },
              itemStyle: {
                  borderColor: "#fff",
                  borderWidth: 4,
              },
              emphasis: {
                  label: {
                      fontSize: 20,
                  },
              },
              data,
          },
      ],
  };
  myChart.setOption(option);
}
