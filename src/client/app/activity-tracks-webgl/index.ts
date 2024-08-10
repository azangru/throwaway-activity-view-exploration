import { LitElement, css, html, type PropertyValues } from 'lit';
import { state } from 'lit/decorators.js';

import draw from './draw';
import { subsampleData, compressData, approximateData } from '../subsampleData';

class ActivityTracks extends LitElement {
  canvas!: HTMLCanvasElement;

  @state()
  data: {values: number[]}[] = [];

  static styles = css`
    :host {
      display: block;
      min-height: 100px;
      max-width: 1100px;
      border: 1px dotted black;
      padding: 10px;
    }

    * {
      box-sizing: border-box;
    }

    canvas {
      width: 100%;
      height: 100%;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
  }

  firstUpdated() {
    this.fetchData();
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    // only need to check changed properties for an expensive computation.
    if (changedProperties.has('data') && this.data.length) {
      const { width } = this.getBoundingClientRect();
      const paddingAdjustment = 22; // 10px padding on both sides + 1px border on either side
  
      const rowsData = this.prepareDataForRendering(this.data, width - paddingAdjustment);

      this.draw(rowsData);
    }
  }

  fetchData = async () => {
    const url = 'http://localhost:3000/';
    const response = await fetch(url);
    const data: {values: number[]}[] = await response.json();
    this.data = data;
  }

  render() {
    return html`
      <canvas></canvas>
    `;
  }

  prepareDataForRendering(data: typeof this.data, width: number) {
    return data
      .map(({ values }) => subsampleData(values, width))
      .map((values) => compressData(values));
  }

  draw(data: { value: number; count: number; totalCount: number }[][]) {
    const canvas = this.shadowRoot.querySelector('canvas');

    const canvasBoundingRect = canvas.getBoundingClientRect();
    const canvasWdith = canvasBoundingRect.width * devicePixelRatio;
    const canvasHeight = canvasBoundingRect.height * devicePixelRatio;
    canvas.width = canvasWdith;
    canvas.height = canvasHeight;

    this.canvas = canvas;

    draw({ canvas: this.canvas, data });
  }

}

customElements.define('activity-tracks', ActivityTracks);
