import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { logger } from '../utils/logger';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error('React ErrorBoundary', {
      message: error.message,
      componentStack: info.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const recentLogs = logger.getLogs().slice(-20);
      return (
        <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#ef4444', fontSize: 24, fontWeight: '800', marginBottom: 12 }}>
            Something went wrong
          </Text>
          <Text style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
            {this.state.error?.message}
          </Text>
          <ScrollView style={{ maxHeight: 200, width: '100%', marginBottom: 16, backgroundColor: '#1e293b', borderRadius: 8, padding: 8 }}>
            {recentLogs.map((log, i) => (
              <Text key={i} style={{ color: log.level === 'ERROR' ? '#ef4444' : '#64748b', fontSize: 10, fontFamily: 'monospace' }}>
                [{log.ts}] [{log.level}] {log.msg}
              </Text>
            ))}
          </ScrollView>
          <Pressable
            onPress={this.handleReset}
            style={{
              paddingVertical: 12,
              paddingHorizontal: 24,
              backgroundColor: '#f59e0b',
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#0f172a', fontSize: 16, fontWeight: '700' }}>
              Restart
            </Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
