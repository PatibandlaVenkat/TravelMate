// ...existing code...
import React,{ useCallback, useState ,useRef, useEffect } from 'react';
import { 
  View,
  ViewStyle,
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
  StyleProp,
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useSwipe } from '@/hooks/useSwipe';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

interface Message{
  id:string;
  text: string;
  time: Date;
  mine: boolean;
}

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

  const[messages,setMessages] = useState<Message[]>([]);
  const flatRef = useRef<FlatList | null>(null);


  useEffect(() => {
    const t= setTimeout(()=>{
      try{
        flatRef.current ?.scrollToEnd({ animated:true});
      }catch (e){}
    },80);
    return () => clearTimeout(t);
  },[messages]);

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        Keyboard.dismiss();
      }, 50);
      return () => clearTimeout(timer);
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
    Animated.timing(animValue,{
      toValue: focusedOrFilled ? 1: 0,
      duration: 200,
      useNativeDriver:false,
    }).start();
  };

  useEffect(() => {
    animateLabel(fromAnim,fromFocused || fromText!== '');
  },[fromFocused,fromText]);

  useEffect(() => {
    animateLabel(toAnim, toFocused || toText !== '');
  },[toFocused,toText]);

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

  const filteredLanguages = languages.filter((lang) => {
  if (lang === "None") return true;

  if (activeDropdown === "from" && lang === toText) return false;
  if (activeDropdown === "to" && lang === fromText) return false;

  return true;
});

  const renderItem=({ item }: { item :string}) => (
    <TouchableOpacity
      style={[styles.dropdownItem,{ backgroundColor:theme.background}]}
      onPress={() => selectLanguage(item)}
    >
      <Text style={{ color:theme.text}}>{item}</Text>
    </TouchableOpacity>
  );

  const renderMessage =({ item } : {item:any}) =>{
    const bubbleStyle:StyleProp<ViewStyle>=[
      styles.bubble,
      {
        alignSelf: item.mine ? 'flex-end' : 'flex-start',
        maxWidth: '95%',
        backgroundColor: item.mine ? '#DCF8C6' : (theme?.background ?? '#fff'),
        borderColor: item.mine ? '#cfeec0' : (theme.border ?? '#e0e0e0'),
      } as ViewStyle,
    ];

    const time =item.time instanceof Date ? item.time : new Date(item.time);

    return (
      <View style={{ marginVertical: 6, maxWidth: '100%'}}>
        <TouchableOpacity activeOpacity={0.8}>
          <View style={bubbleStyle}>
            <Text style={[styles.bubbleText, {color:'#000'}]}>{item.text}</Text>
            <Text style={styles.timeText}>
              {time.toLocaleTimeString([],{hour: '2-digit',minute: '2-digit'})}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureDetector gesture={swipe}>
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        <View style={[styles.container,{backgroundColor:theme.background}]}>
          <StatusBar barStyle={colorScheme == 'dark' ? 'light-content' : 'dark-content'} />
          <Text style={[styles.title,{color:theme.headtext}]}>Translater</Text>
          <View style={[styles.hline,{backgroundColor: theme.icon}]}/>

          {/* -------------------- Language selectors -------------------- */}
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
                    top: fromAnim.interpolate({ inputRange:[0,1], outputRange:[-6,-3] }),
                    fontSize: fromAnim.interpolate({ inputRange:[0,1], outputRange:[16,14] }),
                  }
                ]}
              >
                From
              </Animated.Text>

              <TextInput
                pointerEvents="none"
                style={[styles.selectorInput,{color:theme.text}]}
                value={fromText || "Select language"}
                editable={false}
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
                    top: toAnim.interpolate({ inputRange:[0,1], outputRange:[-6,-3] }),
                    fontSize: toAnim.interpolate({ inputRange:[0,1], outputRange:[16,14] }),
                  }
                ]}
              >
                To
              </Animated.Text>

              <TextInput
                pointerEvents="none"
                style={[styles.selectorInput, { color:theme.text}]}
                value={toText || "Select language"}
                editable={false}
              />   
            </TouchableOpacity>   
          </View>

          {/* -------------------- Dropdown Modal -------------------- */}
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
                  data={filteredLanguages}
                  renderItem={renderItem}
                  keyExtractor={(item) => item}
                />
              </View>
            </TouchableOpacity>
          </Modal>

          {/* -------------------- Message list -------------------- */}
          <View style={styles.messageWrapper}>
            <FlatList
              ref={(r) => { flatRef.current=r; }}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              contentContainerStyle={{ padding:10, paddingBottom:16 }}
              showsVerticalScrollIndicator={false}
            />
          </View>

        </View>
      </TouchableWithoutFeedback>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems:'center', paddingTop: 70 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  hline:{ height:1, width: '100%', marginVertical:10 },
  messageWrapper:{ width: width *0.9, flex:1, alignSelf:'center' },
  bubble:{ paddingHorizontal:12, paddingVertical:8, borderRadius:12, borderWidth:1 },
  bubbleText:{ fontSize:16 },
  timeText:{ fontSize:10, color:'#555', alignSelf:'flex-end', marginTop:6 },
  selectWrapper:{ flexDirection:'row', width:width*0.9, height:60, borderWidth:1, borderColor:'#ccc', borderRadius:10, overflow:'hidden', marginVertical:20, alignItems:'center' },
  selector:{ flex:1, justifyContent:'center', paddingHorizontal:10 },
  verticalLine:{ width:1, backgroundColor:'#ccc' },
  selectorInput:{ fontSize:16, marginTop:22 },
  modalBackground:{ flex:1, backgroundColor:'rgba(0,0,0,0.3)', justifyContent:'center', alignItems:'center' },
  dropdown:{ width:width*0.8, maxHeight:250, borderRadius:10, padding:10 },
  dropdownItem:{ paddingVertical:12, paddingHorizontal:10 },
  swapButton:{ width:50, justifyContent:'center', alignItems:'center' },
});
