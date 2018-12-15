import React from 'react';
import { MenuItem, DropdownButton } from 'react-bootstrap';

class Action extends React.Component {
  static actionsRenderer(children, title) {
    children = children.filter(c => c.type === Action);
    if (!children.length) return () => null;
    return user => (
      <DropdownButton title={title} onClick={e => e.stopPropagation()}>
        {children.map((node, i) => Action.renderAction(user, node, i))}
      </DropdownButton>
    );
  }
  static renderAction(user, node, i) {
    return (
      <MenuItem
        eventKey={i}
        onClick={e => {
          e.stopPropagation();
          node.props.onClick(user);
        }}
      >
        {node.props.children}
      </MenuItem>
    );
  }
}

export default Action;
