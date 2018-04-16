import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import './MainSection.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Snackbar from 'material-ui/Snackbar';
import avatar_img from '../../public/avatar.jpg';
import avatar_img2 from '../../public/avatar2.png';
import 'typeface-roboto'
import MessageList from './MessageList';
import MessageForm from './MessageForm';
import MainHeader from './MainHeader';
import TestComponent from './TestComponent';
const DEFAULT_AVATAR_INDEX = 0

//TODO::連想配列に関して，いちいち属性増えた時直すの面倒だから型を決めて変数入力するだけのジェネレータを作っておく
//↑TypeScriptを使う
injectTapEventPlugin()


class MainSection extends Component {
  constructor() {
    super();
    this.state = {
      isOpenErrorBar: false,
      errorMessage: "",
      emptyId: 10, //最新の未割当id
      characterList: [{
          id: "test1",
          name: "テスト太郎",
          avatar: [
            {
              id: 1,
              emo: "通常",
              avatarImagePath: avatar_img
            }, {
              id: 2,
              emo: "笑い",
              avatarImagePath: avatar_img
            }
          ],
          basicEmotion: "笑い"
        }, {
          id: "test2",
          name: "テスト次郎",
          avatar: [
            {
              id: 1,
              emo: "通常",
              avatarImagePath: avatar_img2
            }, {
              id: 2,
              emo: "笑い",
              avatarImagePath: avatar_img2
            }
          ],
          basicEmotion: "笑い"
        }
      ],
      messages: [
        {
          id: 1,
          character: {
            id: "test1",
            name: "テスト太郎",
            avatar: []
          },
          plot: "aaaaa",
          imagePath: ""
        }
      ],

      textValue: {
        id: "",
        characterId: "",
        plot: "",
        imagePath: ""
      },
      hintlist: []
    }
  }
  onChange(e) {
    const values = {
      characterId: this.state.textValue["characterId"],
      plot: this.state.textValue["plot"]
    };
    values[e.key] = e.text
    this.setState({textValue: values})

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
  checkInputCharacterInfo(newCharacter){
    if(newCharacter.id==="" || newCharacter.name===""){
      this.showErrorMessage("情報を入力してください")
      return false
    }
    for(let i in this.state.characterList){
      console.log(i)
      if(this.state.characterList[i].id===newCharacter.id){
        this.showErrorMessage("このIDは既に使われています")
        return false
      }
    }
    return true
  }
  updateCharacterList(newCharacter) {
    const isSuccess=this.checkInputCharacterInfo(newCharacter)
    if(isSuccess){
      this.setState({characterList: this.state.characterList.concat(newCharacter)})
    }
    console.log(newCharacter)
    return isSuccess
  }
  autoIncrement() {
    const id = this.state.emptyId
    this.setState({
      emptyId: this.state.emptyId + 1
    })
    return id
  }
  checkText(textValue) {
    return (textValue.plot !== "" && textValue.characterId !== "")
  }
  showErrorMessage(errorText) {
    this.setState({isOpenErrorBar: true, errorMessage: errorText})
  }
  closeErrorMessage() {
    this.setState({isOpenErrorBar: false, errorMessage: ""})
  }
  messageSubmit = (e) => {
    let character = {
      id: this.state.textValue.characterId,
      name: "名無し"
    }
    let imagePath = null
    for (let key in this.state.characterList) {
      if (this.state.characterList[key].id === this.state.textValue.characterId) {
        character = this.state.characterList[key]
        imagePath = character.avatar[DEFAULT_AVATAR_INDEX].avatarImagePath
      }
    }
    if (this.checkText(this.state.textValue)) {
      this.setState({
        messages: this.state.messages.concat([
          {
            id: this.autoIncrement(),
            character: character,
            plot: this.state.textValue["plot"],
            imagePath: imagePath
          }
        ]),
        textValue: {
          id: "",
          characterId: this.state.textValue.characterId,
          plot: "",
          imagePath: ""
        }
      })
    } else {
      this.showErrorMessage("メッセージを入力してください")
    }
  }
  searchTargetIndex(id, messages) {
    let count = 0
    //TODO::this.state.messages内のidを検索して一致したレコードを更新
    for (let key in messages) {
      if (messages[key].id === id) {
        return count
      }
      count++
    }
    return null
  }
  updateMessage(id, message) {
    let messages = this.state.messages;
    const targetIndex = this.searchTargetIndex(id, messages);
    // console.log("target Index:"+targetIndex)
    //  messages:{id,characterId,plot,imagePath}
    //TODO::message更新処理をdbに実装、dbからmessageを取得してstateに取り入れる
    if (message.plot !== null) {
      messages[targetIndex] = message
      this.setState({messages: messages})
    } else {
      this.deleteMessage(id)
    }
  }
  deleteMessage(id) {
    let messages = this.state.messages
    const index = this.searchTargetIndex(id, messages)
    if (index != null) {
      messages.splice(index, 1)
      this.setState({messages: messages})
    }
  }
  render() {
    return (<div className="messageBox">
      <div className="mui">
        <MainHeader characterList={this.state.characterList} updateCharacterList={character => this.updateCharacterList(character)}/>
        <h1>Talks</h1>
        <MessageList characterList={this.state.characterList} messages={this.state.messages} updateMessage={(id, message) => this.updateMessage(id, message)} deleteMessage={id => this.deleteMessage(id)}/>
        <MessageForm textValue={this.state.textValue} characters={this.state.characterList} onSubmit={(e) => this.messageSubmit(e)} onChange={(e) => this.onChange(e)}/>
        <h2 className="Footer">END</h2>
        <Snackbar open={this.state.isOpenErrorBar} message={this.state.errorMessage} autoHideDuration={2000} onClose={event => this.closeErrorMessage(event)}/>
      </div>
    </div>);
  }
}

export default MainSection;
