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
class audioSourceSelector extends PolymerElement {
  static get template() {
    return html`
        <style include="shared-styles-dropdown">
            :host {
                width: 100%;
            }

            a {
                color: black;
                text-decoration: none;
            }

            nav {
                /*   box-shadow: 2px 2px 6px #272424;*/
                border-radius: var(--app-standart-border-radius);
                margin-top: 6px;
            }

            section {
                display: flex;
            }
        </style>

        <nav>
            <section>
                <aside>
                    <paper-dropdown-menu class="custom custom2" label="[[label]]">
                        <paper-listbox id="listBox2" slot="dropdown-content" class="dropdown-content" selected="0">
                            <template is="dom-repeat" items="{{options}}" as="option" mutable-data="true">
                                <paper-item on-click="dataChanged" id="[[option.id]]" value="[[option.name]]">
                                    [[option.name]]
                                </paper-item>
                            </template>
                        </paper-listbox>
                    </paper-dropdown-menu>
                </aside>
            </section>
        </nav>
`;
  }

  static get is() {
      return 'audio-source-selector';
  }
  constructor() {
      super();
  }
  ready() {
      super.ready()
  }
  static get properties() {
      return {
          label: {
              type: String,
              value: 'Sources & Destinations',
              notify: true,
          },
          value: {
              type: String,
              value: 'sources',
              notify: true,
          },
          options: {
              value: [
                  { id: 'sources', name: 'Add source' },
                  { id: 'input-source', name: 'From Input' },
                  { id: 'file-source', name: 'From File' },
                  { id: 'recorder', name: 'Recorder' },
              ]
          }
      }
  }
  dataChanged(data) {                
      this.value = data.model.__data.option.id
      if (data.model.__data.option.id !== 'sources')
          setTimeout(() => {
              this.value = 'sources'
              this.$.listBox2.__data.items[0].click()
          }, 100)
  }
}
window.customElements.define(audioSourceSelector.is, audioSourceSelector);
