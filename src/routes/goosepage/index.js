import React from 'react';
import Goosepage from './Goosepage';

const title = 'The Goose Page';

export default {

    path: '/goosepage',

        action() {
        return {
            title,
            component: <Goosepage title={title} />,
        };
    },

};