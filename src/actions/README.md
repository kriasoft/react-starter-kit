Action creators

Action Creators should go there

_Example component_

```js
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as runtimeActions from '../../actions/runtime.actions'

const mapStateToProps = ({ runtime }) => ({ runtime });

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...runtimeActions }, dispatch);

@withStyles(s)
@connect(mapStateToProps, mapDispatchToProps)
class CustomComponent extends Component {
  static propTypes = {
    /* runtime */
    runtime: PropTypes.shape().isRequired,
    setRuntimeVariable: PropTypes.func.isRequired,
  }
  ...
}
```
