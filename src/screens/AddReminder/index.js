import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const database = require('../../components/Handlers/database.js');

const AddReminder = props => {

    const navigation = useNavigation();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');

    const onReminderAdd = () => {
        if (!title){
            alert('Please enter a reminder title.');
            return;
        }
        if (!description){
            alert('Please enter a reminder description.');
            return;
        }
        if (!date){
            alert('Please enter a reminder date in format MM-DD-YYYY.');
            return;
        }
        
        try {
            database.addReminder(title, description, date);
        } catch (error) {
            console.log('Error adding reminder ' + error);
        }

        alert(title + ' Added!');
        //navigation.navigate('Get Reminders!');
    }

  return (
    <View style={styles.container}>
        <View style={styles.topContainer}>
            <TextInput 
                value={title}
                onChangeText={value => setTitle(value)}
                style={styles.title}
                clearButtonMode={'while-editing'}
                placeholder={'Enter Reminder Title'}
                placeholderTextColor={'grey'}
            />
            <TextInput 
                value={description}
                onChangeText={value => setDescription(value)}
                style={styles.description}
                clearButtonMode={'while-editing'}
                placeholder={'Enter Reminder Description'}
                placeholderTextColor={'grey'}
            />
            <TextInput 
                value={date}
                onChangeText={value => setDate(value)}
                style={styles.date}
                clearButtonMode={'while-editing'}
                placeholder={'Enter Reminder Date in format MM-DD-YYYY'}
                placeholderTextColor={'grey'}
            />
        </View>
        <View style={styles.bottomContainer}>
            <Pressable style={styles.button} onPress={onReminderAdd}>
                <Text style={styles.buttonText}>Add</Text>
            </Pressable>
        </View>
    </View>
  );
};

export default AddReminder;