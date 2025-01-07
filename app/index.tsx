import React,{useState} from 'react'
import {Text,View,StyleSheet, Button, TouchableOpacity} from 'react-native'
import './design.css'
export default function App(){
    const Alphabets=['red','blue','green','yellow','orange','blue','green','black']
    const [init,setInit]=useState(Alphabets);
    
    const RotateAlphabet=()=>{
        setInit((prevAlpha)=>{return [
            prevAlpha[7],
            prevAlpha[0],
            prevAlpha[1],
            prevAlpha[2],
            prevAlpha[3],
            prevAlpha[4],
            prevAlpha[5],
            prevAlpha[6],
        ];
    })

    }
    
    
    return(
        <>
        <View className='mainContainer' style={styles.mainContainer}>
            <View id='box' style={{position:'absolute',top:'90%',right:'35%',backgroundColor:init[0]}}><Text id='bottom'>{init[0]}</Text></View>
            <View id='box' style={{position:'absolute',top:'90%',right:'65%',backgroundColor:init[1]}}><Text id='bottom'>{init[1]}</Text></View>
            <View id='box' style={{position:'absolute' ,top:'65%',backgroundColor:init[2]}}><Text id='left'>{init[2]}</Text></View>
            <View id='box'style={{position:'absolute',top:'35%',backgroundColor:init[3]}}><Text id='left'>{init[3]}</Text></View>
            <View id='box' style={{position:'absolute',left:'35%',backgroundColor:init[4]}}><Text id='top'>{init[4]}</Text></View>
            <View id='box' style={{position:'absolute',left:'65%',backgroundColor:init[5]}}><Text id='top'>{init[5]}</Text></View>
            <View id='box' style={{position:'absolute',top:'35%',left:'90%',backgroundColor:init[6]}}><Text id='right'>{init[6]}</Text></View>
            <View id='box' style={{position:'absolute',top:'65%',left:'90%',backgroundColor:init[7]}}><Text id='right'>{init[7]}</Text></View>


        </View>
        <View id='buttonId'>
            <TouchableOpacity onPress={RotateAlphabet} style={styles.ButtonStyle}><Text>Click</Text></TouchableOpacity>
        
        </View>

        </>
        
    )
}

const styles=StyleSheet.create({
mainContainer:{

width:'100%',
height:'50%',
},
ButtonStyle:{

width:'10%',
flex:1,
flexDirection:'column',
textAlign:'center',
alignItems:'center'
},
})


