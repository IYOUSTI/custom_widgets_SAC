var getScriptPromisify = (src) => {
  return new Promise((resolve) => {
      $.getScript(src, resolve);
  });
};

(function () {
  const prepared = document.createElement("template");
  prepared.innerHTML = `
      <style>
      </style>
      <div id="root" style="width: 100%; height: 100%;">
      </div>
  `;
  class Funnel extends HTMLElement {
      constructor() {
          super();

          this._shadowRoot = this.attachShadow({ mode: "open" });
          this._shadowRoot.appendChild(prepared.content.cloneNode(true));

          this._root = this._shadowRoot.getElementById("root");

          this._props = {};

          this.render();
      }

      onCustomWidgetResize(width, height) {
          this.render();
      }

      set myDataSource(dataBinding) {
          this._myDataSource = dataBinding;
          this.render();
      }

      async render() {
          await getScriptPromisify(
              "https://cdn.staticfile.org/echarts/5.3.0/echarts.min.js"
          );

          if (!this._myDataSource || this._myDataSource.state !== "success") {
              return;
          }

          const data = this._myDataSource.data.map((data) => {
              const dataset = [];
              console.log('datasource');
              console.log(this._myDataSource.metadata.mainStructureMembers);
              for (let i = 0; i < this._myDataSource.metadata.feeds.measures.values.length; i++) {
                console.log('values');
                console.log(data[this._myDataSource.metadata.feeds.measures.values[i]]);
                console.log('labels');
                console.log(data[this._myDataSource.metadata.mainStructureMembers]);
                  dataset.push({
                      value: data[this._myDataSource.metadata.feeds.measures.values[i]].raw,
                      name: data[this._myDataSource.metadata.mainStructureMembers[i]].label
                  });
              }
              console.log('dataset');
              console.log(dataset);
              console.log('datasource');
              console.log(this._myDataSource);
              return dataset;
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
                  data: ["Show", "Click", "Visit", "Inquiry", "Order"],
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
  }

  customElements.define("custom-sap-funnel", Funnel);
})();
