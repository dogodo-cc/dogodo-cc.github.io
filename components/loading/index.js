class Loading extends HTMLElement {
  constructor() {
    super();

    // Create a shadow root
    const shadow = this.attachShadow({ mode: 'closed' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'hi-loading');
    wrapper.innerHTML = '<i></i><i></i><i></i>';

    const {color = '#333333', margin = 4, size = 10} = this.dataset;

    // Create some CSS to apply to the shadow dom
    const style = document.createElement('style');

    style.textContent = `
      @keyframes bouncedelay {
        0%, 80%, 100% {
            transform: scale(0.0);
        }
        40% {
            transform: scale(1.0);
        }
      }
      .hi-loading {
        text-align: center;
        font-size: 0;
      }
      .hi-loading > i {
        all: unset;
        display: inline-block;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        margin: 0 ${margin}px;
        border-radius: 50%;
        animation: bouncedelay 1.4s infinite ease-in-out;
        animation-fill-mode: both;
      }
      .hi-loading > i:nth-child(1) {
        animation-delay: -0.32s;
      }
      .hi-loading > i:nth-child(2) {
        animation-delay: -0.16s;
      }
    `;

    // Attach the created elements to the shadow dom
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
  }
}

// Define the new element
customElements.define('hi-loading', Loading);
