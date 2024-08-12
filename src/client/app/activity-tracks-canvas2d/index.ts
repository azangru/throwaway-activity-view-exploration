import { LitElement, css, html, type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

import draw, { ROW_HEIGHT } from './draw';

class ActivityTracks extends LitElement {
  canvas!: HTMLCanvasElement;

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

    canvas {
      width: 100%;
      height: 100%;
    }
  `;

  updated(changedProperties: PropertyValues<this>) {
    // only need to check changed properties for an expensive computation.
    if (changedProperties.has('data') && this.data.length) {
      this.drawCanvas(this.data);
    }
  }

  render() {
    return html`
      <canvas></canvas>
    `;
  }

  drawCanvas = (data: { value: number; count: number; totalCount: number }[][]) => {
    const canvas = this.shadowRoot.querySelector('canvas');

    const canvasBoundingRect = canvas.getBoundingClientRect();
    const canvasWdith = canvasBoundingRect.width * devicePixelRatio;
    const canvasHeight = ROW_HEIGHT * data.length;
    canvas.width = canvasWdith;
    canvas.height = canvasHeight;

    this.canvas = canvas;

    draw({ canvas: this.canvas, data });
  }

}

customElements.define('activity-tracks-canvas', ActivityTracks);
