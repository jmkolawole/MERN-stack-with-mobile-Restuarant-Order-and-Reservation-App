import React, { Component } from 'react';
import { ScrollView, View, Text, Image, Fl, FlatList } from 'react-native';
import { Card, ListItem, List } from 'react-native-elements';
import {connect} from 'react-redux';
import {baseUrl} from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import * as Animatable from 'react-native-animatable';



const mapStateToProps = state => {
    return {
        leaders : state.leaders
    }
}


function History() {
    return (
        <Card>

            <Card.Title>Our History</Card.Title>
            <Card.Divider />


            <View>

                <Text style={{ marginBottom: 10 }}>
                    Started in 2010, Ristorante con Fusion quickly established itself as a culinary icon par excellence
             in Hong Kong. With its unique brand of world fusion cuisine that can be found nowhere else,
             it enjoys patronage from the A-list clientele in Hong Kong.
              Featuring four of the best three-star Michelin chefs in the world,
              you never know what will arrive on your plate the next time you visit us.

        The restaurant traces its humble beginnings to The Frying Pan,
        a successful chain started by our CEO, Mr. Peter Pan,
        that featured for the first time the world's best cuisines in a pan.

            </Text>

            </View>
        </Card>

    );
}

class About extends Component {

    static navigationOptions = {
        title: 'About'
    }

    render() {

        const ItemView = ({ item, index }) => {
            return (
                <ListItem
                    key={index}
                    title={item.name}
                    subtitle={item.description}
                    hideChevron={true}
                    leftAvatar={{ source: {uri: baseUrl + item.image} }}
                />
            );
        };

        if(this.props.leaders.isLoading){
            return (
               <ScrollView>

                   <History/>
                   <Card> 
                   <Card.Title>
                        Corporate Leadership
                   </Card.Title>
                   <Loading/>
                   </Card>    
               </ScrollView>    
            );
        }else if(this.props.leaders.errMess){
            return (
                <ScrollView>
 
                 <Animatable.View animation="fadeInDown" delay={1000}>
                    <History/>
                    <Card> 
                    <Card.Title>
                         Corporate Leadership
                    </Card.Title>
                    <Text>{this.props.leaders.errMess}</Text>

                    </Card>
                    </Animatable.View>    
                </ScrollView>    
             );
        }else{
            return (
                <>
                <ScrollView>
                    <Animatable.View animation="fadeInDown" delay={1000}>
    
                    <History />
    
                    <Card>
                        <Card.Title>Corporate Leadership</Card.Title>
                        <Card.Divider />
    
    
                        <View >
                            <FlatList
                                data={this.props.leaders.leaders}
                                renderItem={ItemView}
                                keyExtractor={item => item.id.toString()}
                            />
                        </View>
    
                    </Card>
                    </Animatable.View>
                </ScrollView>
                </>
            );
    
        }

       

    }
}

export default connect(mapStateToProps)(About);