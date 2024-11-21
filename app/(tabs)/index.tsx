import { Image, StyleSheet, Platform, View, Pressable, Text, SafeAreaView} from 'react-native';
import { useRouter } from 'expo-router';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.titleText}>Tracking</Text>
      </View>
      <View style={styles.main}>
        <View style={styles.button}>
          <Pressable onPress={() => router.push('/screens/sleep')}>
            <Image source={require('../../assets/images/moon.png')} style={styles.buttonIcon} />
            <Text>Sleep</Text>
          </Pressable>
        </View>
        <View style={styles.button}>
          <Pressable onPress={() => router.push('/screens/pumping')}>
            <Image source={require('../../assets/images/favicon.png')} style={styles.buttonIcon} />
            <Text>Pumping</Text>
          </Pressable>
        </View>
        <View style={styles.button}>
          <Pressable onPress={() => router.push('screens/diaper')}>
            <Image source={require('../../assets/images/favicon.png')} style={styles.buttonIcon} />
            <Text>Diaper</Text>
          </Pressable>
        </View>
        <View style={styles.button}>
          <Pressable onPress={() => router.push('screens/feeding')}>
            <Image source={require('../../assets/images/favicon.png')} style={styles.buttonIcon} />
            <Text>Feeding</Text>
          </Pressable>
        </View>
        <View style={styles.button}>
          <Pressable onPress={() => router.push('screens/health')}>
            <Image source={require('../../assets/images/favicon.png')} style={styles.buttonIcon} />
            <Text>Health</Text>
          </Pressable>
        </View>
        <View style={styles.button}>
          <Pressable onPress={() => router.push('screens/milestones')}>
            <Image source={require('../../assets/images/favicon.png')} style={styles.buttonIcon} />
            <Text>Milestones</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height : 150,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  main: {
    flex: 9,
    flexWrap: 'wrap', // Allow the buttons to wrap into rows
    flexDirection: 'row', // Arrange buttons in rows
    justifyContent: 'space-between', // Distribute space between buttons
    padding: 10, 
  },
  container:{
    flex: 1
  },
  title: {
    flex: 1, 
    backgroundColor: '#A1CEDC', // Light blue background color
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 10, 
    borderRadius: 5, // Round Corners
  },
  titleText: {
    color: '#FFFFFF', // White text for contrast
    fontSize: 48, 
    fontWeight: 'bold',
  },
  button: {
    width: '48%', 
    height: 190,
    marginBottom: 10, 
    backgroundColor: '#A1CEDC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8, 
    flexDirection: 'column'
  },
  buttonIcon: {
    width: 100, 
    height: 100, 
    marginBottom: 10, 
  },
});
