
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

import './audio-set-target-at-time.js';
import './audio-set-value-curve-at-time.js';
import './audio-set-func-at-time.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class audioFunctions extends PolymerElement {
  static get template() {
    return html`
        <style include="shared-styles-dropdown">
            :host {
                width: 100%;
                margin-right: 0px;
            }

            paper-dropdown-menu.custom2 {
                background-color: var(--app-primary-background-color);
                --paper-input-container: {
                    height: auto;
                }
            }
        </style>
        <section>
            <aside>
                <paper-dropdown-menu class="custom custom2" label="[[value]]">
                    <paper-listbox id="listBox" slot="dropdown-content" class="dropdown-content" selected="0">
                        <template is="dom-repeat" items="{{options}}" as="option" mutable-data="true">
                            <paper-item on-click="addFunction" id="[[option.id]]" value="[[option.name]]">
                                [[option.name]]
                            </paper-item>
                        </template>
                    </paper-listbox>
                </paper-dropdown-menu>
            </aside>
        </section>
        <div class="functionArea">
            <slot name="functionArea"></slot>
        </div>
`;
  }

  static get is() {
      return 'audio-functions';
  }
  constructor() {
      super();
  }
  ready() {
      super.ready()
  }
  static get properties() {
      return {
          type: {
              type: String,
              notify: true
          },
          elemTitle: {
              type: String
          },
          agentClass: {
              type: Object
          },
          value: {
              type: String,
              value: 'add function',
              notify: true,
              observer: 'addFunction'
          },
          options: {
              value: [
                  { id: 'start', name: 'functions' },
                  { id: 'setValueAtTime', name: 'Value AtTime', count: 0 },
                  { id: 'audio-set-target-at-time', name: 'Target AtTime', count: 0 },
                  { id: 'audio-set-value-curve-at-time', name: 'Curve Wave', count: 0 },
                  { id: 'exponentialRampToValueAtTime', name: 'Exponential Ramp', count: 0 },
                  { id: 'linearRampToValueAtTime', name: 'Linear Ramp', count: 0 },
                  { id: 'cancelScheduledValues', name: 'Cancel Scheduled', count: 0 },
                  { id: 'cancelAndHoldAtTime', name: 'Cancel & Hold', count: 0 }
              ]
          },
      }
  }

  _log(data) {
      console.log(data)
  }
  addFunction(data) {
  //    console.log(data)
      if (data.model && data.model.__data.option.id !== 'start') {
          let that = this.agentClass
          if (data.model.__data.option.id === 'audio-set-target-at-time' ||
              data.model.__data.option.id === 'audio-set-value-curve-at-time') {
              var element = document.createElement(data.model.__data.option.id)
          } else {
              var element = document.createElement('audio-set-func-at-time')
          }                    
        //  console.log(data.model)//.__data.option
          var arr = this.options
          arr[data.model.index].count += 1
          this.options = arr
          element.elemTitle = this.elemTitle
          element.agentClass = that
          element.contextNode = that.contextNode[this.elemTitle]
          element.typeFuncion = data.model.__data.option.id
          element.titleFuncion = data.model.__data.option.name + ' ' + (data.model.__data.option.count)
          element.type = this.type
          this.firstElementChild.append(element)
          setTimeout(() => {
              this.$.listBox.__data.items[0].click()
          }, 100)
      }
  }
}
window.customElements.define(audioFunctions.is, audioFunctions);
