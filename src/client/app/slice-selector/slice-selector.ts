import { LitElement, css, html, type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';


// Initial slice 5:28,627,474-28,727,474

/**
 * See examples:
 * - https://codepen.io/alexpg96/pen/xxrBgbP
 * - https://www.thecoderashok.com/blog/double-range-slider-with-min-max-value
 */

class SliceSelector extends LitElement {
  @property({ type: 'number' })
  min: number = 0;

  @property({ type: 'number' })
  max: number = 100;

  static styles = css`
    :host {
      display: block;
      position: relative;
      max-width: 1100px;
      height: 5px;
    }

    input {
      position: absolute;
      left: 0;
      right: 0;
      background: none;
      pointer-events: none;
      -webkit-appearance: none;
      -moz-appearance: none;
    }

    input::-webkit-slider-runnable-track {
      -webkit-appearance: none;
      height: 3px;
      background: blue;
    }

    input::-webkit-slider-thumb {
      --diameter: 20px;
      height: var(--diameter);
      width: var(--diameter);
      border-radius: 50%;
      background-color: #3264fe;
      pointer-events: auto;
      -webkit-appearance: none;
      cursor: pointer;
      margin-bottom: 1px;
      top: 50%;
      transform: translateY(-50%);
      position: relative;
      z-index:1000;
    }
  `;

  handleChange = (event: InputEvent) => {
    const lowerBoundInput = this.shadowRoot.querySelector('#lower-bound') as HTMLInputElement;
    const upperBoundInput = this.shadowRoot.querySelector('#upper-bound') as HTMLInputElement;

    const changeEvent = new CustomEvent('change', {
      detail: {
        low: lowerBoundInput.value,
        hi: upperBoundInput.value,
      }
    });

    this.dispatchEvent(changeEvent);
  }

  render() {
    return html`
      <input id="lower-bound" type="range" @change="${this.handleChange}" min="${this.min}" max="${this.max}" value="${this.min}"  />
      <input id="upper-bound" type="range" @change="${this.handleChange}" min="${this.min}" max="${this.max}" value="${this.max}" />
    `;
  }

}


customElements.define('slice-selector', SliceSelector);
