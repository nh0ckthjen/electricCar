/**
 *
 */
// React native and others libraries imports
import React, { Component } from 'react';
import { View, Title, Left, Button, Icon } from 'native-base';
import Dialog, { DialogContent, DialogTitle, DialogFooter, DialogButton } from 'react-native-popup-dialog';

// Our custom files and classes import
import Colors from '../Colors';
import Text from "./Text";

export default class PopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DialogVisible: this.props.DialogVisible,

        };
    }

    _caculateTime(startTime){
        let start = new Date(startTime);
        let now = new Date();
        let time = now - start;

        time = new Date(time);
        if (time.getUTCHours() > 0){
            return time.getUTCHours() + " giờ " + time.getUTCMinutes() + " phút";
        }
        return time.getUTCMinutes() + " phút " + time.getUTCSeconds() + " giây";
    }
    checkOut(){

    }

  render() {
    return(
        <Dialog
            visible={this.state.DialogVisible}
            onTouchOutside={() => {this.setState({ DialogVisible: false });
            }}
            dialogTitle={<DialogTitle title="Thanh toán" />}
        >
            <DialogContent>
                <View style={styles.text}>
                    <Text style={styles.subtitle}>Đã chơi:</Text>
                    <Text style={styles.time}>{this._caculateTime(this.props.car.startTime)}</Text>
                </View>
                <Text>Số tiền: 20.000 VNĐ</Text>
                <Text>{this.props.DialogVisible}</Text>

                <Button style={styles.dialogBtn}
                        onPress={() => {this.checkOut()}}>
                    <Title>Xác nhận</Title>
                </Button>
            </DialogContent>
        </Dialog>
    );
  }
}

const styles={
  body: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },
    text:{
        flexDirection: 'row',
    },
};
