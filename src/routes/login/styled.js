/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

export const Lead = styled.p`
  font-size: 1.25em;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const SocialSvg = styled.svg.attrs({
  width: '30',
  height: '30',
  viewBox: '0 0 30 30',
  xmlns: 'http://www.w3.org/2000/svg',
})`
  display: inline-block;
  margin: -2px 12px -2px 0;
  width: 20px;
  height: 20px;
  vertical-align: middle;
  fill: currentColor;
`;

const commonButtonStyle = `
  display: block;
  box-sizing: border-box;
  margin: 0;
  padding: 10px 16px;
  width: 100%;
  outline: 0;
  border: 1px solid #373277;
  border-radius: 0;
  background: #373277;
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-size: 18px;
  line-height: 1.3333333;
  cursor: pointer;

  &:hover {
    background: rgba(54, 50, 119, 0.8);
  }

  &:focus {
    border-color: #0074c2;
    box-shadow: 0 0 8px rgba(0, 116, 194, 0.6);
  }
`;

export const Button = styled.button`
  ${commonButtonStyle}
`;

const SocialLoginA = styled.a`
  ${commonButtonStyle}

  border-color: ${({ background }) => background};
  background: ${({ background }) => background};
  &:hover {
    background: ${({ hoverBackground }) => hoverBackground};
  }
  composes: button;
`;

// background, hoverBackground href
export const SocialLoginLink = ({ path, text, ...props }) => (
  <FormGroup>
    <SocialLoginA {...props}>
      <SocialSvg>
        <path d={path} />
      </SocialSvg>
      <span>{text}</span>
    </SocialLoginA>
  </FormGroup>
);

SocialLoginLink.propTypes = {
  path: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export const LineThrough = styled.strong`
  position: relative;
  z-index: 1;
  display: block;
  margin-bottom: 15px;
  width: 100%;
  color: #757575;
  text-align: center;
  font-size: 80%;

  &::before {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: -1;
    margin-top: -5px;
    margin-left: -20px;
    width: 40px;
    height: 10px;
    background-color: #fff;
    content: '';
  }

  &::after {
    position: absolute;
    top: 49%;
    z-index: -2;
    display: block;
    width: 100%;
    border-bottom: 1px solid #ddd;
    content: '';
  }
`;

export const Label = styled.label`
  display: block;
  font-weight: 700;
`;

export const Input = styled.input`
  display: block;
  box-sizing: border-box;
  margin: 5px 0 0;
  padding: 10px 16px;
  width: 100%;
  height: 46px;
  outline: 0;
  border: 1px solid #ccc;
  border-radius: 0;
  background: #fff;
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  color: #616161;
  font-size: 18px;
  line-height: 1.3333333;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;

  &:focus {
    border-color: #0074c2;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 8px rgba(0, 116, 194, 0.6);
  }
`;
