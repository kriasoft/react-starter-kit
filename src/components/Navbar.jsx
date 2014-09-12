/**
 * @jsx React.DOM
 */

var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div className="navbar navbar-inverse navbar-fixed-top">
                <div className="container">
                    <a className="navbar-brand" href="/"><img src="/images/logo-small.png" width="38" height="38" alt="" /> React Seed</a>
                </div>
            </div>
        );
    }
});
