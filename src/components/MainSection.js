import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';
import Modal from 'react-modal'
const TestForm = () => (

  <div className="testtest">
  <Avatar
  src="images/uxceo-128.jpg"
  size={30}
/>
  <TextField
   floatingLabelText="プロット"
   floatingLabelFixed={true}
   />
   </div>

 );
//Todo:characterを作成するためのボタン
class CreateCharacterButton extends Component{
  constructor(){
    super();
    this.state={
      modalIsOpen:false,
      newCharacter:{
        name:"",
        id:"333"
      }
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
      this.setState({modalIsOpen: false});
  }
  handleChange(key,text){
    console.log(text);
    let formInput={
      id:this.state.newCharacter["id"],
      name:this.state.newCharacter["name"],
    }
    formInput[key]=text;
    this.setState({
      newCharacter:formInput,

    });
  }
  handleClick(event){
    this.showModal();
  }
  handleSubmit(event){
    event.preventDefault();
    this.props.createCharacter(this.state.newCharacter["id"],this.state.newCharacter["name"]);
    this.closeModal();
  }
  render(){
    return(
    <div>
      <form name="createCharacterButton">
        <Modal isOpen={this.state.modalIsOpen}>
          <div className="modalCreateCharacterForm">
            <form className="messageForm" onSubmit={(event)=> this.handleSubmit(event)}>
              <TextField
                floatingLabelText="ID"
                ref="create_id"
                onChange={(event)=>this.handleChange("id",event.target.value)}
                value={this.state.newCharacter["id"]}/>
              <TextField
               floatingLabelText="名前"
               ref="create_name"
               onChange={(event)=>this.handleChange("name",event.target.value)}
               value={this.state.newCharacter["name"]}/>
              <input type="submit" value="Post"></input>
            </form>
          </div>
          <button onClick={(event)=>this.closeModal(event)}>Close</button>
        </Modal>
        <input type="button" onClick={(event)=>this.handleClick(event)} value="create character"></input>
      </form>
    </div>);
  }
};

class MessageAvater extends Component{
  render(){
    return(
      <Avatar
      src="images/uxceo-128.jpg"
      size={30} />
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

class MessageList extends Component{

  renderList(){
    const lists=this.props.messages.map((component,index) =>{
      return (
        <div>
          {component.id} {component.plot}
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
          <TextField
            floatingLabelText="キャラクター"
            ref="character"
            value={this.props.textValue["id"]}
            onChange={ev=>this.handleChange("id",ev.target.value)}/>
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

class MainSection extends Component {
  constructor(){
    super();
    this.state={
      character_list:[
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
          id:"test1",
          plot:"aaaaa",
        },
        {
          id:"test2",
          plot:"bbbbb",
        }
      ],
      textValue:{
          id:"",
          plot:"",
        },
     //userlist:["aaa","aaaaa","bbb","ccc","1234","12","123555"],
     hintlist:[],
    };
  }
  onChange(key,text){
    const values=
      {
        id:this.state.textValue["id"],
        plot:this.state.textValue["plot"],
      };
    values[key]=text;
    this.setState({
      textValue:values,
      }
    );

    if(text!=""){
      var lists=[];
      for (var index = 0; index < this.state.character_list.length; index++) {
        if(this.state.character_list[index]["id"].startsWith(text)){
          lists.push(this.state.character_list[index]["id"])
        }
      }
    }else{
      lists=[];
    }
    this.setState({
      hintlist:lists,
    });
  }

  onSubmit(){
    console.log("MessageBox::onSubmit()");
    console.log(this.state.textValue);
    this.setState({
      messages:this.state.messages.concat([{
        id:this.state.textValue["id"],
        plot:this.state.textValue["plot"],
      }]),
      textValue:{
          id:"",
          plot:"",
        },
    });
  }

  createCharacter(input_id,input_name){
    console.log("call createCharacter()");
    this.setState({
      character_list:this.state.character_list.concat([{
        id:input_id,
        name:input_name,
      }]),
    });

  }

  render() {
    return (
      <div className="messageBox">
        <h1>Tasks</h1>
        <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div className="mui">
            <MessageList messages={this.state.messages}/>
            <MessageAvater />
            <MessageForm　textValue={this.state.textValue} onSubmit={()=>this.onSubmit()} onChange={(key,text)=>this.onChange(key,text)}/>
            <div>入力中{this.state.textValue["plot"]}</div>
            <MessageHint  hintlist={this.state.hintlist}/>
            <CreateCharacterButton  createCharacter={(input_id,input_name)=>this.createCharacter(input_id,input_name)}/>
              <h2 className="Footer">END</h2>
            <div className="test">
              <TestForm />
            </div>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default MainSection;
