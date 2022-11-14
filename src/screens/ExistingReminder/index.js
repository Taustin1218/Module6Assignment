import React, { useState } from 'react';
import {Text, TextInput, View, Pressable, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
// import openDtabase hook
import { openDatabase } from "react-native-sqlite-storage";

// use hook
const myRemindersDB = openDatabase({name: 'MyReminders.db'});
const remindersTableName = 'reminders';
const remindersPrioritiesTableName = 'reminder_priorities';

const ExistingReminderScreen = props => {

    const post = props.route.params.post;

    const [title, setTitle] = useState(post.title);
    const [description, setDescription] = useState(post.description);
    const [date, setDate] = useState(post.date);

    const navigation = useNavigation();

    const onReminderUpdate = () => {
        if (!title){
            alert('Please enter a reminder title.');
            return;
        }
        if (!description){
            alert('Please enter a reminder description.');
            return;
        }
        if (!date){
            alert('Please enter a date in format MM-DD-YYYY.');
            return;
        }

        myRemindersDB.transaction(txn => {
            txn.executeSql(
                `UPDATE ${remindersTableName} SET title = '${title}', description = '${description}', date = '${date}' WHERE id = ${post.id}`,
                [],
                () => {
                    console.log(`${title} updated successfully`);
                },
                error => {
                    console.log('Error on updating reminder' + error.message);
                }
            );
        });

        alert(title + ' updated!');
        navigation.navigate('Get Reminders!');
    }

    const onReminderDelete = () => {
        return Alert.alert(
            // title
            'Confirm',
            // message
            'Are you sure you want to delete this reminder?',
            // buttons
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        myRemindersDB.transaction(txn => {
                            txn.executeSql(
                                `DELETE FROM ${remindersTableName} WHERE id = ${post.id}`,
                                [],
                                () => {
                                    console.log(`${title} deleted successfully`);
                                },
                                error => {
                                    console.log('Error on deleting reminder' + error.message);
                                }
                            );
                        });
                        myRemindersDB.transaction(txn => {
                            txn.executeSql(
                                `DELETE FROM ${remindersPrioritiesTableName} WHERE reminder_id = ${post.id}`,
                                [],
                                () => {
                                    console.log('Reminder priority deleted successfully.');
                                },
                                error => {
                                    console.log('Error on deleting reminder priority' + error.message);
                                }
                            );
                        });
                        alert('Reminder Deleted!');
                        navigation.navigate('Get Reminders!');
                    },
                },
                {
                    text: 'No',
                },
            ],
        );
    }

    const onPriorityAdd = () => {
        navigation.navigate('Add Reminder Priority', {post: post});
    }

    const onViewReminder = () => {
        navigation.navigate('View Reminder Priorities', {post: post});   
    }

  return (
    <View style={styles.container}>
        <View style={styles.topContainer}>
            <TextInput 
                value={title}
                onChangeText={value => setTitle(value)}
                style={styles.title}
                clearBottunMode={'while-editing'}
                placeholder={'Enter Reminder Title'}
                placeholderTextColor={'grey'}
            />
            <TextInput 
                value={description}
                onChangeText={value => setDescription(value)}
                style={styles.description}
                clearBottunMode={'while-editing'}
                placeholder={'Enter Reminder Description'}
                placeholderTextColor={'grey'}
            />
            <TextInput 
                value={date}
                onChangeText={value => setDate(value)}
                style={styles.date}
                clearBottunMode={'while-editing'}
                placeholder={'Enter Date in format MM-DD-YYYY'}
                placeholderTextColor={'grey'}
            />
        </View>
        <View style={styles.bottomContainer}>
            <Pressable style={styles.updateButton} onPress={onReminderUpdate}>
                <Text style={styles.buttonText}>Update</Text>
            </Pressable>
            <Pressable style={styles.deleteButton} onPress={onReminderDelete}>
                <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
            <Pressable style={styles.addButton} onPress={onPriorityAdd}>
                <Text style={styles.buttonText}>Add Priority</Text>
            </Pressable>
            <Pressable style={styles.viewButton} onPress={onViewReminder}>
                <Text style={styles.buttonText}>View Items</Text>
            </Pressable>
        </View>
    </View>
  );
};

export default ExistingReminderScreen; 