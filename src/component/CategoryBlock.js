/**
* This is the category component used in the home page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import {Image, Dimensions, TouchableOpacity, Alert, AsyncStorage} from 'react-native';
import { View, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import keys from '../constants/keys';
import PopUp from './PopUp'


// Our custom files and classes import
import Text from './Text';

export default class CategoryBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
    _caculatePrice(startTime){
        let start = new Date(startTime);
        let now = new Date();
        let time = now - start;
        time = new Date(time);
            if (time.getUTCMinutes() > 5){
                return (time.getUTCHours() + 1) * 10000;
            } else {
                return 0;
            }

    }
   _okPress = async (id) => {
        try {
            const carsList = await JSON.parse(await AsyncStorage.getItem('carsList'));
            if (carsList !== null) {
                carsList.map((car) => {
                    if(car.id == id){
                        car.status = keys.idle;
                        car.prepay = false;
                        car.transfer = false;
                    }
                });
            }
            console.log(carsList);
            this._storeData(carsList);
        } catch (error) {
            console.log("Storage error: " + error);
        }
    }
    _storeData = async (list) => {
        try {
            await AsyncStorage.setItem('carsList', JSON.stringify(list));
        } catch (error) {
            console.log("Storage error: " + error);
        }
    };
    _checkOutBtn(car){
        Alert.alert(
            'Thanh toán',
            `Xe số: ${car.id} \nGiờ chơi: ${this._caculateTime(car.startTime)}\nThành tiền: ${this._caculatePrice(car.startTime)} VNĐ`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => this._okPress(car.id),
                }
            ],
            { cancelable: false });
    }

    _checkInBtn(car){
        Alert.alert(
            'Thuê xe',
            `Xe số: ${car.carNumber} \nChọn cách trả: `,
            [
                // {
                //     text: 'Trả trước',
                //     onPress: () => this.checkIn(car.id, true),
                // },
                {
                    text: 'Trả sau',
                    onPress: () => this.checkIn(car.id, false),
                }
            ],
            { cancelable: false });
    }

    checkIn = async (id, prepay) => {
        try {
            const carsList = await JSON.parse(await AsyncStorage.getItem('carsList'));
            if (carsList !== null) {
                carsList.map((car) => {
                    if(car.id == id){
                        car.status = keys.booked;
                        car.startTime =  new Date().toLocaleString();
                        if(prepay){
                           car.prepay = true
                        }
                    }
                });
            }
            console.log(carsList);
            this._storeData(carsList);
        } catch (error) {
            console.log("Storage error: " + error);
        }
    }

    _renderCarStatus(){
        if (this.props.car.status === keys.booked){
            return(
                <View style={styles.center}>
                    <View style={styles.centerText}>
                        <View style={styles.text}>
                            <Text style={styles.subtitle}>Giờ bắt đầu:</Text>
                            <Text style={styles.time}>{new Date(this.props.car.startTime).toLocaleTimeString()}</Text>
                        </View>
                        <View style={styles.text}>
                            <Text style={styles.subtitle}>Đã chơi:</Text>
                            <Text style={styles.time}>{this._caculateTime(this.props.car.startTime)}</Text>
                        </View>
                        <Text style={styles.title}>Tình trạng: {this.props.car.status}</Text>
                    </View>
                    <View style={styles.center}>
                        <Button rounded success style={[styles.checkoutBtn, styles.center]} onPress={() => this._checkOutBtn(this.props.car)}>
                            <Text>Tính tiền</Text>
                        </Button>
                    </View>
                </View>

            )
        } else {
            return(
                <View style={styles.center}>
                <View style={styles.centerText}>
                    <View style={styles.text}>
                        <Text style={styles.title}>Tình trạng: {this.props.car.status}</Text>
                    </View>
                    <View style={styles.center}>
                        <Button rounded success style={[styles.checkInBtn, styles.center]} onPress={() => this._checkInBtn(this.props.car)}>
                            <Text>Cho thuê</Text>
                        </Button>
                    </View>
                </View>
                </View>
            )
        }

    }
  render() {
    return(
      <View style={{flex:1}}>
        <TouchableOpacity
          onPress={this._onPress.bind(this)}
          activeOpacity={0.9}
        >
          <View>
            <View style={styles.overlay} />
            <View style={styles.border} />
            <View style={styles.contain}>
                <View style={styles.icon}><Text style={styles.iconText}>{this.props.car.carNumber}</Text></View>
                {this._renderCarStatus()}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  _onPress() {
    // Actions.category({id: this.props.id, title: this.props.title});
  }
}

const styles = {
    contain: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height /4,
        flexDirection: 'row',

    },
    icon:{
        justifyContent: 'center',
        alignItems: 'center',
        width: Dimensions.get('window').width /4,
        height: Dimensions.get('window').width /4,
        borderRadius:Dimensions.get('window').width * 2 / 4,
        backgroundColor: "white",
        marginTop: 35,
        marginLeft: 20,

    },

    iconText:{
        fontSize: 64
    },
    text:{
        flexDirection: 'row',
    },
    checkoutBtn:{
        width: 100
    },
    checkInBtn:{
        width: 100,
        marginLeft: "15%"
    },

    center:{
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    centerText:{
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 10
    },
  title: {
    textAlign: 'center',
    color: 'rgba(232, 181, 8, 1)',
    fontSize: 15
  },
  subtitle: {
    textAlign: 'center',
    color: '#fdfdfd',
    fontSize: 16,
    fontWeight: '100',
  },
    time: {
        color: '#fdfdfd',
        fontSize: 18,
        fontWeight: '100',
        fontStyle: 'italic',
        marginLeft: 5
    },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 42, 54, 0.4)'
  },
  border: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(253, 253, 253, 0.2)'
  },
    button:{
        width: Dimensions.get('window').width /4,
    }
};
