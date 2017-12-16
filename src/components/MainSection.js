import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import './MainSection.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import Drawer from 'material-ui/Drawer';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import SvgIcon from 'material-ui/svg-icons/action/home';
import FlatButton from 'material-ui/FlatButton';
import Modal from 'react-modal';
import avatar_img from '../../public/avatar.jpg';
import avatar_img2 from '../../public/avatar2.png';
import TestComponent from './TestComponent';
const DEFAULT_AVATAR_INDEX = 0
//連想配列に関して，いちいち属性増えた時直すの面倒だから型を決めて変数入力するだけのジェネレータを作っておく
injectTapEventPlugin()

//Todo:characterを作成するためのボタン
class testApp extends
class CreateCharacterButton extends Component{
  constructor(){
    super();
    this.state={
      modalIsOpen:false,
      newCharacterStates:{
        name:"",
        id:"",
      },
    }
  }

  showModal(){
    this.setState({
      modalIsOpen:true
    });
    console.log("show Modal Window");
  }

  closeModal() {
      console.log("close Modal")
      const formInput={
        id:"",
        name:"",
      }
      this.setState({
        newCharacterStates:formInput,
        modalIsOpen: false,
      });
  }

  handleChange(key,text){
    const formInput={
      id:this.state.newCharacterStates["id"],
      name:this.state.newCharacterStates["name"],
    };
    formInput[key]=text;
    this.setState({
      newCharacterStates:formInput,
    });
  }
  handleClick(event){
    this.showModal();
  }

  handleSubmit(event){
    event.preventDefault();
    this.props.createCharacter(this.state.newCharacterStates["id"],this.state.newCharacterStates["name"]);
    this.closeModal();
  }

  render(){
    return(
    <div>
      <form name="createCharacterButton">
        {//FIX::Modalの下でTextFieldと、入力一文字目が変換できない不具合
          //多分最初にタップを入力として受け付ける関数（onTouchTap）の呼び出しがされてないのが
         //とメニューが開かない原因だと思われる
         //onTouchTapを契機にしたモジュール(button以外)に切り替え？
        }
        <div className="modalCreateCharacter">
          <Dialog
            title ="Create New Character"
            open={this.state.modalIsOpen}>
            <div className="modalCreateCharacterForm">
              <form className="messageForm" onSubmit={(event)=> this.handleSubmit(event)}>
                <TextField
                  floatingLabelText="ID"
                  ref="create_id"
                  onChange={ev=>this.handleChange("id",ev.target.value)}
                  value={this.state.newCharacterStates["id"]}
                />
                <TextField
                 floatingLabelText="名前"
                 ref="create_name"
                 onChange={ev=>this.handleChange("name",ev.target.value)}
                 value={this.state.newCharacterStates["name"]}
                 />
                <input type="submit" value="Post"></input>
              </form>
           </div>
           <button onClick={(event)=>this.closeModal(event)}>Close</button>
          </Dialog>
        </div>
        <input type="button" onClick={(event)=>this.handleClick(event)} value="create character"></input>
      </form>
    </div>);
  }
};
class CharactersDialog extends Component{
  constructor(){
    super()
  }
  renderCharacterList(){
    const list=this.props.characterList.map((component,index)=>{
      return(
        <div
          class="dialog-character-record"
          onClick={event=>this.props.updateCharacter({
            character:component,
            imagePath:component.avatar[DEFAULT_AVATAR_INDEX].avatarImagePath}
          )}>
            [@{component.id}:{component.name}<Avatar src={component.avatar[0].avatarImagePath}/>
        </div>
      )
    })
    return list;
  }
  render(){
    if(this.props.isOpen){
    return(
      <span
        id={this.props.id}
        >
        {this.renderCharacterList()}
      </span>
    )
    }else{
      return(
        <span
          id={this.props.id}
          >
        </span>
      )
    }
  }
}


class MessageAvatar extends Component{
  clickAvatar(event){
    this.props.selectRecordComponent({
      component:event.currentTarget.id
    })
    event.stopPropagation()
  }
  render(){
    return(
      <span
        id={this.props.id}
        onClick={(event)=>this.clickAvatar(event)}>
        <Avatar
        src={this.props.imagePath}
        size={30}
        />
        {this.props.character.name}:
      </span>
    );
  }
}

class MessageHint extends Component{
  renderHintList(){
    const lists=this.props.hintlist.map((component,index) =>{
      return (
        <div>
          {component}
        </div>
      );
    })
    return lists;
  }

  render(){
    return(
      <div className="hintList">
        {this.renderHintList()}
      </div>
    );
  }
}

class EditableText extends Component{


  changeText(event){
    this.props.updatePlot(event.target.value)
  }
  handleSubmit(event){
    event.preventDefault()
    this.props.selectRecordComponent({component: null})
  }

  clickText(event){
    this.props.selectRecordComponent({component: event.currentTarget.id})
		event.stopPropagation()

  }
  renderTextEdit(){
    if(!this.props.isEditing){
      return(
        <span
          className="record-text"
          >
          {this.props.textValue}
        </span>
      );
    }else{
      return(
        <span
          className="record-form" >
          <form onSubmit={(event)=> this.handleSubmit(event)}>
            <TextField
              className="messageListFormTextField"
              value={this.props.textValue}
              onChange={event=>this.changeText(event)}
              />
          </form>
        </span>
      );
    }
  }
  render(){
    return(
      <span
        id={this.props.id}
        className="EditableText"
        onClick={e=>this.clickText(e)}>
        {this.renderTextEdit()}
      </span>
    );
  }
}

class MessageRecord extends Component {
  plotId="message-record-plot"
  avatarId="message-record-avatar"
  avatarDialogId="message-record-characterDialog"
  updatePlot(plot){
    let message=this.props.component
    message.plot=plot
    this.props.updateRecord(
      {"id":this.props.component.id,
        "message":message})
  }
  updateCharacter(event){
    let message=this.props.component
    message.character=event.character
    message.imagePath=event.imagePath
    this.props.updateRecord(
      {"id":this.props.component.id,
        "message":message})
  }
  render(){
    let isEditing=(this.props.component.id===this.props.editTarget.id)
    return(
    <div className="message-record">
      <CharactersDialog
        id={this.avatarDialog}
        isOpen={isEditing&&this.props.editTarget.component===this.avatarId}
        onClick={event=>{event.stopPropagation()}}
        characterList={this.props.characterList}
        updateCharacter={(event)=>this.updateCharacter(event)}
        />
      <MessageAvatar
        id={this.avatarId}
        character={this.props.component.character}
        imagePath={this.props.component.imagePath}
        selectRecordComponent={
          event=>this.props.selectRecordComponent({
            id:this.props.component.id,
            component:event.component
        })}
      />
      <EditableText
        id={this.plotId}
        textValue={this.props.component.plot}
        updatePlot={(plot)=>this.updatePlot(plot)}
        isEditing={isEditing&&this.props.editTarget.component===this.plotId}
        selectRecordComponent={
          event=>this.props.selectRecordComponent({
            id:this.props.component.id,
            component:event.component
        })}
      />
  </div>
)}
}

class MessageList extends Component{
  constructor(){
    super();
    this.state={
      open:false,
      editTarget:{
        id:null,
        component:null
      }
    }
  }
  selectRecordComponent(e){
    this.setState({
      editTarget:{
        id:e.id,
        component:e.component
      }
    })
    console.log("select::"+e.component)
  }
  updateRecord(e){
    this.props.updateMessage(e.id,e.message);
  }
  clickList(e){
    this.setState({
      editTarget:{
        id:null,
        component:null
      }
    })
  }
  renderList(){
      const list=this.props.messages.map((component,index)=>{
        return (
        <div>
            <MessageRecord
              component={component}
              characterList={this.props.characterList}
              editTarget={this.state.editTarget}
              selectRecordComponent={event=>this.selectRecordComponent(event)}
              updateRecord={event=>this.updateRecord(event)}
            />
        </div>
      )})
    return list
  }

  render() {
    return (
      <div className="messageList" onClick={e=>this.clickList(e)}>
        {this.renderList()}
      </div>
    );
  }
}

class MessageForm extends Component{
  handleSubmit(event){
    event.preventDefault();
    this.props.onSubmit(event);

  }

  handleChange(key,newValue){
    this.props.onChange(
      {
        'target':this,
        'key':key,
        'text':newValue
      }
    );
  }

  render(){
    return(
      <div>
        <form className="messageForm" onSubmit={(event)=> this.handleSubmit(event)}>
          {//ここにアバターを設定する画像ボタン設置
          }
          <TextField
            floatingLabelText="キャラクター"
            ref="character"
            value={this.props.textValue["characterId"]}
            onChange={ev=>this.handleChange("characterId",ev.target.value)}/>
          <TextField
            floatingLabelText="メッセージ"
            ref="plot"
            value={this.props.textValue["plot"]}
            onChange={ev=>this.handleChange("plot",ev.target.value)}
           />
          <input type="submit" value="Post"></input>
        </form>
      </div>
    );
  }
}

const characterListButton = (props) => (
  <FlatButton label="CharacterList" />
)

class MainHeader extends Component {
  constructor(){
    super();
    this.state={
      open:false,
    }
  }
  showCharacterList(){
    const list=this.props.characterList.map((component,index)=>{
      return(
        <MenuItem onClick={this.handleClose}>
          {component.name}
        </MenuItem>
      );
    })

    return list;
  }
  handleToggle = () =>{console.log("toggle");this.setState({open:!this.state.open});}
  handleClose = () =>this.setState({open:false});
  render(){
    return(
      <div className="MainHeader">
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          {this.showCharacterList()}
        </Drawer>
                  {/*Fix::メニューが開かない、こまった  　=>ボタンだけでDrawerを表示 */ }
        <AppBar title="plotApp" iconElementLeft={
          <IconButton
            tooltip="List"
            onTouchTap = {(event)=>{
              console.log("tap");
              this.handleToggle();
            }} >
            <SvgIcon />
          </IconButton>}>
        </AppBar>
      </div>

    );
  }
}

class MainSection extends Component {
  constructor(){
    super();
    this.state={
      emptyId:10,//最新の未割当id
      characterList:[//キャラクター{id,name}
        {id:"test1",
         name:"テスト太郎",
         avatar:[
            {
              id : 1,
              emo : "通常",
              avatarImagePath : avatar_img
            },
            {
              id : 2,
              emo : "笑い",
              avatarImagePath : avatar_img
            }
        ],
         basicEmotion:"笑い"
       },
       {
         id:"test2",
         name:"テスト次郎",
         avatar:[
            {
              id : 1,
              emo : "通常",
              avatarImagePath : avatar_img2
            },
            {
              id : 2,
              emo : "笑い",
              avatarImagePath : avatar_img2
            }
        ],
         basicEmotion:"笑い"
       }
     ],
      messages:[//メッセージ{id,characterId,plot,imagePath}
        {
          id:1,
          character:
            {
              id:"test1",
              name:"テスト太郎",
              avatar:[]
            },
          plot:"aaaaa",
          imagePath:"",
        }/*,
        {
          id:2,
          character:
            {
              id:"test2",
              name:"テスト次郎",
            },
          plot:"bbbbb",
          imagePath:"",
        }*/
      ],

      textValue:{
          id:"",
          characterId:"",
          plot:"",
          imagePath:"",
        },
     hintlist:[],
    };
  }
  onChange(e){
    const values=
      {
        characterId:this.state.textValue["characterId"],
        plot:this.state.textValue["plot"],
        imagePath:avatar_img,
      };　
    values[e.key]=e.text;
    this.setState({
      textValue:values,
      }
   );
/*
    if(e.text!=""){
      var lists=[];
      for (var index = 0; index < this.state.characterList.length; index++) {
        if(this.state.characterList[index]["id"].startsWith(e.text)){
          lists.push(this.state.characterList[index]["id"])
        }
      }
    }else{
      lists=[];
    }
    this.setState({
      hintlist:lists,
    });
    */
  }
  autoIncrement(){
    const id=this.state.emptyId
    this.setState({
      emptyId:this.state.emptyId+1,
    })
    return id
  }
  messageSubmit=(e)=>{
    console.log("MessageBox::messageSubmit()")
    console.log(this.state.textValue)
    console.log(this.state.emptyId)
    //TODO::this.state.textValue["characterId"]にゴウチするキャラクターをcharacterListから探索
    let character=  {
      id:this.state.textValue.characterId,
      name:"名無し"
    }
    let imagePath=null
    for(let key in this.state.characterList){
      if(this.state.characterList[key].id===this.state.textValue.characterId){
          character=this.state.characterList[key]
          imagePath=character.avatar[DEFAULT_AVATAR_INDEX].avatarImagePath
      }
    }

    this.setState({
      messages:this.state.messages.concat([{
        id:this.autoIncrement(),
        character:character,
        plot:this.state.textValue["plot"],
        imagePath:imagePath,
      }]),
      textValue:{
          id:"",
          characterId:"",
          plot:"",
          imagePath:"",
        },
    })
    console.log(this.state.messages)
  }

  createCharacter(input_id,input_name){
      this.setState({
      characterList:this.state.characterList.concat([{
        id:input_id,
        name:input_name,
      }]),
    });

  }
  searchTargetIndex(id,messages){
    let count=0
    //TODO::this.state.messages内のidを検索して一致したレコードを更新
    for(let key in messages){
      if(messages[key].id===id){
          return count
      }
      count++
    }
    return null
  }
  updateMessage(id,message){
    let messages=this.state.messages;
    const targetIndex = this.searchTargetIndex(id,messages);
    console.log("target Index:"+targetIndex)
//  messages:{id,characterId,plot,imagePath}
//TODO::message更新処理をdbに実装、dbからmessageを取得してstateに取り入れる

    messages[targetIndex]=message
    this.setState({
      messages:messages,
    });
  }
  render() {
    return (
      <div className="messageBox">

        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div className="mui">
      {//      <MainHeader characterList={this.state.characterList}/>
    }
            <h1>Talks</h1>
            <MessageList
              characterList={this.state.characterList}
              messages={this.state.messages}
              updateMessage={(id,message)=>this.updateMessage(id,message)}/>
            <MessageForm　
              textValue={this.state.textValue}
              characters={this.state.characterList}
              onSubmit={(e)=>this.messageSubmit(e)}
              onChange={(e)=>this.onChange(e)}/>
            <h2 className="Footer">END</h2>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default MainSection;
