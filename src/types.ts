export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  studentId: string;
  batch?: string;
  photoURL?: string;
  role: 'student' | 'admin';
}

export interface AcademicResource {
  id: string;
  title: string;
  type: 'CT' | 'Mid' | 'Final' | 'Other';
  subject: string;
  fileUrl: string;
  uploadedBy: string;
  createdAt: any; // Firestore Timestamp
}

export interface FacultyReminder {
  id: string;
  content: string;
  facultyName: string;
  dueDate: any; // Firestore Timestamp
  priority: 'low' | 'medium' | 'high';
  createdAt: any; // Firestore Timestamp
}

export interface BatchEvent {
  id: string;
  title: string;
  description?: string;
  date: any; // Firestore Timestamp
  type: 'exam' | 'class' | 'social' | 'other';
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
