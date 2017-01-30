/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import WEUI from 'react-weui';
import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.css';
import history from '../../core/history';

const {
  Tab,
  TabBody,
  TabBar,
  TabBarItem,
  TabBarLabel,
  TabBarIcon,
} = WEUI;


class Layout extends React.Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    tab: 0,
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
              active={this.state.tab === 0}
              onClick={() => {
                this.setState({tab: 0});
                history.push('/');
              }}
              icon={<span className="iconfont icon-message"/>}
              label="微信"
            />
            <TabBarItem
              active={this.state.tab === 1}
              onClick={() => {
                this.setState({tab: 1});
                history.push('/contact');
              }}>
              <TabBarIcon>
                <span className="iconfont icon-contact"/>
              </TabBarIcon>
              <TabBarLabel>通讯录</TabBarLabel>
            </TabBarItem>
            <TabBarItem
              active={this.state.tab === 2}
              onClick={() => {
                this.setState({tab: 2});
                history.push('/discover');
              }}
              icon={<span className="iconfont icon-discover"/>}
              label="发现"
            />
            <TabBarItem
              active={this.state.tab === 3}
              onClick={() => {
                this.setState({tab: 3});
                history.push('/me');
              }}
              icon={<span className="iconfont icon-my"/>}
              label="我"
            />
          </TabBar>
        </Tab>
      </div>
    );
  }
}

export default withStyles(s)(Layout);
