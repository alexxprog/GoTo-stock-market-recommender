import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAuthState } from '../store/authSlice';
import { logout } from '../store/authSlice';
import { colors } from '../theme/colors';

export const Header = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuthState);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Text style={styles.header}>📈 Stock Market Recommender</Text>
      <View style={styles.account}>
        <View style={styles.userContainer}>
          <Text style={styles.userName}>{user?.name}</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  account: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: 4,
    padding: 8,
  },
  logoutText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  userContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  userName: {
    color: colors.textSecondary,
    fontSize: 14,
    marginRight: 12,
  },
});
