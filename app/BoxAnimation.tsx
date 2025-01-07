import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const SquarePathAnimation = () => {


  const containerSize = 300;
  const boxSize = 30;
  const totalBoxes = 8;
  const step = 5; 
  const delay = 9; 

  const animatedValues = useRef(
    Array.from({ length: totalBoxes }, () => ({ x: new Animated.Value(0), y: new Animated.Value(0) }))
  ).current;

  useEffect(() => {
    const animateBox = (box, offset) => {
      const animate = (direction, x, y) => {
        let targetX = x;
        let targetY = y;

        if (direction === 0) targetX = containerSize - boxSize; 
        else if (direction === 1) targetY = containerSize - boxSize; 
        else if (direction === 2) targetX = 0; 
        else if (direction === 3) targetY = 0; 

        Animated.timing(box[direction % 2 === 0 ? 'x' : 'y'], {
          toValue: direction % 2 === 0 ? targetX : targetY,
          duration: ((containerSize - boxSize) / step) * 16, 
          useNativeDriver: false,
        }).start(() => {
          animate((direction + 1) % 4, targetX, targetY);
        });
      };

      setTimeout(() => animate(0, 0, 0), offset * 16); 
    };

    animatedValues.forEach((box, i) => {
      animateBox(box, i * delay);
    });
  }, [animatedValues]);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {animatedValues.map((box, index) => (
          <Animated.View
            key={index}
            style={[
              styles.box,
              {
                transform: [
                  { translateX: box.x },
                  { translateY: box.y },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: 400,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'skyblue',
    padding:40,
    borderWidth: 2,
    borderColor: 'red',
  },
  container: {
    width: 300,
    height: 300,
    position: 'relative',
  },
  box: {
    width: 30,
    height: 30,
    backgroundColor: '#d81010',
    position: 'absolute',
  },
});

export default SquarePathAnimation;
