import React, { Component, useRef } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Modal, Button, TextInput, Picker, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import 'intl';
import 'intl/locale-data/jsonp/en';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';
import { postComment } from '../redux/ActionCreators';
import StarRating from 'react-native-star-rating';
import * as Animatable from 'react-native-animatable';



const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

//console.log(props);

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
})

function RenderDish(props) {
    const dish = props.dish;
    const viewRef = useRef(null)

    const recognizeDrag = ({moveX, moveY,dx, dy}) => {
         if(dx < -200)
         return true;
         else
         return false;    
    }

    const recognizeComment = ({moveX, moveY,dx, dy}) => {
        if(dx > 200)
        return true;
        else
        return false;
    }


    const panResponder = PanResponder.create({
          onStartShouldSetPanResponder: (e, gestureState) => {
              return true;
          }, 
          onPanResponderGrant: () => {
            viewRef.current.rubberBand(1000);
        },
          onPanResponderEnd: (e, gestureState) => {
              if(recognizeDrag(gestureState)){
                Alert.alert(
                    'Add To Favorite',
                    'Are you sure you want to add' + dish.name + ' to your favorites?',
                    [
                    {text: 'Cancel', 
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel'
                    },{
                        text: 'Okay',
                        onPress:() => props.favorite ? console.log('Already Favourite') : props.onPress(),
                    }
                    ],
                    {
                        cancelable: false
                    }

                );
                return true;
              }else if(recognizeComment(gestureState)){
                window.toggleModal();
              }
          }
    });

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },{
            dialogTitle: 'Share ' + title
        })
    }





    if (dish != null) {

        return (
            <>
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
            {...panResponder.panHandlers}
            ref={viewRef}>
            <Card
                featuredTitle={dish.name}
                image={{ uri: baseUrl + dish.image }}>


                <Text style={{ margin: 10 }}>
                    {dish.description}
                </Text>
                <View style={styles.formRow}>
                    <Icon
                        raised
                        reverse
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log('Already Favourite') : props.onPress()}
                    />

                    <Icon
                        raised
                        reverse
                        name='pencil'
                        type='font-awesome'
                        color='#512DA8'
                        onPress={() => { window.toggleModal(); }}

                    />

                    <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            style={styles.cardItem}
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
                </View>

            </Card>
            </Animatable.View>

            </>

        )

    } else {

        return (<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;
    const renderCommentItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Text style={{ fontSize: 4 }}><StarRating starContainerStyle= {{width: 40}}
                        disabled={true}
                        maxStars={5}
                        size={2}
                        rating={item.rating}
                        fullStarColor={'yellow'}/> </Text>              
                <Text style={{ fontSize: 12 }}>{'--' + item.author + ', '}{" "} {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                }).format(new Date(Date.parse(item.date)))}</Text>
            </View>

        );

    }

    return (
        <Animatable.View animation="fadeInUp" delay={1000}>
        <Card title="Comments">
           
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item => item.id.toString()}
            />

        </Card>
        </Animatable.View>
    );
}


class DishDetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            author: '',
            comment: '',
            rating:0
        }

        window.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal() {
        this.setState({
            showModal: !this.state.showModal
        });
    }

    handleSubmit(){
        console.log(JSON.stringify(this.state));
        const dishId = this.props.navigation.getParam('dishId', '');
        this.toggleModal();
        this.props.postComment(dishId,this.state.rating, this.state.author, this.state.comment)
        
    }


    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    onStarRatingPress(rating) {
        this.setState({
          rating: rating
        });
      }

    static navigationOptions = {
        title: 'Dish Details'
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');

        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)} />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismis={() => { this.toggleModal(); }}
                    onRequestClose={() => { this.toggleModal(); }}>


                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>Your Comment</Text>
                    </View>

                    <View style={{flexDirection:'row',justifyContent:'center',marginBottom:5}}><Text>Rating: {this.state.rating}/5</Text></View>

                    <View style={styles.rating}>
                    <StarRating style={{width:200}}
                        disabled={false}
                        maxStars={5}
                        rating={this.state.rating}
                        fullStarColor={'yellow'}
                        selectedStar={(rating) => this.onStarRatingPress(rating)}/>
                    </View>





                    <View style={styles.textContainer}>
                        <Icon name='user' style={styles.icon} type='font-awesome' />
                        <TextInput
                            style={styles.inputStyle}
                            autoCorrect={false}
                            placeholder="Author"
                            value={this.state.author}
                            onChangeText={(value) => this.setState({ author: value })}
                        />

                    </View>
                    <View style={styles.textContainer}>
                        <Icon name='comment' style={styles.icon} type='font-awesome' />
                        <TextInput
                            style={styles.inputStyle}
                            autoCorrect={false}
                            placeholder="Comment"
                            value={this.state.comment}
                            onChangeText={(value) => this.setState({ comment: value })}
                        />

                    </View>

                    <View style={styles.modal}>

                        <Button onPress={() => { this.handleSubmit() }}
                            color='#512dab'
                            title='Submit' />                        
                    </View>

                    <View style={styles.modal}>

                        <Button onPress={() => { this.toggleModal() }}
                            color='grey'
                            title='Cancel' />                        
                    </View>




                </Modal>
            </ScrollView>
        );
    }


}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512dab',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    },
    inputSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    inputIcon: {
        padding: 10,
    },
    input: {
        flex: 1,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
    },
    textContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#000',
        paddingBottom: 10,
    },
    inputStyle: {
        flex: 1,
    },
    icon: {
        margin: 10
    },
    rating: {
        alignItems: 'center',
        justifyContent: 'center',
        //flex: 1,
        flexDirection: 'row',
        
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);






