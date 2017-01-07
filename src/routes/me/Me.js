/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import WEUI from 'react-weui';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Me.css';

import IconCard from './assets/icon_me_card.png';
import IconCollect from './assets/icon_me_collect.png';
import IconMoney from './assets/icon_me_money.png';
import IconPhoto from './assets/icon_me_photo.png';
import IconSetting from './assets/icon_me_setting.png';
import IconSmail from './assets/icon_me_smail.png';
import IconGeek5 from './assets/geek5_link.png';

const smallIcon = <img className={s.iconRight} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII="/>;


const {
  Panel,
  PanelBody,
  Cell,
  CellBody,
  Cells,
  CellHeader,
  CellFooter,
  MediaBox,
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
                  <CellHeader><img className={s.iconLeft} src={IconGeek5}/></CellHeader>
                  <CellBody>
                    <p>Geek5.cn</p>
                    <p>微信号：calcYu</p>
                  </CellBody>
                  <CellFooter>{smallIcon}</CellFooter>
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
                  <CellHeader><img className={s.icon} src={IconPhoto}/></CellHeader>
                  <CellBody>
                    <p>相册</p>
                  </CellBody>
                  <CellFooter/>
                </Cell>
              </Cells>
            </MediaBox>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell href="javascript:;" access>
                  <CellHeader><img className={s.icon} src={IconCollect}/></CellHeader>
                  <CellBody>
                    <p>收藏</p>
                  </CellBody>
                  <CellFooter/>
                </Cell>
              </Cells>
            </MediaBox>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell href="javascript:;" access>
                  <CellHeader><img className={s.icon} src={IconMoney}/></CellHeader>
                  <CellBody>
                    <p>钱包</p>
                  </CellBody>
                  <CellFooter/>
                </Cell>
              </Cells>
            </MediaBox>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell href="javascript:;" access>
                  <CellHeader>
                    <img className={s.icon} src={IconCard}/>
                  </CellHeader>
                  <CellBody>
                    <p>卡包</p>
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
                  <CellHeader><img className={s.icon} src={IconSmail}/></CellHeader>
                  <CellBody>
                    <p>表情</p>
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
                  <CellHeader><img className={s.icon} src={IconSetting}/></CellHeader>
                  <CellBody>
                    <p>设置</p>
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
