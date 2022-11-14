import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

const Reminder = props => {

    const post = props.post;
    const navigation = useNavigation();

    const onPress = () => {
        navigation.navigate('Existing Reminder', {post: post});
    }

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.touchable} onPress={onPress}>
            <View style={{flex: 2}}>
                <Text style={styles.title} numberOfLines={1}>{post.title}</Text>
                <Text style={styles.description} numberOfLines={1}>{post.description}</Text>
            </View>
            <View style={{flex: 1}}>
                <Text style={styles.date}>{post.date}</Text>
            </View>
        </TouchableOpacity>
    </View>
  );
};

export default Reminder;