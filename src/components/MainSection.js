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

//連想配列に関して，いちいち属性増えた時直すの面倒だから型を決めて変数入力するだけのジェネレータを作っておく
injectTapEventPlugin();
//---------------------Component Test Field---------------------------------
class TestFormChildren extends Component{

  render(){

    if(this.props.openId==this.props.formId&&this.props.isOpen){
      return(
        <TextField
         floatingLabelText="プロット"
         floatingLabelFixed={true}
       />
      );
    }else{
      return(

        <div onClick={e=>{this.props.onClick(this.props.formId)}}>
          hoge:{this.props.formId}
        </div>
      );
    }
  }
}
class TestForm extends Component{

  renderTextList(){
    const arr=[1,2,3,4,5];
    const list=arr.map((component)=>{
      return(
        <TestFormChildren formId={component} openId={this.props.openId} onClick={(id)=>{this.props.changeOpenId(id)}} isOpen={this.props.isOpen}/>
      );
    })
    return list;
  }
  render(){
    return(
      <div className="testList" onClick={e=>{this.props.closeChildren()}}>
        {this.renderTextList()}
      </div>
    );
  }
}
 class TestFormParent extends Component{

   constructor(){
     super();
     this.state={
       isOpen:false,
       openId:"2",
     }
   }
   changeOpenId(id){
     console.log("call changeOpenId() set ",id)
     this.setState({
       openId:id,
       isOpen:true,
     })
   }
   closeChildren(){
     console.log("call closeChildren");
     this.setState({
       isOpen:false,
     })
   }
   render(){
     return(
         <TestForm openId={this.state.openId} changeOpenId={(id)=>this.changeOpenId(id)} isOpen={this.props.isOpen} closeChildren={(e)=>this.closeChildren()}/>
     );
   }
 }
 //-----------------------------------------------------------------------

//Todo:characterを作成するためのボタン
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
          //多分最初にタップを入力として受け付ける関数の呼び出しがされてないのが
         //onTouchTapとメニューが開かない原因だと思われる
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

class MessageAvatar extends Component{
  render(){
    return(
      <Avatar
      src={this.props.imagePath}
      size={30}
      onClick={(event)=>this.props.onClick(event)}/>
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
var textValue;
class EditableText extends Component{

  constructor(){
    super();
    this.state={
      isEditing:false,
    }
  }
  handleChange(event){
    textValue=event.target.value;
  }
  handleSubmit(event){
    event.preventDefault();
    this.setState({
      isEditing:false,
    });
    this.props.onSubmit(textValue);
  }

  renderTextEdit(){
    if(!this.state.isEditing){
      return(
        <span  onDoubleClick={e=>{this.setState({isEditing:true});this.props.onDoubleClick(e);}}>{this.props.textValue}</span>
      );
    }else{
      return(
        <span className="messageListForm" >
          <form onSubmit={(event)=> this.handleSubmit(event)}>
            <TextField className="messageListFormTextField" defaultValue={this.props.textValue} onChange={event=>this.handleChange(event)}/>
          </form>
        </span>
      );
    }
  }

  render(){
    return(
      <span className="EditableText">
        {this.renderTextEdit()}
      </span>
    );
  }
}
class MessageList extends Component{
  constructor(){
    super();
    this.state={
      open:false,
      changeValue:"",
      messageId:"",
    }
  }
  handleChooseAvater(chooseValue){
    this.props.changeMessage("imagePath",this.state.messageId,chooseValue);
    console.log("chooseValue()",chooseValue);
    this.setState({
      open:false,
    });
  }
  handleChangeText(changeValue,key){
    this.props.changeMessage(key,this.state.messageId,changeValue);
    console.log("changeValue()",changeValue);
  }
  renderAvatarLists(){
      const avatarLists=this.props.avatars.map((component,index)=>{
        return(
          <Avatar src={component.imagePath} onClick={(event)=>this.handleChooseAvater(component.imagePath)}/>
        );
      })
      return avatarLists;
  }
  onSelect(){
    this.setState({
      open:true,
  //z    messageId:component.id
    });
  }
  renderList(){
    const lists=this.props.messages.map((component,index) =>{
      return (
        <div>
            <MessageAvatar imagePath={component.imagePath} onClick={(event)=>{this.onSelect()}}/>  <EditableText textValue={component.characterId} onDoubleClick={(event)=>{this.onSelect()}} onSubmit={(changeValue)=>this.handleChangeText(changeValue,"characterId")}/> ： <EditableText textValue={component.plot} onDoubleClick={(event)=>{this.onSelect()}} onSubmit={(changeValue)=>this.handleChangeText(changeValue,"plot")}/>
            <Dialog
              title="Please Select Avatar"
              modal={true}
              open={this.state.open}
            >
              {this.renderAvatarLists()}
            </Dialog>
        </div>
      );
    })
    return lists;
  }

  render() {
    return (
      <div className="messageList">
        {this.renderList()}
      </div>
    );
  }
}

class MessageForm extends Component{
  handleSubmit(event){
    event.preventDefault();
    this.props.onSubmit(this.refs.id.value.trim());

  }

  handleChange(key,newValue){
    this.props.onChange(key,
      newValue);
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
           floatingLabelText="プロット"
           ref="plot"
           value={this.props.textValue["plot"]}
           onChange={ev=>this.handleChange("plot",ev.target.value)}
           />
          <input type="hidden" ref="id" value="test"></input>
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
      emptyId:3,
      newCharacterState:"",
      characterList:[
        {id:"test1",
         name:"テスト太郎",
       },
       {
         id:"test2",
         name:"テスト次郎",
       }
     ],
      messages:[
        {
          id:1,
          characterId:"test1",
          plot:"aaaaa",
          imagePath:"",
        },
        {
          id:2,
          characterId:"test2",
          plot:"bbbbb",
          imagePath:"",
        }
      ],
      avatars:[
        {
          characterId:"test1",
          imagePath:avatar_img
        },
        {
          characterId:"test2",
          imagePath:avatar_img2
        }
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
  onChange(key,text){
    const values=
      {
        characterId:this.state.textValue["characterId"],
        plot:this.state.textValue["plot"],
        imagePath:avatar_img,
      };　
    values[key]=text;
    this.setState({
      textValue:values,
      }
    );

    if(text!=""){
      var lists=[];
      for (var index = 0; index < this.state.characterList.length; index++) {
        if(this.state.characterList[index]["id"].startsWith(text)){
          lists.push(this.state.characterList[index]["id"])
        }
      }
    }else{
      lists=[];
    }
    this.setState({
      hintlist:lists,
    });
  }
  autoIncrement(){
    const id=this.state.emptyId;
    this.setState({
      emptyId:this.state.emptyId+1,
    });
    return id;
  }
  onSubmit(){
    console.log("MessageBox::onSubmit()");
    console.log(this.state.textValue);
    console.log(this.state.emptyId);
    this.setState({
      messages:this.state.messages.concat([{
        id:this.autoIncrement(),
        characterId:this.state.textValue["characterId"],
        plot:this.state.textValue["plot"],
        imagePath:this.state.textValue["imagePath"],
      }]),
      textValue:{
          id:"",
          characterId:"",
          plot:"",
          imagePath:"",
        },
    });
  }

  createCharacter(input_id,input_name){
    //FIX::idにかぶりがないか確認
    //name以外の詳細をこの時点で決めるか考える(とりあえずアバターくらいはつけてもいいかな)
    //
    this.setState({
      characterList:this.state.characterList.concat([{
        id:input_id,
        name:input_name,
      }]),
    });

  }
  changeMessage(key,messageId,changeValue){
    let messages=this.state.messages;
    //とりあえず該当のメッセージ（１レコード）を表示させる。
    console.log(key,messageId);

//  messages:{id,characterId,plot,imagePath}
    messages[messageId-1][key]=changeValue;
    this.setState({
      messages:messages,
    });
  }
  render() {
    return (
      <div className="messageBox">

        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div className="mui">
            <MainHeader characterList={this.state.characterList}/>
            <h1>Talks</h1>
            <MessageList messages={this.state.messages} avatars={this.state.avatars} changeMessage={(key,messageId,changeValue)=>this.changeMessage(key,messageId,changeValue)}/>
            <MessageForm　textValue={this.state.textValue} onSubmit={()=>this.onSubmit()} onChange={(key,text)=>this.onChange(key,text)}/>
            <div>入力中{this.state.textValue["plot"]}</div>
            <MessageHint  hintlist={this.state.hintlist}/>
            <CreateCharacterButton createCharacter={(input_id,input_name)=>this.createCharacter(input_id,input_name)}/>
              <h2 className="Footer">END</h2>
              <div onClick={(event)=>{console.log("clickされたよ");}} draggable="true">
                tetetetesssss
              </div>

            <div className="test">
              <TestFormParent />
            </div>

          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default MainSection;
