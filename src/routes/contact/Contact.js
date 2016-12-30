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
import s from './Contact.css';
import SampleData from '../home/nameDB';

const smallIcon = <img className={s.icon} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII="/>;

import IconAddfriend from './assets/icon_addfriend.png';
import IconPublic from './assets/icon_public.png';
import IconQuanlian from './assets/icon_qunliao.png';

import WEUI from 'react-weui';
const {
  SearchBar,
  Panel,
  PanelHeader,
  PanelBody,
  MediaBox,
  MediaBoxBody,
  MediaBoxTitle,
  MediaBoxDescription,
  MediaBoxHeader,
  Cell,
  CellBody,
  Cells,
  CellHeader
} = WEUI;

class Contact extends React.Component {
  state={
    searchText: '',
    results: []
  };

  static propTypes = {
    friends: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      contentSnippet: PropTypes.string,
    })).isRequired,
  };

  handleChange(text, e){
    let keywords = [text];
    let results = SampleData.filter(/./.test.bind(new RegExp(keywords.join('|'),'i')));

    if(results.length > 3) results = results.slice(0,3);
    this.setState({
      results,
      searchText:text,
    });
  }

  render() {
    return (
      <div>
        <SearchBar
          onChange={this.handleChange.bind(this)}
          placeholder="Search"
          lang={{
            cancel: 'Cancel'
          }}
        />
        <Panel style={{display: this.state.searchText ? 'none': null, marginTop: 0}}>
          <PanelBody>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell href="javascript:;" access>
                  <CellHeader><img className={s.icon} src={IconAddfriend}/></CellHeader>
                  <CellBody>
                    <p>新的朋友</p>
                  </CellBody>
                </Cell>
              </Cells>
            </MediaBox>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell href="javascript:;" access>
                  <CellHeader><img className={s.icon} src={IconQuanlian}/></CellHeader>
                  <CellBody>
                    <p>群聊</p>
                  </CellBody>
                </Cell>
              </Cells>
            </MediaBox>
            <MediaBox type="small_appmsg">
              <Cells>
                <Cell href="javascript:;" access>
                  <CellHeader><img className={s.icon} src={IconPublic}/></CellHeader>
                  <CellBody>
                    <p>公众号</p>
                  </CellBody>
                </Cell>
              </Cells>
            </MediaBox>
          </PanelBody>
        </Panel>
        <Panel style={{display: this.state.searchText ? 'none': null, marginTop: 0}}>
          <PanelHeader>
            Z
          </PanelHeader>
          <PanelBody>
            {
              this.props.friends.length > 0 ?
                this.props.friends.map((item,i)=>{
                  return (
                  <MediaBox type="small_appmsg">
                    <Cells>
                      <Cell href="javascript:;" access>
                        <CellHeader>{smallIcon}</CellHeader>
                        <CellBody>
                          <p>{item.title}</p>
                        </CellBody>
                      </Cell>
                    </Cells>
                  </MediaBox>
                  )
                })
                : <MediaBox>Can't find any！</MediaBox>
            }
          </PanelBody>
        </Panel>
        <Panel style={{display: this.state.searchText ? null: 'none', marginTop: 0}}>
          <PanelHeader>
            Female Name Search
          </PanelHeader>
          <PanelBody>
            {
              this.state.results.length > 0 ?
                this.state.results.map((item,i)=>{
                  return (
                    <MediaBox type="small_appmsg">
                      <Cells>
                        <Cell href="javascript:;" access>
                          <CellHeader>{smallIcon}</CellHeader>
                          <CellBody>
                            <p>{item}</p>
                          </CellBody>
                        </Cell>
                      </Cells>
                    </MediaBox>
                  )
                })
                : <MediaBox>Can't find any！</MediaBox>
            }
          </PanelBody>
        </Panel>
      </div>
    );
  }
}

export default withStyles(s)(Contact);
