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

import { html } from '@polymer/polymer/lib/utils/html-tag.js';
class audioCompressorFunction extends PolymerElement {
  static get template() {
    return html`
        <style include="shared-styles-dropdown">
            :host {
                margin-right: 0px;
            }

            paper-dropdown-menu.custom {
                background-color: initial;
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
      return 'audio-compressor-function';
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
              type: Object,
              value: {}
          },
          value: {
              type: String,
              value: 'add compressor',
              notify: true,
              // observer: 'pann'
          },
          options: {
              value: [
                  { id: 'Start', name: 'Dynamics' },
                  { id: 'compressor-set-function', name: 'threshold', count: 0 },
                  { id: 'compressor-set-function', name: 'knee', count: 0 },
                  { id: 'compressor-set-function', name: 'ratio', count: 0 },
                  { id: 'compressor-set-function', name: 'attack', count: 0 },
                  { id: 'compressor-set-function', name: 'release', count: 0 },
              ]
          },
      }
  }

  _log(data) {
      console.log(data)
  }

  addFunction(data) {
      if (data.model && data.model.__data.option.id !== 'Start') {
          var element = document.createElement('audio-' + data.model.__data.option.id)
          var arr = this.options
          this.options = arr
          element.typeFuncion = data.model.__data.option.name
          arr[data.model.index].count += 1
          element.elemTitle = this.elemTitle
          element.agentClass = this.agentClass
          element.contextNode = this.agentClass.contextNode[this.elemTitle]
          element.titleFuncion = data.model.__data.option.name + ' ' + (data.model.__data.option.count)
          element.type = this.type
          this.firstElementChild.append(element)
          setTimeout(() => {
              this.$.listBox.__data.items[0].click()
          }, 100)
      }
  }
}
window.customElements.define(audioCompressorFunction.is, audioCompressorFunction);
