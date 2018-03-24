import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as MutableBuffer from 'mutable-buffer';

declare let chrome;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  socket: any;
  message: MutableBuffer;

  constructor(public navCtrl: NavController) {
    this.message = new MutableBuffer();
  }

  TcpTest() {
    this.message.write("Please receive this text");
    this.openTcp({
      address: '192.168.1.100',
      port: 9100
    }, (result) => {
      this.writeTcp( (result) => {
        this.closeTcp();
      });
    });
  }


  openTcp(options: any, callback: any) {
    chrome.sockets.tcp.create({}, async createInfo => {
      this.socket = createInfo.socketId;
      chrome.sockets.tcp.connect(this.socket, options.address, options.port, (result) => {
        console.log('Connected to server');
        if (callback) callback(result);
      });
    });
  }

  writeTcp(callback) {
    let buffer = this.message.flush().buffer;
    chrome.sockets.tcp.send(this.socket, buffer, (result) => {
      console.log(result);
      if (callback) callback(result);
    });
  }

  closeTcp(callback: any = null) {
    chrome.sockets.tcp.close(this.socket, () => {
      if (callback) callback();
    });
  }
}

