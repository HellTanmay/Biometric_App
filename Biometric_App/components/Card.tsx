// src/components/Card.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface CardProps {
    children: React.ReactNode;
    style?: any;
}

interface CardContentProps {
    children: React.ReactNode;
}

export function Card({ children, style }: CardProps) {
    return <View style={[styles.card, style]}>{children}</View>;
}

export function CardContent({ children }: CardContentProps) {
    return <View style={styles.content}>{children}</View>;
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    content: {
        padding: 20,
    },
});
