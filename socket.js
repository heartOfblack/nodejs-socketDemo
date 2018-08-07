/*除了net 模块来自node，其余都是非必须模块，log是自己的一个日志模块，主要是socketServer,socketPort
socketServer为 IP地址 string ,
socketPort为端口 int
此处为 10.60.7.9:9999

服务端TCP测试工具可以使用 hercules SETUP 或者sokit
*/

import net from 'net'
import {socketServer,socketPort,LOG_TYPE} from '../app.config';
import log from './log'

class socket{
constructor(){

this.clientSocket;
this.initSocket();
this.timeout;
this.closeMark=false;//关闭标识，为true时，断开不再重连
}

initSocket=()=>{
    this.clientSocket=new net.Socket();
    let client=this.clientSocket;
    let _t=this;
    client.connect(socketPort, socketServer, function() {  
      console.log('连接SOCKET成功');
      log.log(LOG_TYPE.socketConnect,LOG_TYPE.SUCCESS);
        _t.heartStart();

  });
  

  client.on('data', function(data) {
      console.log('收到socket信息' + data);
      //判断收到的PING消息如果收到PING的回复，则停止计时器
      if(data==1){
        _t.heartReset();
      }     
  });
  
  client.on('close', function() {
      console.log('SOCKET关闭');
      log.log(LOG_TYPE.socketClose)
      !_t.closeMark&&_t.initSocket();
  });

  client.on('error', function(err) {

});
  
  }

heartStart(){
this.clientSocket.write('ping');
//15s钟都没有清除这个定时器说明没有收到服务器消息，则立马断开连接
this.timeout=setTimeout(()=>{
this.clientSocket.destroy()
},15*1e3);

}


heartReset(){
clearTimeout(this.timeout);
this.heartStart()
}
//断开连接不再重连
socketClose(){
this.closeMark=true;
this.clientSocket.destroy();

}


}

export default socket