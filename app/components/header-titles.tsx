import React from 'react'
import { Text, Platform } from 'react-native'
import { ExternalPathString, Link } from 'expo-router'

export function headerLeftTitle(text: string) {
    return (
        <Text
            style={{
                fontFamily: Platform.select({
                    android: 'Figtree_700ExtraBold',
                    ios: 'Figtree-ExtraBold',
                }),
            }}
            className='pl-4 text-2xl'
        >
            {text}
        </Text>
    )
}

export function headerRightTitle(
    text: string,
    icon: string,
    link: ExternalPathString,
) {
    return (
        <Link
            href={link}
            className='active:bg-blue-100 active:text-gray-400 active:border-gray-400 flex-row border-black border-2 rounded-full align-middle justify-center items-center p-2 mr-4'
        >
            <Text className='pl-2'>{icon} </Text>
            <Text className='pr-2'>{text}</Text>
        </Link>
    )
}

export default function Blank() {
    return null
}
