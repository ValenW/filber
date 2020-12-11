export default class Component {
  constructor(props) {
    this.props = props;
    this.state = {};
  }
  setState(state) {
    this.state = { ...this.state, ...state };
  }
  updateProps(props) {
    this.props = props;
  }
}
