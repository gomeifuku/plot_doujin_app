import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import './MainSection.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from 'material-ui/AppBar'
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import Dialog from 'material-ui/Dialog';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { MenuList, MenuItem } from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton';
import HomeIcon from 'material-ui-icons/Home';
import AddIcon from 'material-ui-icons/Add';
import Snackbar from 'material-ui/Snackbar';
import avatar_img from '../../public/avatar.jpg';
import avatar_img2 from '../../public/avatar2.png';
import 'typeface-roboto'
import TestComponent from './TestComponent';
import KeyHandler, {KEYDOWN} from 'react-key-handler';
const DEFAULT_AVATAR_INDEX = 0
//TODO::連想配列に関して，いちいち属性増えた時直すの面倒だから型を決めて変数入力するだけのジェネレータを作っておく
//↑TypeScriptを使う
injectTapEventPlugin()

//Todo:characterを作成するためのボタン
class CreateCharacterItem extends Component{
  constructor(){
    super()
    this.state={
      modalIsOpen:false,
      newCharacterStates:{
        id:"",
        name:"",
        avatar:[{
          id : 1,
          emo : "",
          avatarImagePath : avatar_img
        }],
        basicEmotion:""
      },
    }
  }
  textChange(event){
    let formInput=this.state.newCharacterStates
    formInput[event.key]=event.text;
    this.setState({
      newCharacterStates:formInput,
    });
  }
  createCharacter(event){
    event.preventDefault()
    this.props.createCharacter(this.state.newCharacterStates)
    this.setState({
      newCharacterStates:{
        id:"",
        name:"",
        avatar:[{
          id : 1,
          emo : "通常",
          avatarImagePath : avatar_img
        }],
        basicEmotion:"",
      }
    })
  }
  render(){
    return(
        <div className="modalCreateCharacter">
          <Dialog
            title ="Create New Character"
            open={this.props.isOpen}
            >
            <div className="modalCreateCharacterForm">
              <form className="messageForm" onSubmit={(event)=> this.createCharacter(event)}>
                <TextField
                  label="ID"
                  onChange={event=>this.textChange({
                    key:"id",
                    text:event.target.value
                  })}
                  value={this.state.newCharacterStates.id}
                />
                <TextField
                 label="名前"
                 onChange={event=>this.textChange({
                   key:"name",
                   text:event.target.value
                 })}
                 value={this.state.newCharacterStates.name}
                 />
                <input type="submit" value="Post"></input>
              </form>
           </div>
          </Dialog>
        </div>
      )
  }
}
class CharacterListDialog extends Component{
  renderCharacterList(){
    const list=this.props.characterList.map((component,index)=>{
      return(
        <div
          key={index}
          className="dialog-character-record"
          onClick={event=>{
            this.props.updateCharacter({
              character:component,
              imagePath:component.avatar[DEFAULT_AVATAR_INDEX].avatarImagePath
            })
            this.props.selectRecordComponent(event)
          }}>
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
  doubleClickAvatar(event){
    this.props.selectRecordComponent({
      component:event.currentTarget.id
    })
    event.stopPropagation()
  }
  render(){
    return(
      <span
        id={this.props.id}
        onDoubleClick={(event)=>this.doubleClickAvatar(event)}>
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
        <div key={index}>
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

  doubleClickText(event){
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
        onDoubleClick={e=>this.doubleClickText(e)}>
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
  selectRecord(event){
    this.props.selectRecord({id:this.props.component.id,key:{shiftKey:event.shiftKey,altKey:event.altKey}})
    event.stopPropagation()
  }
  render(){
    let isEditing=(this.props.component.id===this.props.editTarget.id)
    let devStyle={backgroundColor:"blue"}
    if(this.props.isSelect){
      devStyle={backgroundColor:"red"}
    }
    return(
    <div>
      {//TODO::DIALOGはRecordの上に移動
      }
      <span
      className="message-dialog">
      <CharacterListDialog
        id={this.avatarDialog}
        isOpen={isEditing&&this.props.editTarget.component===this.avatarId}
        onClick={event=>{event.stopPropagation()}}
        characterList={this.props.characterList}
        updateCharacter={(event)=>this.updateCharacter(event)}
        selectRecordComponent={
          event=>this.props.selectRecordComponent({
            id:null,
            component:null
        })}/>
      </span>
      <span
        id="message-record"
        onClick={event=>{this.selectRecord(event)}}
        style={devStyle}>
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
      </span>
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
      },
      selectedRecord:[],
    }
  }
  insertIndex(arr,key){
    let index=arr.indexOf(key)
    if(index !== -1){
      arr.splice(index,1)
    }
    arr.push(key)
  }
  selectRecord(event){
    let sel=this.state.selectedRecord

    if(event.key.shiftKey){
      //T.B.D
    }else if(event.key.altKey){
      this.insertIndex(sel,event.id)
    }else{
      sel=[]
      this.insertIndex(sel,event.id)
    }
    this.setState({
      selectedRecord :sel
    })
    console.log("selectRecord")
    console.log(sel)

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
  deleteRecord(idList){
      for(let key in idList){
        console.log("key is "+ idList[key])
        this.props.deleteMessage(idList[key])
      }
      this.setState({
        selectedRecord:[]
      })
  }
  resetTarget(event){
    this.setState({
      editTarget:{
        id:null,
        component:null
      }
    })
  }
  cancelSelectRecord(event){
    this.setState({
      selectedRecord:[]
    })
  }
  renderList(){
      const list=this.props.messages.map((component,index)=>{
        return (
        <div key={index}>
            <MessageRecord
              component={component}
              characterList={this.props.characterList}
              editTarget={this.state.editTarget}
              isSelect={(this.state.selectedRecord.indexOf(component.id)!=-1)}
              selectRecord={event=>this.selectRecord(event)}
              selectRecordComponent={event=>this.selectRecordComponent(event)}
              updateRecord={event=>this.updateRecord(event)}
            />
        </div>
      )})
    return list
  }
  render() {
    const DELETE = 8
    return (
      <div
        className="messageList"
        onClick={e=>this.cancelSelectRecord(e)}
        onDoubleClick={e=>this.resetTarget(e)}>
        <KeyHandler
          keyEventName={KEYDOWN}
          keyCode={DELETE}
          onKeyHandle={event=>
            {
                console.log("delete")
                this.deleteRecord(this.state.selectedRecord)
            }}/>
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
            label="キャラクター"
            value={this.props.textValue["characterId"]}
            onChange={ev=>this.handleChange("characterId",ev.target.value)}/>
          <TextField
            label="メッセージ"
            value={this.props.textValue["plot"]}
            onChange={ev=>this.handleChange("plot",ev.target.value)}
           />
          <input type="submit" value="Post"></input>
        </form>
      </div>
    );
  }
}

class MainHeader extends Component {
  constructor(){
    super();
    this.state={
      isCharacterListOpen:false,
      isCreateCharacterFormOpen:false,
    }
  }
  renderCharacterList(){
    const list=this.props.characterList.map((component,index)=>{
      return(
        <MenuItem onClick={this.handleClose} key={index}>
            @{component.id}:{component.name}<Avatar src={component.avatar[0].avatarImagePath}/>
        </MenuItem>
      );
    })
    return list;
  }

  toggleCharacterList = (event) =>{
    this.setState({
      isCharacterListOpen:!this.state.isCharacterListOpen
    })
  }
  toggleCreateCharacterForm= (event) =>{
    this.setState({
      isCreateCharacterFormOpen:!this.state.isCreateCharacterFormOpen
    })
  }
  createCharacter(character){
    const isSuccess=this.props.updateCharacterList(character)
    if(isSuccess){
      this.setState({
        isCreateCharacterFormOpen:false
      })
    }
    return isSuccess
  }
  render(){
    return(
      <div className="MainHeader">
        <CreateCharacterItem
          isOpen={this.state.isCreateCharacterFormOpen}
          createCharacter={e=>{this.createCharacter(e)}}/>
        <Drawer
          anchor="left"
          open={this.state.isCharacterListOpen}
          title="plot-doujin-app"
          onClose={event=>this.toggleCharacterList(event)}>
          <MenuList>
            {this.renderCharacterList()}
            <MenuItem
              onClick={e=>this.toggleCreateCharacterForm(e)}>
              {"Add Characeter "}
              <Avatar >
                <AddIcon/>
              </Avatar>
            </MenuItem>
          </MenuList>
        </Drawer>
                  {/*Fix::メニューが開かない、こまった  　=>ボタンだけでDrawerを表示 */ }
        <AppBar position="static" color="default" title="plotApp" >
          <IconButton
            onTouchTap = {(event)=>{this.toggleCharacterList(event)}}>
            <HomeIcon />
          </IconButton>
        </AppBar>
      </div>
    )
  }
}

class MainSection extends Component {
  constructor(){
    super();
    this.state={
      isOpenErrorBar:false,
      errorMessage:"",
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
      };
    values[e.key]=e.text
    this.setState({
      textValue:values,
      }
   )

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
  updateCharacterList(character){
    this.setState({
      characterList:this.state.characterList.concat(character)
    })
    console.log(character)
    return true
  }
  autoIncrement(){
    const id=this.state.emptyId
    this.setState({
      emptyId:this.state.emptyId+1,
    })
    return id
  }
  checkText(textValue){
    return (textValue.plot!==""&&textValue.characterId!=="")
  }
  showErrorMessage(errorText){
    this.setState({
      isOpenErrorBar:true,
      errorMessage:errorText,
    })
  }
  closeErrorMessage(){
    this.setState({
      isOpenErrorBar:false,
      errorMessage:""
    })
  }
  messageSubmit=(e)=>{
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
    if(this.checkText(this.state.textValue)){
      this.setState({
        messages:this.state.messages.concat([{
          id:this.autoIncrement(),
          character:character,
          plot:this.state.textValue["plot"],
          imagePath:imagePath,
        }]),
        textValue:{
            id:"",
            characterId:this.state.textValue.characterId,
            plot:"",
            imagePath:"",
          },
      })
    }else{
      this.showErrorMessage("メッセージを入力してください")
    }
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
    // console.log("target Index:"+targetIndex)
//  messages:{id,characterId,plot,imagePath}
//TODO::message更新処理をdbに実装、dbからmessageを取得してstateに取り入れる
    if(message.plot!==null){
      messages[targetIndex]=message
      this.setState({
        messages:messages,
      })
    }else{
      this.deleteMessage(id)
    }
  }
  deleteMessage(id){
    let messages=this.state.messages
    const index=this.searchTargetIndex(id,messages)
    if(index!=null){
      messages.splice(index,1)
      this.setState({
        messages:messages
      })
    }
  }
  render() {
    return (
      <div className="messageBox">
          <div className="mui">
           <MainHeader
             characterList={this.state.characterList}
             updateCharacterList={character=>this.updateCharacterList(character)}/>
            <h1>Talks</h1>
            <MessageList
              characterList={this.state.characterList}
              messages={this.state.messages}
              updateMessage={(id,message)=>this.updateMessage(id,message)}
              deleteMessage={id=>this.deleteMessage(id)}/>
            <MessageForm　
              textValue={this.state.textValue}
              characters={this.state.characterList}
              onSubmit={(e)=>this.messageSubmit(e)}
              onChange={(e)=>this.onChange(e)}/>
            <h2 className="Footer">END</h2>
              <Snackbar
                open={this.state.isOpenErrorBar}
                message={this.state.errorMessage}
                autoHideDuration={2000}
                onClose={event=>this.closeErrorMessage(event)}
              />
          </div>
      </div>
    );
  }
}

export default MainSection;
