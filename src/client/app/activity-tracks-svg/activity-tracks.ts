/**
 * Explore the topic of downsampling?
 */

import { LitElement, css, html, svg } from 'lit';
import { property } from 'lit/decorators.js';

class ActivityTracks extends LitElement {
  @property({ type: Array })
  data: {
    value: number;
    count: number;
    totalCount: number;
  }[][] = [];

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


  render() {
    if (!this.data.length) {
      return null;
    }

    const { width } = this.getBoundingClientRect();
    const paddingAdjustment = 22; // 10px padding on both sides + 1px border on either side

    const rowsData = this.data;

    performance.mark('rows-started');

    const rowSvgs = rowsData.map((rowData) => this.renderRow({
      data: rowData,
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
    value = value * 10;
    const color = `color-mix(in lch, black ${value}%, white)`;

    return color;
  }

}

customElements.define('activity-tracks-svg', ActivityTracks);
