// custom-sap-funnel.js
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
      this._selectedMeasure = "";
      this._props = {};
      this.render();
    }

    onCustomWidgetResize(width, height) {
      this.render();
    }

    onCustomWidgetBeforeUpdate(changedProperties) {
      if ("selectedMeasure" in changedProperties) {
        this.selectedMeasure = changedProperties["selectedMeasure"];
      }
    }

    onCustomWidgetAfterUpdate(changedProperties) {

    }

    getSelectedMeasure() {
      return this._selectedMeasure;
    }

    setSelectedMeasure(newSelectedMeasure) {
      this._selectedMeasure = newSelectedMeasure;
      this.dispatchEvent(new CustomEvent("propertiesChanged", {
        detail: {
          properties: {
            selectedMeasure: this._selectedMeasure
          }
        }
      }));
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

      const abs_values = [];
      const rel_values = [];
      const color_measures = [];
      const dataset = [];
      const data = this._myDataSource.data.map((data) => {
        for (let i = 0; i < this._myDataSource.metadata.feeds.measures.values.length; i++) {
          const measuresKey = `measures_${i}`;
          const measure = this._myDataSource.metadata.mainStructureMembers[measuresKey];
          const measureValue = this._myDataSource.metadata.feeds.measures.values[i];

          abs_values.push(Number(data[measureValue].raw));

          if (i === 0) {
            rel_values.push(100);
          } else {
            rel_values.push(
              ((Number(data[measureValue].raw)) / (Number(data[this._myDataSource.metadata.feeds.measures.values[i-1]].raw)) * 100).toFixed(2)
            );
          }

          switch(i) {
            case 0:
              color_measures.push('#1E8449');
              break;
            case 1:
              color_measures.push('#1E8449');
              break;
            case 2:
              if (rel_values[i] < 95) {
                color_measures.push('#C0392B');
              } else {
                color_measures.push('#1E8449');
              }
              break;
            case 3:
              if (rel_values[i] < 99) {
                color_measures.push('#C0392B');
              } else {
                color_measures.push('#1E8449');
              }
              break;
            case 4:
              if (rel_values[i] < 94) {
                color_measures.push('#C0392B');
              } else {
                color_measures.push('#1E8449');
              }
              break;
            case 5:
              if (rel_values[i] < 98) {
                color_measures.push('#C0392B');
              } else {
                color_measures.push('#1E8449');
              }
              break;
            default:
              break;
          }

          dataset.push({
            value: Number(data[measureValue].raw),
            name: `${measure.label} : ${abs_values[i]} (${rel_values[i]}%)`
          });
        }
        return dataset;
      });

      const myChart = echarts.init(this._root, "wight");
      const option = {
        color: color_measures,
        title: {
          text: "",
        },
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            const dataIndex = params.dataIndex;
            const absValue = abs_values[dataIndex];
            const relValue = rel_values[dataIndex];
            const delta_abs = dataIndex > 0 ? absValue - abs_values[dataIndex - 1] : 0;
          
            return `▲ : ${delta_abs} (${relValue}%)`;
          },
        },
        toolbox: {
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {},
          },
        },
        legend: {
          show: true,
          formatter: function(name) {
            return name.split(':')[0].trim();
          }
        },
        series: [
          {
            name: "Funnel",
            type: "funnel",
            left: "10%",
            top: 60,
            bottom: 60,
            width: "80%",
            minSize: "0%",
            maxSize: "100%",
            gap: 5,
            sort: 'none',
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
              borderColor: "#515A5A",
              borderWidth: 0.5,
            },
            emphasis: {
              label: {
                fontSize: 20,
              },
            },
            data: dataset,
          },
        ],
      };
      myChart.setOption(option);

      myChart.on("click", (params) => {
        this.setSelectedMeasure(params.name.split(":")[0].trim());
        this.dispatchEvent(new Event('onClick'));
      });
    }
  }

  customElements.define("custom-sap-funnel", Funnel);
})();