/**
 * Explore the topic of downsampling?
 */

import { LitElement, css, html, svg } from 'lit';
import { state } from 'lit/decorators.js';

import { compressData, approximateData } from './subsampleData';

class ActivityTracks extends LitElement {
  @state()
  data: number[] = [];

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

    svg {
      display: block;
    }

    svg + svg {
      margin-top: 2px;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.fetchData();
  }

  fetchData = async () => {
    const url = 'http://localhost:3000/';
    const response = await fetch(url);  
    const data: {data: number[]} = await response.json();
    this.data = data.data;
  };

  render() {
    if (!this.data.length) {
      return null;
    }

    const { width } = this.getBoundingClientRect();
    const paddingAdjustment = 22; // 10px padding on both sides + 1px border on either side

    const approximatedData = approximateData(this.data);
    const rowsData = compressData(approximatedData);

    performance.mark('rows-started');

    const rowSvgs = [...Array(50)].map(() => this.renderRow({
      data: rowsData,
      width: width - paddingAdjustment
    }));

    performance.mark('rows-finished');
    performance.measure('rows-rendering', 'rows-started', 'rows-finished');

    return html`
      <div>
        ${rowSvgs}
      </div>
    `;
  }

  renderRow = ({ width: totalWidth, data }: {
    width: number;
    data: { value: number; count: number; totalCount: number; }[]
  }) => {
    let currentRectX = 0;
    const svgRects: ReturnType<typeof svg>[] = [];

    for (const item of data) {
      const rectWidth = Math.max(1, Math.round(item.count / item.totalCount * totalWidth));
      let x = currentRectX;
      currentRectX += rectWidth; // for the next rectangle

      if (item.value) {
        const rectColor = this.getRectFill(item.value);

        const rect = svg`
          <rect
            height="5"
            stroke-width="0"
            width="${rectWidth}"
            x="${currentRectX}"
            fill="${rectColor}"></rect>
        `;

        svgRects.push(rect);
      }
    }

    return html`
      <svg viewBox="0 0 ${totalWidth} 5">
        ${svgRects}
      </svg>
    `;
  }

  getRectFill(value: number) {
    const color = `color-mix(in lch, grey ${value}%, white)`;

    return color;
  }

}

customElements.define('activity-tracks', ActivityTracks);
