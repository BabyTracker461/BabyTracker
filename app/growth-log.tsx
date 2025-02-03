import {
    Text,
    Platform,
    View,
    Pressable,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    Modal,
    Button,
    Dimensions
} from 'react-native'
import React, { useRef, useState, useEffect } from 'react'
import { Stack, useNavigation } from 'expo-router'
import { Calendar, DateData } from 'react-native-calendars';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import supabase from './lib/supabase-client'
import { LineChart } from 'react-native-chart-kit';

export interface GrowthLog{
    id: number;
    height: number;
    weight: number;
    headC:number;
    note?:string;
    logged_at:string;
}

export default function GrowthLogs(){
    
    const [filterHeight, setFilterHeight] = useState(true);
    const [filterWeight, setFilterWeight] = useState(false);
    const [filterHeadC, setFilterHeadC] = useState(false);
    const [growthLogs, setGrowthLogs] = useState<GrowthLog[]>([]);
    
    const fetchLogs = async () => {
        try {
            let selectedColumns = ['id', 'logged_at', 'height', 'weight', 'headC'];
                
            let query = supabase
                .from('growth_log')
                .select(selectedColumns.join(','))
                .order('logged_at', { ascending: false });
            const { data, error } = await query;

            console.log('Data:', data); // Log the response data
            console.log('Error:', error); // Log the error message (if any)
            
            if (Array.isArray(data)) {
                // Ensure the data is an array and map to GrowthLog[]
                const growthLogs: GrowthLog[] = data.map(item => ({
                    id: item.id,
                    height: item.height,
                    weight: item.weight,
                    headC: item.headC,
                    logged_at: item.logged_at, // Keeping it as string for now
                    note: item.note, // Optional field
                }));
                console.log('Mapped GrowthLogs:', growthLogs);
                setGrowthLogs(growthLogs); 
            } else {
                console.error('Data is not an array');
            }
        }
        catch(error){
            console.error('Unexpected error', error);
        }
    }


    useEffect(() => {
        fetchLogs(); // Call fetchLogs when the component mounts
    }, []);


    return(
        <View className='box-container'>
            <View className='flex-col gap-5'>
                <View className="flex-row justify-between">
                <View style={{ marginTop: 20 }}>
                <View>
                    {growthLogs.length > 0 && (
                        <LineChart
                            data={{
                                labels: growthLogs.map(log => log.logged_at), // X-axis (dates)
                                datasets: [
                                    filterHeight && {
                                        data: growthLogs.map(log => log.height),
                                        color: () => 'blue',
                                        strokeWidth: 2,
                                    },
                                    filterWeight && {
                                        data: growthLogs.map(log => log.weight),
                                        color: () => 'green',
                                        strokeWidth: 2,
                                    },
                                    filterHeadC && {
                                        data: growthLogs.map(log => log.headC),
                                        color: () => 'red',
                                        strokeWidth: 2,
                                    },
                                ].filter(Boolean), // Remove null values
                            }}
                            width={Dimensions.get('window').width - 40} // Graph width
                            height={220}
                            yAxisLabel=""
                            chartConfig={{
                                backgroundColor: "#fff",
                                backgroundGradientFrom: "#fff",
                                backgroundGradientTo: "#fff",
                                decimalPlaces: 1,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: { borderRadius: 16 },
                            }}
                            style={{ marginVertical: 8, borderRadius: 16 }}
                        />
                    )}
                </View>

            </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                <Pressable 
                    className='button'
                    onPress={() => {
                    setFilterHeight(true);
                    setFilterWeight(false);
                    setFilterHeadC(false); 
                    }}>
                    <Text style={{ color: filterHeight ? 'blue' : 'black' }}>Height</Text>
                </Pressable>
                <Pressable 
                    className='button'
                    onPress={() => {
                    setFilterHeight(false);
                    setFilterWeight(true);
                    setFilterHeadC(false); 
                    }}>
                    <Text style={{ color: filterWeight ? 'blue' : 'black' }}>Weight</Text>
                </Pressable>
                <Pressable
                    className='button'
                    onPress={() => {
                    setFilterHeight(false);
                    setFilterWeight(false);
                    setFilterHeadC(true); 
                    }}>
                    <Text style={{ color: filterHeadC ? 'blue' : 'black' }}>HeadC</Text>
                </Pressable>
            </View>
        </View>
        
    )
}