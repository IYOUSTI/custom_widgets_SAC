(function () {
  const template = document.createElement("template");
  template.innerHTML = `
    <style>
    </style>
    <div id="root" style="width: 100%; height: 100%;">
    <input type="text" id="myInput" onkeyup="searchMembers()" placeholder="Search...">
    </div>
  `;
  class Search extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(prepared.content.cloneNode(true));
      this._root = this._shadowRoot.getElementById("root");

      this.addEventListener("")

      this._props = {};
      this.render();
    }

    async render() {
      function searchMembers() {
        var input, filter, ul, li, a, i, txtValue;
        input = document.getElementById('myInput');
        filter = input.value.toUpperCase();
        console.log(filter);
      }
    }
  }

  customElements.define("custom-sap-search", Search);
})();