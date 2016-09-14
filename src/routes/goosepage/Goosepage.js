import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Goosepage.css'

function Goosepage({ title }) {
    return (
        <div className={s.root}>
            <div className={s.container}>
                <h1>{title}</h1>
                <p>...</p>
            </div>
        </div>
        );
}

Goosepage.contextTypes = { setTitle: PropTypes.func.isRequired };

export default withStyles(s)(Goosepage);