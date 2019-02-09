import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';

class MessageForm extends Component {
  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(event);

  }

  handleChange(key, newValue) {
    this.props.onChange({'target': this, 'key': key, 'text': newValue});
  }

  render() {
    return (<div>
      <form className="messageForm" onSubmit={(event) => this.handleSubmit(event)}>
        <TextField label="キャラクター" value={this.props.textValue.characterId} onChange={ev => this.handleChange("characterId", ev.target.value)}/>
        <TextField label="メッセージ" value={this.props.textValue.plot} onChange={ev => this.handleChange("plot", ev.target.value)}/>
        <input type="submit" value="Post"></input>
      </form>
    </div>);
  }
}

export default MessageForm
