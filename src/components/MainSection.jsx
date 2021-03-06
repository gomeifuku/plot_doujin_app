import React, { Component } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import AvatarImg from '../../public/avatar.jpg'
import AvatarImg2 from '../../public/avatar2.png'
import 'typeface-roboto'
import MessageList from './MessageList'
import MessageForm from './MessageForm'
import MainHeader from './MainHeader'
import CssBaseline from '@material-ui/core/CssBaseline'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import theme from './MainSection.style'

const DEFAULT_AVATAR_INDEX = 0

class MainSection extends Component {
  constructor() {
    super()
    this.state = {
      isOpenErrorBar: false,
      errorMessage: '',
      emptyId: 10, // 最新の未割当id
      characterList: [
        {
          id: 'test1',
          name: 'テスト太郎',
          avatar: [
            {
              id: 1,
              emo: '通常',
              avatarImagePath: AvatarImg,
            },
            {
              id: 2,
              emo: '笑い',
              avatarImagePath: AvatarImg,
            },
          ],
          basicEmotion: '笑い',
        },
        {
          id: 'test2',
          name: 'テスト次郎',
          avatar: [
            {
              id: 1,
              emo: '通常',
              avatarImagePath: AvatarImg2,
            },
            {
              id: 2,
              emo: '笑い',
              avatarImagePath: AvatarImg2,
            },
          ],
          basicEmotion: '笑い',
        },
      ],
      messages: [
        {
          id: 1,
          character: {
            id: 'test1',
            name: 'テスト太郎',
            avatar: [],
          },
          plot: 'aaaaa',
          imagePath: '',
        },
      ],

      textValue: {
        id: '',
        characterId: '',
        plot: '',
        imagePath: '',
      },
      hintlist: [],
    }
  }

  onChange(e) {
    const values = {
      characterId: this.state.textValue.characterId,
      plot: this.state.textValue.plot,
    }
    values[e.key] = e.text
    this.setState({ textValue: values })
  }

  checkInputCharacterInfo(newCharacter) {
    if (newCharacter.id === '' || newCharacter.name === '') {
      this.showErrorMessage('情報を入力してください')
      return false
    }
    for (const i in this.state.characterList) {
      console.log(i)
      if (this.state.characterList[i].id === newCharacter.id) {
        this.showErrorMessage('このIDは既に使われています')
        return false
      }
    }
    return true
  }

  updateCharacterList(newCharacter) {
    const isSuccess = this.checkInputCharacterInfo(newCharacter)
    if (isSuccess) {
      this.setState({
        characterList: this.state.characterList.concat(newCharacter),
      })
    }
    console.log(newCharacter)
    return isSuccess
  }

  autoIncrement() {
    const id = this.state.emptyId
    this.setState({
      emptyId: this.state.emptyId + 1,
    })
    return id
  }

  checkText(textValue) {
    return textValue.plot !== '' && textValue.characterId !== ''
  }

  showErrorMessage(errorText) {
    this.setState({ isOpenErrorBar: true, errorMessage: errorText })
  }

  closeErrorMessage() {
    this.setState({ isOpenErrorBar: false, errorMessage: '' })
  }

  messageSubmit(e) {
    let character = {
      id: this.state.textValue.characterId,
      name: '名無し',
    }
    let imagePath = null
    for (const key in this.state.characterList) {
      if (
        this.state.characterList[key].id === this.state.textValue.characterId
      ) {
        character = this.state.characterList[key]
        imagePath = character.avatar[DEFAULT_AVATAR_INDEX].avatarImagePath
      }
    }
    if (this.checkText(this.state.textValue)) {
      this.setState({
        messages: this.state.messages.concat([
          {
            id: this.autoIncrement(),
            character,
            plot: this.state.textValue.plot,
            imagePath,
          },
        ]),
        textValue: {
          id: '',
          characterId: this.state.textValue.characterId,
          plot: '',
          imagePath: '',
        },
      })
    } else {
      this.showErrorMessage('メッセージを入力してください')
    }
  }

  searchTargetIndex(id, messages) {
    let count = 0
    // TODO::this.state.messages内のidを検索して一致したレコードを更新
    for (const key in messages) {
      if (messages[key].id === id) {
        return count
      }
      count++
    }
    return null
  }

  updateMessage(id, message) {
    const { messages } = this.state
    const targetIndex = this.searchTargetIndex(id, messages)
    // TODO::message更新処理をdbに実装、dbからmessageを取得してstateに取り入れる
    if (message.plot !== null) {
      messages[targetIndex] = message
      this.setState({ messages })
    } else {
      this.deleteMessage(id)
    }
  }

  deleteMessage(id) {
    const { messages } = this.state
    const index = this.searchTargetIndex(id, messages)
    if (index != null) {
      messages.splice(index, 1)
      this.setState({ messages })
    }
  }

  render() {
    const { classes } = this.props
    return (
      <div className="messageBox">
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <div className="mui">
            <MainHeader
              className={classes.header}
              characterList={this.state.characterList}
              updateCharacterList={character =>
                this.updateCharacterList(character)
              }
            />
            <h1>Talks</h1>
            <MessageList
              className={classes.list}
              characterList={this.state.characterList}
              messages={this.state.messages}
              updateMessage={(id, message) => this.updateMessage(id, message)}
              deleteMessage={id => this.deleteMessage(id)}
            />
            <MessageForm
              className={classes.form}
              textValue={this.state.textValue}
              characters={this.state.characterList}
              onSubmit={e => this.messageSubmit(e)}
              onChange={e => this.onChange(e)}
            />
            <h2 className={classes.footer}>END</h2>
            <Snackbar
              open={this.state.isOpenErrorBar}
              message={this.state.errorMessage}
              autoHideDuration={2000}
              onClose={event => this.closeErrorMessage(event)}
            />
          </div>
        </MuiThemeProvider>
      </div>
    )
  }
}

export default MainSection
