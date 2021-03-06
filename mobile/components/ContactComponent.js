import React, { Component } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import * as MailComposer from 'expo-mail-composer';



class Contact extends Component {



    static navigationOptions = {
        title: 'Contact'
    }


    sendMail(){
        MailComposer.composeAsync({
            recipients: ['confusion@food.net'],
            subject: 'Enquiry',
            body: 'To whom it may concern'
        })
    }
    render() {

        return (

            <ScrollView>
            <Animatable.View animation="fadeInDown" delay={1000}>
            
            <Card>
                <Card.Title>Contact Us</Card.Title>
                <Card.Divider />

                <View>
                    <Text style={{ marginBottom: 10 }}>121, Clear Water Bay Road </Text>
                    <Text style={{ marginBottom: 10 }}>Clear Water Bay, Kowloon </Text>
                    <Text style={{ marginBottom: 10 }}>HONG KONG </Text>
                    <Text style={{ marginBottom: 10 }}>Tel: +852 1234 5678 </Text>
                    <Text style={{ marginBottom: 10 }}>Fax: +852 8765 4321 </Text>
                    <Text style={{ marginBottom: 10 }}>Email:confusion@food.net </Text>
                    
                </View>

                <Button
                        title=" Send Email"
                        buttonStyle={{backgroundColor: "#512DA8"}}
                        icon={<Icon name='envelope-o' type='font-awesome' color='white' />}
                        onPress={this.sendMail}
                />
            </Card>
            
            </Animatable.View>
            </ScrollView>
        );

    }

}

export default Contact;