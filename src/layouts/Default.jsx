/**
 * @jsx React.DOM
 */

var React = require('react');
var Link = require('react-router').Link;
var Navbar = require('../components/Navbar.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <div>
                <Navbar />
                <this.props.activeRouteHandler />
                <div className="footer">
                    <div className="container">
                        <p className="text-muted">&copy; KriaSoft • <Link to="home">Home</Link> • <Link to="privacy">Privacy</Link></p>
                    </div>
                </div>
            </div>
        );
    }
});
