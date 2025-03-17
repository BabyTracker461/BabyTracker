import { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

export default function Stopwatch({ onTimeUpdate }: any) {
    const [time, setTime] = useState(0)
    const [running, setRunning] = useState(false)
    const intervalRef = useRef<any>(null)

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 1)
            }, 1000)
        } else {
            clearInterval(intervalRef.current)
        }
        return () => clearInterval(intervalRef.current)
    }, [running])

    useEffect(() => {
        onTimeUpdate?.(formatElapsedTime(time))
    }, [time, onTimeUpdate])

    const reset = () => {
        setTime(0)
        setRunning(false)
        onTimeUpdate?.('00:00:00')
    }

    const formatTime = (t: number) => t.toString().padStart(2, '0')
    const formatElapsedTime = (t: number) => {
        const h = Math.floor(t / 3600)
        const m = Math.floor((t % 3600) / 60)
        const s = t % 60
        return `${formatTime(h)}:${formatTime(m)}:${formatTime(s)}`
    }

    return (
        <View className='stopwatch-primary'>
            <View className='items-start relative bottom-5 left-3'>
                <Text className='bg-gray-200 p-3 rounded-xl font'>
                    ⏱️ Stopwatch
                </Text>
            </View>
            <View className='items-center mb-10'>
                <View className='flex-row items-center'>
                    <View className='flex-row items-end'>
                        <Text className='stopwatch-clock'>
                            {formatTime(Math.floor(time / 3600))}
                        </Text>
                        <View className='items-center'>
                            <Text className='stopwatch-divider'>:</Text>
                            <Text className='stopwatch-mini'>h</Text>
                        </View>
                    </View>
                    <View className='flex-row items-end'>
                        <Text className='stopwatch-clock'>
                            {formatTime(Math.floor((time % 3600) / 60))}
                        </Text>
                        <View className='items-center'>
                            <Text className='stopwatch-divider'>:</Text>
                            <Text className='stopwatch-mini'>m</Text>
                        </View>
                    </View>
                    <View className='flex-row items-end'>
                        <Text className='stopwatch-clock'>
                            {formatTime(time % 60)}
                        </Text>
                        <View className='items-center'>
                            <Text className='stopwatch-divider'> </Text>
                            <Text className='stopwatch-mini'>s</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View className='stopwatch-secondary'>
                <TouchableOpacity
                    className='stopwatch-button dark:bg-[#d2f1e0]'
                    onPress={() => setRunning(true)}
                >
                    <Text className='stopwatch-button-text'>Start</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className='stopwatch-button dark:bg-[#f1efd2]'
                    onPress={() => setRunning(false)}
                >
                    <Text className='stopwatch-button-text'>Stop</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className='stopwatch-button dark:bg-[#f1d2d2]'
                    onPress={reset}
                >
                    <Text className='stopwatch-button-text'>Reset</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
