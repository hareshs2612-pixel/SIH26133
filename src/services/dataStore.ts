import { 
  UserProfile, 
  PatientProfile, 
  DoctorProfile, 
  HealthRecord, 
  AccessAuthorization, 
  EmergencyAccessEvent, 
  AuditLogEntry, 
  HealthcareFacility,
  AccessScope
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_PATIENTS, 
  INITIAL_DOCTORS, 
  INITIAL_RECORDS, 
  INITIAL_AUTHORIZATIONS, 
  INITIAL_EMERGENCY_EVENTS, 
  INITIAL_AUDIT_LOGS, 
  RURAL_HEALTHCARE_FACILITIES 
} from './mockData';

const STORAGE_KEYS = {
  USERS: 'sih_users_v1',
  PATIENTS: 'sih_patients_v1',
  DOCTORS: 'sih_doctors_v1',
  RECORDS: 'sih_records_v1',
  AUTHORIZATIONS: 'sih_authorizations_v1',
  EMERGENCY_EVENTS: 'sih_emergency_events_v1',
  AUDIT_LOGS: 'sih_audit_logs_v1',
  CURRENT_USER_ID: 'sih_current_user_id_v1'
};

class DataStore {
  private listeners: Array<() => void> = [];

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
      localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RECORDS)) {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_RECORDS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUTHORIZATIONS)) {
      localStorage.setItem(STORAGE_KEYS.AUTHORIZATIONS, JSON.stringify(INITIAL_AUTHORIZATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EMERGENCY_EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EMERGENCY_EVENTS, JSON.stringify(INITIAL_EMERGENCY_EVENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      // Default to Ramesh Kumar (Patient) for initial onboarding demonstration
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'pat-ramesh');
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // User Authentication & Session
  public getCurrentUser(): UserProfile {
    const uid = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'pat-ramesh';
    const users = this.getUsers();
    return users.find(u => u.uid === uid) || users[0];
  }

  public setCurrentUser(uid: string) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, uid);
    this.addAuditLog({
      actorId: uid,
      actorName: this.getUserById(uid)?.fullName || 'User',
      actorRole: this.getUserById(uid)?.role || 'patient',
      action: 'LOGIN',
      resourceType: 'patient_profile',
      details: `User session switched to ${this.getUserById(uid)?.fullName} (${this.getUserById(uid)?.role})`
    });
    this.notify();
  }

  public getUsers(): UserProfile[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  }

  public getUserById(uid: string): UserProfile | undefined {
    return this.getUsers().find(u => u.uid === uid);
  }

  // Patients
  public getPatients(): Record<string, PatientProfile> {
    const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return raw ? JSON.parse(raw) : INITIAL_PATIENTS;
  }

  public getPatientById(id: string): PatientProfile | undefined {
    const patients = this.getPatients();
    return patients[id];
  }

  public updatePatient(profile: PatientProfile) {
    const patients = this.getPatients();
    patients[profile.id] = profile;
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    this.notify();
  }

  // Doctors
  public getDoctors(): Record<string, DoctorProfile> {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCTORS);
    return raw ? JSON.parse(raw) : INITIAL_DOCTORS;
  }

  public getDoctorById(id: string): DoctorProfile | undefined {
    const docs = this.getDoctors();
    return docs[id];
  }

  // Health Records
  public getRecords(): HealthRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return raw ? JSON.parse(raw) : INITIAL_RECORDS;
  }

  public getRecordsForPatient(patientId: string): HealthRecord[] {
    const all = this.getRecords();
    return all
      .filter(r => r.patientId === patientId)
      .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
  }

  public getRecordById(id: string): HealthRecord | undefined {
    return this.getRecords().find(r => r.id === id);
  }

  public addRecord(record: HealthRecord) {
    const records = this.getRecords();
    records.unshift(record);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    
    this.addAuditLog({
      actorId: record.authorId,
      actorName: record.authorName,
      actorRole: record.authorRole,
      action: record.source === 'uploaded_document' ? 'UPLOAD_DOCUMENT' : 'CREATE_RECORD',
      resourceType: 'health_record',
      resourceId: record.id,
      patientId: record.patientId,
      details: `${record.category.toUpperCase()}: ${record.title} [Source: ${record.source}]`
    });

    this.notify();
  }

  public updateRecord(record: HealthRecord) {
    const records = this.getRecords().map(r => r.id === record.id ? record : r);
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
    this.notify();
  }

  // Consents & Authorizations
  public getAuthorizations(): AccessAuthorization[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTHORIZATIONS);
    return raw ? JSON.parse(raw) : INITIAL_AUTHORIZATIONS;
  }

  public getAuthorizationsForPatient(patientId: string): AccessAuthorization[] {
    return this.getAuthorizations().filter(a => a.patientId === patientId);
  }

  public getAuthorizedPatientsForDoctor(doctorId: string): string[] {
    return this.getAuthorizations()
      .filter(a => a.doctorId === doctorId && a.status === 'active')
      .map(a => a.patientId);
  }

  public hasDoctorAccess(patientId: string, doctorId: string): boolean {
    return this.getAuthorizations().some(
      a => a.patientId === patientId && a.doctorId === doctorId && a.status === 'active'
    );
  }

  public grantDoctorAccess(patientId: string, doctorId: string, scope: AccessScope = 'full_longitudinal') {
    const authorizations = this.getAuthorizations();
    const docProfile = this.getDoctorById(doctorId);
    const docUser = this.getUserById(doctorId);
    const patientUser = this.getUserById(patientId);

    const existingIndex = authorizations.findIndex(
      a => a.patientId === patientId && a.doctorId === doctorId
    );

    const newAuth: AccessAuthorization = {
      id: `auth-${Date.now()}`,
      patientId,
      doctorId,
      doctorName: docUser?.fullName || 'Physician',
      doctorSpecialization: docProfile?.specialization || 'Medical Officer',
      doctorHospital: docProfile?.hospitalAffiliation || 'Public Health Centre',
      status: 'active',
      scope,
      requestedAt: new Date().toISOString(),
      grantedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      authorizations[existingIndex] = newAuth;
    } else {
      authorizations.unshift(newAuth);
    }

    localStorage.setItem(STORAGE_KEYS.AUTHORIZATIONS, JSON.stringify(authorizations));

    this.addAuditLog({
      actorId: patientId,
      actorName: patientUser?.fullName || 'Patient',
      actorRole: 'patient',
      action: 'GRANT_CONSENT',
      resourceType: 'consent',
      resourceId: newAuth.id,
      patientId,
      details: `Granted ${scope} medical record access to ${newAuth.doctorName} (${newAuth.doctorHospital})`
    });

    this.notify();
  }

  public revokeDoctorAccess(authorizationId: string, reason: string = 'Revoked by patient request') {
    const authorizations = this.getAuthorizations();
    const target = authorizations.find(a => a.id === authorizationId);
    if (!target) return;

    target.status = 'revoked';
    target.revokedAt = new Date().toISOString();
    target.revocationReason = reason;

    localStorage.setItem(STORAGE_KEYS.AUTHORIZATIONS, JSON.stringify(authorizations));

    this.addAuditLog({
      actorId: target.patientId,
      actorName: this.getUserById(target.patientId)?.fullName || 'Patient',
      actorRole: 'patient',
      action: 'REVOKE_CONSENT',
      resourceType: 'consent',
      resourceId: target.id,
      patientId: target.patientId,
      details: `Revoked access for ${target.doctorName}. Reason: ${reason}`
    });

    this.notify();
  }

  // Controlled Emergency Access
  public triggerEmergencyAccess(params: {
    patientId: string;
    requesterId: string;
    requesterName: string;
    requesterRole: string;
    requesterFacility: string;
    emergencyBadgeId: string;
    clinicalReason: string;
  }): EmergencyAccessEvent {
    const patientUser = this.getUserById(params.patientId);
    const events: EmergencyAccessEvent[] = this.getEmergencyEvents();

    const newEvent: EmergencyAccessEvent = {
      id: `emg-${Date.now()}`,
      patientId: params.patientId,
      patientName: patientUser?.fullName || 'Patient',
      requesterId: params.requesterId,
      requesterName: params.requesterName,
      requesterRole: params.requesterRole,
      requesterFacility: params.requesterFacility,
      emergencyBadgeId: params.emergencyBadgeId,
      clinicalReason: params.clinicalReason,
      grantedScope: 'emergency_minimum_dataset',
      accessedAt: new Date().toISOString(),
      auditHash: `sha256:${Math.random().toString(36).substring(2)}${Date.now()}`,
      acknowledgedByPatient: false
    };

    events.unshift(newEvent);
    localStorage.setItem(STORAGE_KEYS.EMERGENCY_EVENTS, JSON.stringify(events));

    this.addAuditLog({
      actorId: params.requesterId,
      actorName: params.requesterName,
      actorRole: 'doctor',
      action: 'TRIGGER_EMERGENCY_ACCESS',
      resourceType: 'emergency_access',
      resourceId: newEvent.id,
      patientId: params.patientId,
      details: `EMERGENCY OVERRIDE ACTIVATED! Facility: ${params.requesterFacility} | Badge: ${params.emergencyBadgeId} | Reason: ${params.clinicalReason} | Scope: Emergency Minimum Dataset`
    });

    this.notify();
    return newEvent;
  }

  public getEmergencyEvents(patientId?: string): EmergencyAccessEvent[] {
    const raw = localStorage.getItem(STORAGE_KEYS.EMERGENCY_EVENTS);
    const all: EmergencyAccessEvent[] = raw ? JSON.parse(raw) : INITIAL_EMERGENCY_EVENTS;
    if (patientId) {
      return all.filter(e => e.patientId === patientId);
    }
    return all;
  }

  public acknowledgeEmergencyEvent(eventId: string) {
    const events = this.getEmergencyEvents();
    const target = events.find(e => e.id === eventId);
    if (target) {
      target.acknowledgedByPatient = true;
      localStorage.setItem(STORAGE_KEYS.EMERGENCY_EVENTS, JSON.stringify(events));
      this.notify();
    }
  }

  // Audit Logs
  public getAuditLogs(patientId?: string): AuditLogEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    const all: AuditLogEntry[] = raw ? JSON.parse(raw) : INITIAL_AUDIT_LOGS;
    if (patientId) {
      return all.filter(l => l.patientId === patientId || !l.patientId);
    }
    return all.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const logs = this.getAuditLogs();
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newEntry);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 200))); // keep last 200 logs
  }

  // Facilities
  public getFacilities(): HealthcareFacility[] {
    return RURAL_HEALTHCARE_FACILITIES;
  }

  // Reset to initial mock dataset
  public resetToMockData() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(INITIAL_DOCTORS));
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(INITIAL_RECORDS));
    localStorage.setItem(STORAGE_KEYS.AUTHORIZATIONS, JSON.stringify(INITIAL_AUTHORIZATIONS));
    localStorage.setItem(STORAGE_KEYS.EMERGENCY_EVENTS, JSON.stringify(INITIAL_EMERGENCY_EVENTS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'pat-ramesh');
    this.notify();
  }
}

export const dataStore = new DataStore();
