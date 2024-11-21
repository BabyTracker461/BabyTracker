import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const SleepPage = () => {
  const navigation = useNavigation(); // Access the navigation object

  React.useEffect(() => {
    navigation.setOptions({ 
        title: 'Sleep Tracker', 
        headerBackTitle: 'Back',
        headerTitleStyle: {
            fontSize: 20, // Make the title larger
            fontWeight: 'bold', // Optional: make it bold
          },
          headerBackTitleStyle: {
            fontSize: 20, // Make the back button text larger
          },
        headerRight: () => (
            <Image
              source={require('../../assets/images/moon.png')} // Replace with your image path
              style={{ width: 24, height: 24, marginRight: 80 }} // Adjust size and margin
            />
          ),
    });
     // Change title to 'Sleep Tracker'
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>Sleep</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SleepPage;
