
import _                from 'underscore';
import React            from 'react';

import {
  View,
  StyleSheet,
  Text } from 'react-native';

const ThatComponent = ({progresses}) => {

  console.log('ThatComponent.render');

  var progress    = progresses[_.keys(progresses)[0]] || {};

  return (
    <View style={styles.container} >
      <ThatComponent progress={progress} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 54
  },
});

export default ThatComponent;

