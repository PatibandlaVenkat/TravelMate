// ...existing code...
import React,{ useCallback, useState ,useRef, useEffect } from 'react';
import { 
  View,
  StyleSheet,
  StatusBar,
  Text,
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  Dimensions, 
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  FlatList,
  Modal,
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSwipe } from '@/hooks/useSwipe';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useFocusEffect } from '@react-navigation/native';


const {width}=Dimensions.get('window');

const languages=[
  'None',
  'English',
  'Hindi',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Arabic',
];

export default function BlankIndex() {
  const colorScheme=useColorScheme();
  const theme =Colors[colorScheme ?? 'light'];
  const swipe=useSwipe();

  const[messages,setMessages] = useState([]);
  const flatRef = useRef<FlatList | null>(null);

  const [message,setMessage] =useState('');
  const [inputHeight,setInputHeight] = useState(40);
  const inputRef = useRef<TextInput>(null);

  const handelSend = ()=>{
    if(message.trim().length === 0) return;
   const newMsg={
    id:Date.now().toString(),
    text:message,
    time: new Date(),
    mine: true,
   }

   

  };

  const handelMicPress = () => {
    console.log('Speech translation started..');
  };

useFocusEffect(
  useCallback(() => {
    const timer = setTimeout(() => {
      inputRef.current?.blur();
      Keyboard.dismiss();
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [])
);


const [fromText,setFromText] = useState('');
const [toText,setToText] = useState('');
const [fromFocused,setFromFocuseed] = useState(false);
const [toFocused,setToFocused] = useState(false);
const [dropdownVisible,setDropdownVisible] = useState(false);
const [activeDropdown,setActiveDropdown] = useState<'from' | 'to' | null>(null);


const fromAnim = useRef(new Animated.Value(0)).current;
const toAnim =useRef(new Animated.Value(0)).current;

const animateLabel =(animValue: Animated.Value, focusedOrFilled:boolean) => {
  if (!animValue) return ;
  Animated.timing(animValue,{
    toValue: focusedOrFilled ? 1: 0,
    duration: 200,
    useNativeDriver:false,
  }).start();
}

useEffect(() => {
  animateLabel(fromAnim,fromFocused || fromText!== '');
},[fromFocused,fromText]);

useEffect(() => {
  animateLabel(toAnim, toFocused || toText !== '');
},[toFocused,toText,]);


const labelBase : any ={
  position: 'absolute',
  left: 20,
  paddingHorizontal: 6,
  zIndex: 10,
  backgroundColor: 'transparent',
}

const openDropdown = (type: 'from' | 'to') =>{
  setActiveDropdown(type);
  setDropdownVisible(true);
};

const selectLanguage = (lang:string) =>{
  if(lang === 'None') {
    if(activeDropdown === 'from') setFromText('');
    if(activeDropdown === 'to') setToText('');
  }else {
    if(activeDropdown === 'from') setFromText(lang);
    if(activeDropdown === 'to') setToText(lang);
  }

  setDropdownVisible(false);
  setActiveDropdown(null);
};

const renderItem=({ item }: { item :string}) => (
  <TouchableOpacity
  style={[styles.dropdownItem,{ backgroundColor:theme.background}]}
  onPress={() => selectLanguage(item)}
  >
    <Text style={{ color:theme.text}}>{item}</Text>
  </TouchableOpacity>
);

  return (
    <GestureDetector gesture={swipe}>
      <TouchableWithoutFeedback onPress={()=> inputRef.current?.blur()}>
    <View style={[styles.container,{backgroundColor:theme.background}]}>
      <StatusBar barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'} />
      <Text style={[styles.title,{color:theme.headtext}]}>Translater</Text>
      <View style={[styles.hline,{backgroundColor: theme.icon}]}/>

        <View style={styles.selectWrapper}>
          <TouchableOpacity 
          style={[styles.selector,{ flex:1}]}
          activeOpacity={1}
          onPress={() => openDropdown('from')}
          >
            <Animated.Text
                    style={[
                      labelBase,
                      {
                        color: theme.text,
                        backgroundColor: theme.background,
                        paddingHorizontal: 8,
                        paddingVertical: 2,

                        top: fromAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-6, -3],
                        }),
                        fontSize: fromAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [16, 14],
                        }),
                      }
                    ]}
                  >
                    From
            </Animated.Text>

            <TextInput
            style={[styles.selectorInput,{color:theme.text}]}
            value={fromText || "Select language"}
            editable={false}
            pointerEvents="none"
            />
          </TouchableOpacity>

          <TouchableOpacity 
              style={styles.swapButton}
              onPress={() => {
                const temp = fromText;
                setFromText(toText);
                setToText(temp);
              }}
            >
              <Ionicons 
                name="swap-horizontal" 
                size={26} 
                color={theme.headtext}
              />
           </TouchableOpacity>
          
          <View style={[styles.verticalLine, { backgroundColor: theme.icon }]}/>

          <TouchableOpacity 
             style={[styles.selector, {flex: 1}]}
             activeOpacity={1}
             onPress={() => openDropdown('to')}
          >
            <Animated.Text
                style={[
                  labelBase,
                  {
                    color: theme.text,
                    backgroundColor: theme.background,
                    paddingHorizontal: 8,
                    paddingVertical: 2,

                    top: toAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-6, -3],
                    }),
                    fontSize: toAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [16, 14],
                    }),
                  }
                ]}
              >
                To
            </Animated.Text>

            <TextInput
               style={[styles.selectorInput, { color:theme.text}]}
               value={toText || "Select language"}
               editable={false}
               pointerEvents="none"
            />   
          </TouchableOpacity>   
        </View>

        <Modal
          visible={dropdownVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >

          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPressOut={() => setDropdownVisible(false)}
          >
            <View style={[styles.dropdown,{ backgroundColor:theme.background}]}>
              <FlatList
                data={languages}
                renderItem={renderItem}
                keyExtractor={(item) => item}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.chatContainer,{flex:1}]}
      >

          {/*  // this is the text box for text input*/}
          <View style={[styles.inputWrapper,{backgroundColor: colorScheme === 'dark' ? '#222' : '#f0f0f0',},]}>
            <TextInput style={[styles.input,{color: theme.text,height:Math.max(40, inputHeight)}]}
            ref={inputRef}
            placeholder="Text to Translate..."
            placeholderTextColor={colorScheme==='dark' ? '#aaa' : '#666'}
            multiline
            value={message}
            onChangeText={setMessage}
            onContentSizeChange={(e) =>
              setInputHeight(e.nativeEvent.contentSize.height)
            }
            />

            {/*Mic Button*/}
            <TouchableOpacity onPress={handelMicPress} style={styles.iconButton}>
              <Ionicons name="mic" size={24} color={theme.headtext}/>
            </TouchableOpacity>

            {/*Send Button*/}
            <TouchableOpacity onPress={handelSend} style={styles.iconButton}>
              <Ionicons name="send" size={24} color={theme.headtext}/>
            </TouchableOpacity>

          </View>
        </KeyboardAvoidingView>
    </View>
    </TouchableWithoutFeedback>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    paddingTop: 70,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  hline:{
    height:1,
    width: '100%',
    marginVertical:10,
  },
  chatContainer:{
    position:'absolute',
    bottom:20,
    width: width *0.9,
    alignSelf: 'center',
  },
  inputWrapper:{
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input:{
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  iconButton:{
    paddingHorizontal: 6,
    paddingVertical :10,
  },
  selectWrapper: {
    flexDirection: 'row',
    width: width * 0.9,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    overflow: 'hidden',
    marginVertical: 20,
    alignItems: 'center',
  },
  selector: {flex: 1,justifyContent:'center', paddingHorizontal:10 },
  verticalLine: { width:1, backgroundColor: '#ccc'},
  selectorInput: { fontSize:16, padding:0, marginTop:22 },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width:width*0.8,
    maxHeight: 250,
    borderRadius: 10,
    padding: 10,
  },

  dropdownItem: { paddingVertical: 12, paddingHorizontal:10},

  swapButton: {
  width: 50,
  justifyContent: 'center',
  alignItems: 'center',
}

});