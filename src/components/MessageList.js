import React, {Component} from 'react';
import KeyHandler, {KEYDOWN} from 'react-key-handler';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';

const DEFAULT_AVATAR_INDEX = 0

class EditableText extends Component {

  changeText(event) {
    this.props.updatePlot(event.target.value)
  }
  handleSubmit(event) {
    event.preventDefault()
    this.props.selectRecordComponent({component: null})
  }

  doubleClickText(event) {
    this.props.selectRecordComponent({component: event.currentTarget.id})
    event.stopPropagation()

  }
  renderTextEdit() {
    if (!this.props.isEditing) {
      return (<span className="record-text">
        {this.props.textValue}
      </span>);
    } else {
      return (<span className="record-form">
        <form onSubmit={(event) => this.handleSubmit(event)}>
          <TextField className="messageListFormTextField" value={this.props.textValue} onChange={event => this.changeText(event)}/>
        </form>
      </span>);
    }
  }
  render() {
    return (<span id={this.props.id} className="EditableText" onDoubleClick={e => this.doubleClickText(e)}>
      {this.renderTextEdit()}
    </span>);
  }
}


class MessageAvatar extends Component {
  doubleClickAvatar(event) {
    this.props.selectRecordComponent({component: event.currentTarget.id})
    event.stopPropagation()
  }
  render() {
    return (<span id={this.props.id} onDoubleClick={(event) => this.doubleClickAvatar(event)}>
      <Avatar src={this.props.imagePath} size={30}/> {this.props.character.name}:
    </span>);
  }
}


class CharacterListDialog extends Component {
  renderCharacterList() {
    const list = this.props.characterList.map((component, index) => {
      return (<div key={index} className="dialog-character-record" onClick={event => {
          this.props.updateCharacter({character: component, imagePath: component.avatar[DEFAULT_AVATAR_INDEX].avatarImagePath})
          this.props.selectRecordComponent(event)
        }}>
        [@{component.id}:{component.name}<Avatar src={component.avatar[0].avatarImagePath}/>
      </div>)
    })
    return list;
  }
  render() {
    if (this.props.isOpen) {
      return (<span id={this.props.id}>
        {this.renderCharacterList()}
      </span>)
    } else {
      return (<span id={this.props.id}></span>)
    }
  }
}

class MessageRecord extends Component {

    plotId = "message-record-plot"
    avatarId = "message-record-avatar"
    avatarDialogId = "message-record-characterDialog"

    updatePlot(plot) {
      let message = this.props.component
      message.plot = plot
      this.props.updateRecord({"id": this.props.component.id, "message": message})
    }
    updateCharacter(event) {
      let message = this.props.component
      message.character = event.character
      message.imagePath = event.imagePath
      this.props.updateRecord({"id": this.props.component.id, "message": message})
    }
    selectRecord(event) {
      this.props.selectRecord({
        id: this.props.component.id,
        key: {
          shiftKey: event.shiftKey,
          altKey: event.altKey
        }
      })
      event.stopPropagation()
    }
    render() {
      const isEditing = (this.props.component.id === this.props.editTarget.id)
      let devStyle = {
        backgroundColor: "blue"
      }
      if (this.props.isSelect) {
        devStyle.backgroundColor="red"
      }
      return (
        <div>
        <span className="message-dialog">
          <CharacterListDialog id={this.avatarDialog} isOpen={isEditing && this.props.editTarget.component === this.avatarId} onClick={event => {
              event.stopPropagation()
            }} characterList={this.props.characterList} updateCharacter={(event) => this.updateCharacter(event)} selectRecordComponent={event => this.props.selectRecordComponent({id: null, component: null})}/>
        </span>
        <span id="message-record" onClick={event => {
            this.selectRecord(event)
          }} style={devStyle}>
          <MessageAvatar id={this.avatarId} character={this.props.component.character} imagePath={this.props.component.imagePath} selectRecordComponent={event => this.props.selectRecordComponent({id: this.props.component.id, component: event.component})}/>
          <EditableText id={this.plotId} textValue={this.props.component.plot} updatePlot={(plot) => this.updatePlot(plot)} isEditing={isEditing && this.props.editTarget.component === this.plotId} selectRecordComponent={event => this.props.selectRecordComponent({id: this.props.component.id, component: event.component})}/>
        </span>
      </div>
      )
    }
}

class MessageList extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      editTarget: {
        id: null,
        component: null
      },
      selectedRecord: []
    }
  }
  insertIndex(arr, key) {
    let index = arr.indexOf(key)
    if (index !== -1) {
      arr.splice(index, 1)
    }
    arr.push(key)
  }
  selectRecord(event) {
    let sel = this.state.selectedRecord

    if (event.key.shiftKey) {
      //T.B.D
    } else if (event.key.altKey) {
      this.insertIndex(sel, event.id)
    } else {
      sel = []
      this.insertIndex(sel, event.id)
    }
    this.setState({selectedRecord: sel})
    console.log("selectRecord")
    console.log(sel)

  }
  selectRecordComponent(e) {
    this.setState({
      editTarget: {
        id: e.id,
        component: e.component
      }
    })
    console.log("select::" + e.component)
  }
  updateRecord(e) {
    this.props.updateMessage(e.id, e.message);
  }
  deleteRecord(idList) {
    for (let key in idList) {
      console.log("key is " + idList[key])
      this.props.deleteMessage(idList[key])
    }
    this.setState({selectedRecord: []})
  }
  resetTarget(event) {
    this.setState({
      editTarget: {
        id: null,
        component: null
      }
    })
  }
  cancelSelectRecord(event) {
    this.setState({selectedRecord: []})
  }
  renderList() {
    const list = this.props.messages.map((component, index) => {
      return (<div key={index}>
        <MessageRecord component={component} characterList={this.props.characterList} editTarget={this.state.editTarget} isSelect={(this.state.selectedRecord.indexOf(component.id) !== -1)} selectRecord={event => this.selectRecord(event)} selectRecordComponent={event => this.selectRecordComponent(event)} updateRecord={event => this.updateRecord(event)}/>
      </div>)
    })
    return list
  }
  render() {
    const DELETE = 8
    return (<div className="messageList" onClick={e => this.cancelSelectRecord(e)} onDoubleClick={e => this.resetTarget(e)}>
      <KeyHandler keyEventName={KEYDOWN} keyCode={DELETE} onKeyHandle={event => {
          console.log("delete")
          this.deleteRecord(this.state.selectedRecord)
        }}/> {this.renderList()}
    </div>);
  }
}

export default MessageList
