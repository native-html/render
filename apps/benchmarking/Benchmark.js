/* eslint-disable no-undef */
import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Button,
  ActivityIndicator
} from 'react-native';
import { mean } from 'ramda';
import { match } from 'react-states';
import useBenchmark from './useBenchmark';

function Benchmarks({ benchmarks }) {
  return (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsTitle}>Average Time to Render:</Text>
      {benchmarks.map((e) => (
        <Text key={e.name} style={styles.resultItem}>
          {e.name}: {mean(e.values).toFixed(2)}ms
        </Text>
      ))}
    </View>
  );
}

function ProgressIndicator({
  runId,
  runs,
  profileId,
  numOfProfiles,
  profileName
}) {
  const overallProgress = (
    ((profileId * runs + runId + 1) / (numOfProfiles * runs)) *
    100
  ).toFixed(0);

  return (
    <View style={styles.progressContainer}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.progressTitle}>Benchmarking in Progress...</Text>
      <Text style={styles.progressText}>
        Profile: {profileName} ({profileId + 1}/{numOfProfiles})
      </Text>
      <Text style={styles.progressText}>
        Run: {runId + 1}/{runs}
      </Text>
      <Text style={styles.progressPercentage}>{overallProgress}% Complete</Text>
    </View>
  );
}

function WaitingIndicator() {
  return (
    <Text style={styles.waitingText}>Waiting for benchmark to launch</Text>
  );
}

export default function Benchmark({
  samples,
  html,
  tagsStyles,
  classesStyles
}) {
  const {
    onLayout,
    launch,
    profile: currentProfile,
    ...state
  } = useBenchmark({
    runs: samples
  });
  const renderHtml = React.useCallback(
    ({ runId }) => {
      if (!currentProfile) return null;
      return (
        <View key={runId} onLayout={onLayout}>
          <currentProfile.component
            running={true}
            html={html}
            tagsStyles={tagsStyles}
            classesStyles={classesStyles}
            {...currentProfile.props}
          />
        </View>
      );
    },
    [html, onLayout, currentProfile, tagsStyles, classesStyles]
  );

  const renderWaitBench = React.useCallback(
    ({ benchmarks }) =>
      benchmarks ? (
        <Benchmarks benchmarks={benchmarks} />
      ) : (
        <WaitingIndicator />
      ),
    []
  );

  const isRunning = state.state === 'RUNNING' || state.state === 'WAIT_RUN';

  return (
    <View style={styles.wrapper}>
      <View style={styles.buttonContainer}>
        <Button
          title="Run Benchmark"
          onPress={launch}
          disabled={state.state !== 'WAIT_BENCH'}
        />
      </View>

      {isRunning && currentProfile && (
        <ProgressIndicator
          runId={state.runId}
          runs={state.runs}
          profileId={state.profileId}
          numOfProfiles={state.numOfProfiles}
          profileName={currentProfile.name}
        />
      )}

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {match(state, {
          WAIT_BENCH: renderWaitBench,
          WAIT_RUN: renderHtml,
          RUNNING: renderHtml
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  buttonContainer: {
    paddingTop: 40,
    marginBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    zIndex: 10
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20
  },
  progressContainer: {
    backgroundColor: '#E3F2FD',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#90CAF9'
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
    marginTop: 12,
    marginBottom: 8
  },
  progressText: {
    fontSize: 14,
    color: '#1565C0',
    marginTop: 4
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginTop: 12
  },
  resultsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333'
  },
  resultItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555'
  },
  waitingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20
  }
});
