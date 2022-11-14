import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, FlatList } from 'react-native';
import Reminder from '../../components/Reminder';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
// import openDatabase hook
import { openDatabase } from "react-native-sqlite-storage";

// use hook to create database
const myRemindersDB = openDatabase({name: 'MyReminders.db'});
const remindersTableName = 'reminders';

const RemindersScreen = props => {

  const navigation = useNavigation();

  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const listener = navigation.addListener('focus', () => {
      // declare an empty array that will store the results of the
      // SELECT
      let results = [];
      // declare a transation that will execute the SELECT
      myRemindersDB.transaction(txn => {
        // execute SELECT
        txn.executeSql(
          `SELECT * FROM ${remindersTableName}`,
          [],
          // callback function to handle the results from the
          // SELECT s
          (_, res) => {
            // get number of rows of data selected
            let len = res.rows.length;
            console.log('Length of reminders ' + len);
            // if more than one row was returned
            if (len > 0){
              // loop through the rows
              for (let i = 0; i < len; i++){
                // push a row of data at a time onto the
                // results array
                let item = res.rows.item(i);
                results.push({
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  date: item.date,
                });
              }
              // assign results array to lists state variable
              setReminders(results);
            } else {
              // if no rows of data were returned,
              // set lists state variable to an empty array
              setReminders([]);
            }
          },
          error => {
            console.log('Error getting reminders ' + error.message);
          },
        )
      });
    });
    return listener;
  });

  return (
    <View style={styles.container}>
      <View>
        <FlatList 
          data={reminders}
          renderItem={({item}) => <Reminder post={item} />}
          keyExtractor={item => item.id}
        />
      </View>
        <View style={styles.bottom}>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('Add Reminder')}
                >
                <Text style={styles.buttonText}>Add Reminder</Text>
            </TouchableOpacity>
        </View>
    </View>
  );
};

export default RemindersScreen;