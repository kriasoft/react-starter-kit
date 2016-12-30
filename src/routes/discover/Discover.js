/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Discover.css';

import IconGame from './assets/icon_de_game.png';
import IconNearby from './assets/icon_de_nearby.png';
import IconPing from './assets/icon_de_ping.png';
import IconSaoyisao from './assets/icon_de_saoyisao.png';
import IconShop from './assets/icon_de_shop.png';
import IconYao from './assets/icon_de_yao.png';
import IconV2 from './assets/v2.png';

const smallIcon = <img className={s.icon} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII="/>;

import WEUI from 'react-weui';
const {
  Panel,
  PanelBody,
  MediaBox,
  Cell,
  CellBody,
  Cells,
  CellHeader,
  CellFooter
} = WEUI;

class Contact extends React.Component {

  render() {
    return (
      <div>
        <Panel>
          <PanelBody>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell href="javascript:;" access>
                  <CellHeader><img className={s.icon} src={IconV2}/></CellHeader>
                  <CellBody>
                    <p>朋友圈</p>
                  </CellBody>
                  <CellFooter/>
                </Cell>
              </Cells>
            </MediaBox>
          </PanelBody>
        </Panel>
        <Panel>
          <PanelBody>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell href="javascript:;" access>
                  <CellHeader><img className={s.icon} src={IconSaoyisao}/></CellHeader>
                  <CellBody>
                    <p>扫一扫</p>
                  </CellBody>
                  <CellFooter/>
                </Cell>
              </Cells>
            </MediaBox>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell href="javascript:;" access>
                  <CellHeader><img className={s.icon} src={IconYao}/></CellHeader>
                  <CellBody>
                    <p>摇一摇</p>
                  </CellBody>
                  <CellFooter/>
                </Cell>
              </Cells>
            </MediaBox>
          </PanelBody>
        </Panel>
        <Panel>
          <PanelBody>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell href="javascript:;" access>
                  <CellHeader><img className={s.icon} src={IconNearby}/></CellHeader>
                  <CellBody>
                    <p>附近的人</p>
                  </CellBody>
                  <CellFooter/>
                </Cell>
              </Cells>
            </MediaBox>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell href="javascript:;" access>
                  <CellHeader><img className={s.icon} src={IconPing}/></CellHeader>
                  <CellBody>
                    <p>漂流瓶</p>
                  </CellBody>
                  <CellFooter/>
                </Cell>
              </Cells>
            </MediaBox>
          </PanelBody>
        </Panel>
        <Panel>
          <PanelBody>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell href="javascript:;" access>
                  <CellHeader><img className={s.icon} src={IconShop}/></CellHeader>
                  <CellBody>
                    <p>购物</p>
                  </CellBody>
                  <CellFooter/>
                </Cell>
              </Cells>
            </MediaBox>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell href="javascript:;" access>
                  <CellHeader><img className={s.icon} src={IconGame}/></CellHeader>
                  <CellBody>
                    <p>游戏</p>
                  </CellBody>
                  <CellFooter/>
                </Cell>
              </Cells>
            </MediaBox>
          </PanelBody>
        </Panel>
      </div>
    );
  }
}

export default withStyles(s)(Contact);
