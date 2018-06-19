
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

import './audio-functions.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class audioDelay extends PolymerElement {
  static get template() {
    return html`
        <style include="shared-styles-typeG">
            :host { width: 179px; margin-right: 4px; }
        </style>
        <article>
            <label for="range">[[elemTitle]]
                <span>[[type]]</span>
                <button on-click="removeCall"> x </button>
            </label>
            <div class="open divtitle-area" open\$="[[open]]">
                <section id="title" class="open" open\$="[[open]]">
                    <paper-input id="titleInput" class="diferent" label="new title" title="new title" value="{{elemTitle}}">
                    </paper-input>
                    <paper-button on-click="submit" raised="">aplly title </paper-button>
                </section>
            </div>
            <section class="show" show\$="[[show]]">
                <audio-functions id="functions" context-node="[[contextNode]]" agent-class="[[agentClass]]" type="[[delayTime]]">
                    <div slot="functionArea">

                    </div>
                </audio-functions>
            </section>
        </article>
`;
  }

  static get is() {
      return 'audio-delay';
  }
  constructor() {
      super();
  }
  ready() {
      super.ready()
      // console.log(this.agentClass)
  }
  static get properties() {
      return {
          elemTitle: {
              type: String,
              notify: true
          },
          type: {
              type: String,
              value: 'delay'
          },
          delayTime: {
              type: String,
              value: 'delayTime'
          },
          agentClass: {
              type: Object,
              notify: true
          },
          open: {
              type: Boolean,
              value: true,
              notify: true,
              reflectToAttribute: true
          },
          show: {
              type: Boolean,
              value: false,
              notify: true,
              reflectToAttribute: true
          }

      }
  }

  submit(event) {
      if (this.$.titleInput.value.length > 0) {
          this.elemTitle = this.elemTitle.split(' ').join('');
          this.agentClass.delay((error) => {                        
              if (error === null) {
                  var that1 = this
                  window.dispatchEvent(new CustomEvent('connect', { detail: { element: that1 } }))
                  let that = this.agentClass
                  this.open = false
                  this.show = true
                  this.$.functions.elemTitle = this.elemTitle
                  window.dispatchEvent(new CustomEvent('elemem-title', { detail: { title: this.elemTitle } }))
              } else {
                  this.$.titleInput.value = error
                  setTimeout(() => {
                      this.$.titleInput.value = ''
                  }, 1000)
              }
          }, this.elemTitle)
      }
  }

  removeCall() {
      if (this.agentClass.contextNode[this.elemTitle]) {
          this.agentClass.removeAgents(() => {
              this.agentClass.revoveElemTitle(() => {
                  //   window.dispatchEvent(new CustomEvent('remove-elem', { detail: { title: this.elemTitle } }))
                  setTimeout(() => {
                      window.dispatchEvent(new CustomEvent('remove-elem', { detail: { title: this.elemTitle } }))
                      window.dispatchEvent(new CustomEvent('apllywith', { detail: { title: this.elemTitle } }))
                      //  delete this.agentClass.contextNode[this.elemTitle]
                  }, 500)
                  this.parentElement.removeChild(this)
              }, this.elemTitle)
          }, 'contextNode', this.elemTitle)
      } else {
          this.parentElement.removeChild(this)
          window.dispatchEvent(new CustomEvent('remove-elem', { detail: { title: this.elemTitle } }))
      }
  }
}
window.customElements.define(audioDelay.is, audioDelay);
