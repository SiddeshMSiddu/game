import React, { useRef, useEffect } from "react";
import { Text, View, StyleSheet, Animated } from "react-native";
import "./design.css";

export default function App() {
  const Alphabets = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const animatedValues = useRef(
    Array.from({ length: Alphabets.length }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      rotate: new Animated.Value(0), 
    }))
  ).current;

  useEffect(() => {
    const animateBox = (box, delay) => {
      const animate = (direction, x, y, rotate) => {
        let targetX = x;
        let targetY = y;
        let targetRotate = rotate;

        if (direction === 0){ 
          targetX = 300;
          targetRotate = 180;
        }
        else if (direction === 1) {
          targetY = 300;
          targetRotate = 270; 
        } else if (direction === 2){
          targetX = 0;
          targetRotate = 0; 
        } 
        else if (direction === 3) {
          targetY = 0;
          targetRotate = 90; 
        }

        Animated.parallel([
          Animated.timing(box[direction % 2 === 0 ? "x" : "y"], {
            toValue: direction % 2 === 0 ? targetX : targetY,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(box.rotate, {
            toValue: targetRotate,
            duration: 10,
            useNativeDriver: false,
          }),
        ]).start(() => {
          animate((direction + 1) % 4, targetX, targetY, targetRotate);
        });
      };

      setTimeout(() => animate(0, 0, 0, 0), delay);
    };

    animatedValues.forEach((box, index) => {
      animateBox(box, index * 150);
    });
  }, []);

  return (
    <>
      <View style={styles.mainContainer}>
        <View
          className="innerContainer"
          style={styles.innerContainer}
          id="innerContainer"
        >
          {Alphabets.map((alphabet, index) => (
            <Animated.View
              key={index}
              style={[
                styles.box,
                {
                  backgroundColor: "red",
                  transform: [
                    { translateX: animatedValues[index].x },
                    { translateY: animatedValues[index].y },
                    {
                      rotate: animatedValues[index].rotate.interpolate({
                        inputRange: [0, 360],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.text}>{alphabet}</Text>
            </Animated.View>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 2,
    borderColor: "red",
    width: "100%",
    height: "100%",
  },
  innerContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    borderWidth: 2,
    borderColor: "red",
    padding: 40,
  },
  box: {
    position: "absolute",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
  },
});
