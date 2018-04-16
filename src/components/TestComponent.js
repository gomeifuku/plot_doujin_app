import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import './MainSection.css';

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
 class TestComponent extends Component{

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

 export default TestComponent;
