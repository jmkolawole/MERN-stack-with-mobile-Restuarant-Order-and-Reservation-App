import React,{Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Test extends Component{
    render(){

        return (
            <Text>
                Good Boy
                Good always
                I am great 
                This is so sweet. Very well. Now working, so happy and glad. It is now working. Okay then
            </Text>
            );
    }
    
}

export default Test;



/*




import React from 'react';
import { View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

function Menu(props){

    const renderMenuItem = ({item, index}) => {

        return (
                <ListItem
                    key={index}
                    title={item.name}
                    subtitle={item.description}
                    hideChevron={true}
                    leftAvatar={{ source: require('./images/uthappizza.png')}}
                  />
        );
    };

    return (
            <FlatList 
                data={props.dishes}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id.toString()}
                />
    );
}

export default Menu;

*/