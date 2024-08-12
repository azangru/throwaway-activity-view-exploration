import { LitElement, css, html } from 'lit';
import { state } from 'lit/decorators.js';

import { subsampleData, compressData } from '../subsampleData';

import '../slice-selector/slice-selector';
import '../activity-tracks-svg/activity-tracks';
import '../activity-tracks-canvas2d/index';
import '../activity-tracks-webgl/index';

// Initial slice 5:28,627,474-28,727,474

class RegulationView extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 1100px;
    }

    .top-nav ul {
      display: inline-flex;
      column-gap: 0.6rem;
    }

    .top-nav li {
      display: inline-block;
      list-style: none;
    }

    slice-selector {
      margin-bottom: 1rem;
    }
  `;

  @state()
  data: {values: number[]}[] = [];

  @state()
  processedData: {
    value: number;
    count: number;
    totalCount: number;
  }[][] = [];

  handleChange = (event: CustomEvent) => {
    const eventData = event.detail;
    const low: string = eventData.low;
    const hi: string = eventData.hi;

    this.processData(
      this.data,
      {
        start: parseInt(low),
        end: parseInt(hi)
      }
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  fetchData = async () => {
    const url = 'http://localhost:3000/';
    const response = await fetch(url);
    const data: {values: number[]}[] = await response.json();
    this.data = data;

    this.processData(this.data);
  }

  processData = (data: typeof this.data, slice?: { start: number, end: number }) => {
    const width = this.getWidth();

    if (slice) {
      const { start, end } = slice;
      data = data.map(row => ({
        ...row,
        values: row.values.slice(start, end)
      }));
    }

    this.processedData = data
      .map(({ values }) => subsampleData(values, width))
      .map((values) => compressData(values));
  }

  getWidth = () => {
    const { pathname } = location;
    const isUsingCanvas = pathname.endsWith('canvas-2d') || pathname.endsWith('webgl')

    const { width } = this.getBoundingClientRect();
    const paddingAdjustment = 22; // 10px padding on both sides + 1px border on either side

    if (!isUsingCanvas) {
      return width - paddingAdjustment;
    } else {
      const canvasDomWidth = width - paddingAdjustment;
      const canvasAdjustedWidth = canvasDomWidth * devicePixelRatio;
      return canvasAdjustedWidth;
    }

  };

  render() {
    if (this.isPageWithImage()) {
      return html`
        ${this.renderTopNav()}
        ${this.renderSliceSelector()}
        ${this.renderActivityTracks()}
      `;
    } else {
      return html`
        <h1>
          Regulatory data rendering test
        </h1>
        <div>
          Mouse genome; slice 5:28,627,474-28,727,474 (100,000kb long)
        </div>
        ${this.renderMainNav()}
      `;
    }
  }

  isPageWithImage() {
    const { pathname } = location;

    return ['svg', 'canvas-2d', 'webgl'].some(path => pathname.endsWith(path));
  }
 
  renderActivityTracks() {
    if (!this.processedData.length) {
      return null;
    }

    const { pathname } = location;
    if (pathname.endsWith('svg')) {
      return html`
        <activity-tracks-svg .data="${this.processedData}"></activity-tracks-svg>
      `;
    } else if (pathname.endsWith('canvas-2d')) {
      return html`
        <activity-tracks-canvas .data="${this.processedData}"></activity-tracks-canvas>
      `;
    } else if (pathname.endsWith('webgl')) {
      return html`
        <activity-tracks-webgl .data="${this.processedData}"></activity-tracks-webgl>
      `;
    }
  }

  renderSliceSelector() {
    if (!this.data.length) {
      return null;
    }

    const rowDataLength = this.data[0].values.length;

    // make the slice selector select the start and the end indices into the data
    return html`
      <slice-selector @change="${this.handleChange}" min="0" max="${rowDataLength - 1}"></slice-selector>
    `;
  }

  renderTopNav() {
    return html`
      <nav class="top-nav">
        <span>
          Renderer
        </span>
        ${this.renderNavLinks()}
      </nav>
    `;
  }

  renderMainNav() {
    return html`
      <nav class="main-nav">
        <p>
          Choose a renderer
        </p>
        ${this.renderNavLinks()}
      </nav>
    `;
  }

  renderNavLinks() {
    return html`
      <ul>
        <li>
          <a href="/svg">svg</a>
        </li>
        <li>
          <a href="/canvas-2d">canvas 2d</a>
        </li>
        <li>
          <a href="/webgl">webgl</a>
        </li>
      </ul>
    `;
  }

  renderNavigation() {
    return html`
      <nav>
        <span>
          Choose a renderer
        </span>



      </nav>
    `;
  }

}

customElements.define('regulation-view', RegulationView);
