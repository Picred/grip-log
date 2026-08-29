import { Platform } from 'react-native';

const dbModule = Platform.OS === 'web' ? require('./database.web') : require('./database.native');

export const migrateDatabase = dbModule.migrateDatabase;
export const getExerciseCatalog = dbModule.getExerciseCatalog;
export const createSession = dbModule.createSession;
export const getPendingSyncRecords = dbModule.getPendingSyncRecords;
export const markRecordSynced = dbModule.markRecordSynced;
export const createExercise = dbModule.createExercise;
export const createSet = dbModule.createSet;
export const getSessionHistory = dbModule.getSessionHistory;
export const getPendingSyncCount = dbModule.getPendingSyncCount;
export const initDatabase = dbModule.initDatabase;
