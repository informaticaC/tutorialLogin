import * as React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google'

//web 390958680596-vtonuian8j15vrjq0sr9k352ddulcs85.apps.googleusercontent.com
//iOS 390958680596-t0gg07uga0sc89e9h5kdgocuir9ot1uv.apps.googleusercontent.com
//android 390958680596-cspmtm3k11gvk8qtv5581rkee8b2dhh9.apps.googleusercontent.com

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [accessToken, setAccessToken] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "390958680596-vtonuian8j15vrjq0sr9k352ddulcs85.apps.googleusercontent.com",
    iosClientId: "390958680596-t0gg07uga0sc89e9h5kdgocuir9ot1uv.apps.googleusercontent.com",
    androidClientId: "390958680596-cspmtm3k11gvk8qtv5581rkee8b2dhh9.apps.googleusercontent.com"
  });

  React.useEffect(()=>{
    if(response?.type==="success"){
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInfo();
    }
  },[])

  async function fetchUserInfo() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me",{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const useInfo = await response.json();
    setUser(useInfo);
  }

  const ShowUserInfo = ()=>{
    if(user) {
      return(
        <View style={{flex: 1, alignItems: 'center',justifyContent: 'center'}}>
          <Text style={{fontSize: 35, fontWeight: 'bold', marginBottom: 20}}>Welcome</Text>
          <Image source={{uri: user.picture}} style={{width:100, height:100, borderRadius: 50}} />
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>{user.name}</Text>
        </View>
      )
    }
  }

  return (
    <View style={styles.container}>
      {user && <ShowUserInfo />}
      {user === null && 
         <>
         <Text style={{fontSize: 35, fontWeight: 'bold'}}>Welcome</Text>
         <Text style={{fontSize: 25, fontWeight: 'bold', marginBottom: 20, color: 'gray'}}>Please login</Text>
       <TouchableOpacity
         disabled={!request}
         onPress={() => {
           promptAsync();
           }} 
       >
         <Image source={require("./btn.png")} style={{width: 300, height: 40}} />
       </TouchableOpacity>
       </>
      }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
