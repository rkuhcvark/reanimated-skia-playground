/** @format */

import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Routes } from '../Routes';

const examples = [
  {
    screen: 'SpeedTest',
    title: '💯 SpeedTest',
  },
  {
    screen: 'DigitMeter',
    title: '💯 Speedometer',
  },
  {
    screen: 'Sample',
    title: 'Sample',
  },
] as const;

const Examples = () => {
  const { navigate } = useNavigation<StackNavigationProp<Routes, 'Examples'>>();
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}>
      {examples.map(({ screen, title }) => (
        <RectButton
          key={screen}
          onPress={() => navigate(screen)}>
          <View style={styles.thumbnail}>
            <Text style={styles.title}>{title}</Text>
          </View>
        </RectButton>
      ))}
    </ScrollView>
  );
};

export default Examples;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f2f2f2',
  },
  content: {
    paddingBottom: 32,
  },
  thumbnail: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#f2f2f2',
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
  },
});
