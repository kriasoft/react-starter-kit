#!/bin/bash
# Use > 1 to consume two arguments per pass in the loop (e.g. each
# argument has a corresponding value to go with it).
# Use > 0 to consume one or more arguments per pass in the loop (e.g.
# some arguments don't have a corresponding value to go with it such
# as in the --default example).
# note: if this is set to > 0 the /etc/hosts part is not recognized ( may be a bug )

outputdir="$1"

name="$2"       
path="$outputdir/$name"

mkdir $path
touch "$path/package.json"
echo "{
  \"name\": \"$name\",
  \"version\": \"0.0.0\",
  \"private\": true,
  \"main\": \"./$name.js\"
}" > "$path/package.json"
touch "$path/$name.scss"
touch "$path/$name.js"
echo "import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './$name.scss';

class $name extends Component {
  render() {
    return (
      <div></div>
    )
  }
}

export default withStyles( $name, s);" > "$path/$name.js"

echo "Created Component $name"
