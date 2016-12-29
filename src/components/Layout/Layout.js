/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.css';
import WEUI from 'react-weui';
const {
  Tab,
  TabBody,
  TabBar,
  TabBarItem,
  TabBarLabel,
  TabBarIcon
} = WEUI;


class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (
      <div className={s.container}>
        <Tab>
          <TabBody>
            {this.props.children}
          </TabBody>
          <TabBar>
            <TabBarItem
              active={true}
              icon={<span className="iconfont icon-message"/>}
              label="微信"
            />
            <TabBarItem>
              <TabBarIcon>
                <span className="iconfont icon-contact"/>
              </TabBarIcon>
              <TabBarLabel>通讯录</TabBarLabel>
            </TabBarItem>
            <TabBarItem
              icon={<span className="iconfont icon-discover" />}
              label="发现"
            />
            <TabBarItem
              icon={<span className="iconfont icon-my" />}
              label="我"
            />
          </TabBar>
        </Tab>
      </div>
    );
  }
}

export default withStyles(s)(Layout);
