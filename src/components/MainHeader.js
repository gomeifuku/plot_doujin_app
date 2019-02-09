import React, {Component} from 'react';
import avatar_img from '../../public/avatar.jpg';
import avatar_img2 from '../../public/avatar2.png';
import TextField from '@material-ui/core/TextField';
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar';
import Drawer from '@material-ui/core/Drawer';
import Dialog, {DialogActions, DialogContent, DialogTitle} from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import {MenuList, MenuItem} from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import AddIcon from '@material-ui/icons/Add';

class CreateCharacterItem extends Component {
  constructor() {
    super()
    this.state = {
      modalIsOpen: false,
      newCharacterStates: {
        id: "",
        name: "",
        avatar: [
          {
            id: 1,
            emo: "",
            avatarImagePath: avatar_img
          }
        ],
        basicEmotion: ""
      }
    }
  }
  textChange(event) {
    let formInput = this.state.newCharacterStates
    formInput[event.key] = event.text;
    this.setState({newCharacterStates: formInput});
  }
  createCharacter(event) {
    event.preventDefault()
    if(this.props.createCharacter(this.state.newCharacterStates)){
      this.setState({
        newCharacterStates: {
          id: "",
          name: "",
          avatar: [
            {
              id: 1,
              emo: "通常",
              avatarImagePath: avatar_img
            }
          ],
          basicEmotion: ""
        }
      })
    }
  }
  render() {
    return (
      <div className="modalCreateCharacter">
      <Dialog title="Create New Character" open={this.props.isOpen} onClose={this.props.onCancelAction}>
        <DialogTitle>{"Please Input Character's Info"}</DialogTitle>
        <DialogContent>
          <div className="modalCreateCharacterForm">
            <TextField label="ID" onChange={event => this.textChange({key: "id", text: event.target.value})} value={this.state.newCharacterStates.id}/>
            <TextField label="名前" onChange={event => this.textChange({key: "name", text: event.target.value})} value={this.state.newCharacterStates.name}/>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={(event) => {this.props.onCancelAction()}}>
            {"Cancel"}
          </Button>
          <Button onClick={(event) => this.createCharacter(event)}>
            {"Create!"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>)
  }
}

class MainHeader extends Component {
  constructor() {
    super();
    this.state = {
      isCharacterListOpen: false,
      isCreateCharacterFormOpen: false
    }
  }
  renderCharacterList() {
    const list = this.props.characterList.map((component, index) => {
      return (<MenuItem onClick={this.handleClose} key={index}>
        @{component.id}:{component.name}<Avatar src={component.avatar[0].avatarImagePath}/>
      </MenuItem>);
    })
    return list;
  }

  toggleCharacterList = (event) => {
    this.setState({
      isCharacterListOpen: !this.state.isCharacterListOpen
    })
  }
  toggleCreateCharacterForm = (event) => {
    this.setState({
      isCreateCharacterFormOpen: !this.state.isCreateCharacterFormOpen
    })
  }

  createCharacter(character) {
    const isSuccess = this.props.updateCharacterList(character)
    if (isSuccess) {
      this.setState({isCreateCharacterFormOpen: false})
    }
    return isSuccess
  }
  render() {
    return (
      <div className="MainHeader">
      <CreateCharacterItem isOpen={this.state.isCreateCharacterFormOpen} createCharacter={e => this.createCharacter(e)} onCancelAction={e => this.toggleCreateCharacterForm(e)}/>
      <Drawer anchor="left" open={this.state.isCharacterListOpen} title="plot-doujin-app" onClose={event => this.toggleCharacterList(event)}>
        <MenuList>
          {this.renderCharacterList()}
          <MenuItem onClick={e => this.toggleCreateCharacterForm(e)}>
            {"Add Characeter "}
            <Avatar >
              <AddIcon/>
            </Avatar>
          </MenuItem>
        </MenuList>
      </Drawer>
      <AppBar position="static" color="default" title="plotApp">
        <IconButton onTouchTap={(event)=>{this.toggleCharacterList(event)}}>
          <HomeIcon/>
        </IconButton>
      </AppBar>
    </div>)
  }
}

export default MainHeader
