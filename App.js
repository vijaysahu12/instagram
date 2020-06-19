import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Button, Text, Dimensions, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { f, auth, storage, database } from "./config/config";
import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import { FontAwesome5 } from '@expo/vector-icons';
import UserProfileScreen from './screens/userProfile';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HeaderBackButton } from '@react-navigation/stack';
import Comments from './screens/Comments';
const Stack = createStackNavigator();

export default function App(props) {
  const isLoadingComplete = useCachedResources();

  const getLogin = () => {
    // Force user to get login
    try {
      let user = auth.signInWithEmailAndPassword('25susmita.sahoo@gmail.com', 'fakepassword')
    } catch (error) {
      console.warn(error);
    }
  }

  React.useEffect((effect) => {
    getLogin();
  });



  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <NavigationContainer linking={LinkingConfiguration}>
          <Stack.Navigator screenOptions={({ navigation }) => ({
            headerStyle: {
              backgroundColor: '#f4511e'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerLeft: (props) => (
              <HeaderBackButton {...props} onPress={() => {
                navigation.popToTop();
              }} />
            ),
          })}>
            <Stack.Screen name="Root"
              component={BottomTabNavigator}
              {...props}
              options={{
                transitionSpec: {
                  open: config,
                  close: config,
                },
              }}
            />
            <Stack.Screen name="UserProfileScreen"


              component={UserProfileScreen}
              {...props}
              options={{
                title: 'Profile',
                transitionSpec: {
                  open: config,
                  close: config,
                },
              }
              }
            />

            <Stack.Screen name="Comments"

              component={Comments}
              {...props}
              options={{
                title: 'Profile',
                transitionSpec: {
                  open: config,
                  close: config,
                },
              }
              }
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );

  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});





const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};


export function PageHeader({ navigation }) {
  <View>
    <TouchableOpacity>
      {/* <FontAwesome5 name="bars" style={{ marginLeft: 10}} onPress={() => navigation.navigate("root")} /> */}
      <Text>Header </Text>
    </TouchableOpacity>
  </View>
}