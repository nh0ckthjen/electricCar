/**
* This is the Home page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Alert, TextInput, Platform } from 'react-native';
import keys from '../constants/keys'
import { Container, Content, View, Button, Left, Right, Icon, Card, Fab, cardBody, IconNB } from 'native-base';
import { Actions } from 'react-native-router-flux';
import icon from '../../assets/icon.png'
import Dialog, { DialogContent, DialogTitle} from 'react-native-popup-dialog';
import {Constants, Notifications, Permissions} from 'expo';
// Our custom files and classes import
import Text from '../component/Text';
import Navbar from '../component/Navbar';
import SideMenu from '../component/SideMenu';
import SideMenuDrawer from '../component/SideMenuDrawer';
import CategoryBlock from '../component/CategoryBlock';
import {AsyncStorage} from 'react-native';

let _interval = null;
export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            loading: false,
            inputDialog:false,
            carNumber : 0,
            id: 0,
            listCar: []
        };

    }

    handleNotification() {
        console.log("alo");
    }

    _retrieveData = async () => {
        try {
            const carsList = await JSON.parse(await AsyncStorage.getItem('carsList'));
            if (carsList !== null) {
                this.setState({listCar: carsList, id: carsList.length});
                console.log(this.state.listCar);
            } else {
                this.setState({listCar: [], id: carsList.length});
            }
        } catch (error) {
            console.log("Storage error: " + error);
        }
    };
    componentDidMount(){
        this._interval = setInterval(() => this._retrieveData(), 1000);
    }


    componentWillUnmount() {
        clearInterval(this._interval);
    }
    // async componentDidMount(){
    //     await this._retrieveData();
    //     //Ask for Notification permissions for ios devices
    //     let result = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //
    //     if (Constants.isDevice && result.status === 'granted') {
    //         console.log('Notification permissions granted.')
    //     }
    //     if (Platform.OS === 'android') {
    //         Expo.Notifications.createChannelAndroidAsync('reminders', {
    //             name: 'Nhắc nhở',
    //             priority: 'max',
    //             vibrate: [0, 250, 250, 250],
    //             sound: true,
    //             icon: icon
    //         });
    //     }
    //
    //
    //     // If we want to do something with the notification when the app
    //     // is active, we need to listen to notification events and
    //     // handle them in a callback
    //     Notifications.addListener(this.handleNotification);
    //     const localNotification = {
    //         title: 'Thông báo',
    //         body: 'Chó Vũ !Ngạc nhiên chưa!',
    //         android:{
    //             channelId : "reminders"
    //         },
    //
    //
    //     };
    //
    //     const schedulingOptions = {
    //         time: (new Date()).getTime() + 5000,
    //     }
    //
    //     // Notifications show only when app is not active.
    //     // (ie. another app being used or device's screen is locked)
    //     Notifications.scheduleLocalNotificationAsync(
    //         localNotification, schedulingOptions
    //     );
    // }
    async addCar(){
        let newId = this.state.id + 1;
        let newCar = {
            id : newId,
            carNumber: this.state.carNumber,
            startTime: new Date().toLocaleString(),
            status: keys.booked,
            prepay: false,
            prepayHistory: [],
            transfer :false,
            transferHistory: [],

        }

        let newList = this.state.listCar;
        newList.push(newCar);
        this.setState({id : newId, listCar : newList, inputDialog : false});
        this._storeData(newList);
        this._retrieveData();
    }
    _storeData = async (list) => {
        try {
            await AsyncStorage.setItem('carsList', JSON.stringify(list));
        } catch (error) {
            console.log("Storage error: " + error);
        }
    };

    _clearData = async () => {
        try {
            await AsyncStorage.clear();
            Alert.alert("Đã clear");
        } catch (error) {
            console.log("Storage error: " + error);
        }
    };
  render() {
    var left = (
      <Left style={{flex:1}}>
        <Button onPress={() => this._sideMenuDrawer.open()} transparent>
          <Icon name='md-menu' />
        </Button>
      </Left>
    );


    return(
      <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
          <Container>
              <Dialog
                  visible={this.state.inputDialog}
                  onTouchOutside={() => {
                      this.setState({ inputDialog: false });
                  }}
                  dialogTitle={<DialogTitle title="Thêm xe" />}
              >
                  <DialogContent>
                      <TextInput rowSpan={1} style={{width: 300, height: 45}} bordered placeholder="Nhập số xe"
                                 onChangeText={(text) => this.setState({carNumber: text})}/>
                      <Button style={styles.dialogBtn}
                              onPress={() => {this.addCar()}}>
                          <Text>Thêm xe</Text>
                      </Button>
                  </DialogContent>
              </Dialog>
            <Navbar left={left} title="Electric Car" />
            <Content>
              {this.renderCategories()}
            </Content>

                  <Fab
                      containerStyle={{}}
                      style={{ backgroundColor: "#5067FF" }}
                      position="bottomRight"
                      onPress={() => {this.setState({inputDialog: true})}}
                  >
                      <IconNB name="md-add" />
                      {/*<Button style={{ backgroundColor: "#34A34F" }} onPress={() => this._clearData()}>*/}
                          {/*<IconNB name="logo-whatsapp" />*/}
                      {/*</Button>*/}
                  </Fab>

          </Container>
      </SideMenuDrawer>

    );
  }

  renderCategories() {
    let cat = [];
    for(var i=0; i<this.state.listCar.length; i++) {
      cat.push(
        <CategoryBlock key={this.state.listCar[i].id} id={this.state.listCar[i].id} car={this.state.listCar[i]}/>
      );
    }
    return cat;
  }

}
const pc35 ="35%";
const styles = {
    dialogBtn:{
        marginLeft: pc35,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:"green",
        color:"white"
    }
};

var categories = [
  {
    id: 1,
    carNumber: 10,
    startTime: new Date().toLocaleTimeString()
  }

];
