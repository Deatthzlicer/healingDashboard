import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

interface Healer {
  id: number;
  displayName: string;
  dashbaordConfiguration: string[];
}

interface Patient {
  id: number;
  name: string;
  displayName: string;
  age: number;
  phone: string;
  email: string;
  onboardingStatus: string;
  quickOverviewDetails: string;
  deepOverview: Symbol[];
}

interface Symbol {
  attributes: string;
  insight: string;
  dictamination: string;
  progress: string;
  solution: string;
  messageRepresentation: MessageLog;
}

interface MessageLog {
  text: string;
  assignedPatient: number;
  assignedHealer: number;
  timestamp: string;
}

interface DashboardDetails {
  user: Healer;
  PatientCorrelation: Patient[];
}

// Static JSON data for patients
const staticDashboardData: DashboardDetails = {
  user: {
    id: 1,
    displayName: 'Dr. Smith',
    dashbaordConfiguration: ['default', 'insights'],
  },
  PatientCorrelation: [
    {
      id: 1,
      name: 'John Doe',
      displayName: 'Johnny',
      age: 34,
      phone: '555-123-4567',
      email: 'john.doe@example.com',
      onboardingStatus: 'Completed',
      quickOverviewDetails: 'Recovering well, needs follow-up.',
      deepOverview: [
        {
          attributes: 'Mood',
          insight: 'Positive trend observed',
          dictamination: 'Stable',
          progress: '80',
          solution: 'Continue therapy',
          messageRepresentation: { text: 'Mood improving steadily.', assignedPatient: 1, assignedHealer: 1, timestamp: '2025-07-09T10:00:00Z' },
        },
        {
          attributes: 'Sleep',
          insight: 'Improved sleep patterns',
          dictamination: 'Good',
          progress: '90',
          solution: 'Maintain routine',
          messageRepresentation: { text: 'Sleep quality enhanced.', assignedPatient: 1, assignedHealer: 1, timestamp: '2025-07-08T09:30:00Z' },
        },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      displayName: 'Jane',
      age: 28,
      phone: '555-987-6543',
      email: 'jane.smith@example.com',
      onboardingStatus: 'In Progress',
      quickOverviewDetails: 'Initial assessment completed.',
      deepOverview: [
        {
          attributes: 'Stress',
          insight: 'High stress levels',
          dictamination: 'Needs attention',
          progress: '50',
          solution: 'Start relaxation techniques',
          messageRepresentation: { text: 'Stress management plan initiated.', assignedPatient: 2, assignedHealer: 1, timestamp: '2025-07-07T14:00:00Z' },
        },
      ],
    },
  ],
};

// Hardcoded message templates
const messageTemplates = [
  'Hello [Patient], your next appointment is scheduled for next week. Please confirm.',
  'Hi [Patient], please complete your onboarding tasks to proceed with your plan.',
  '[Patient], great progress! Let’s discuss your next steps in our upcoming session.',
];

const DashboardPage: React.FC = () => {
  const [dashboardDetails, setDashboardDetails] = useState<DashboardDetails | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [sampleMessage, setSampleMessage] = useState<MessageLog | null>(null);
  const [dateMessages, setDateMessages] = useState<MessageLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [messageHistory, setMessageHistory] = useState<MessageLog[]>([]);

  const healerId = 1;

  // Simulate fetching dashboard details
  useEffect(() => {
    setDashboardDetails(staticDashboardData);
  }, []);

  // Simulate fetching sample message
  useEffect(() => {
    if (selectedPatient) {
      const sample = staticDashboardData.PatientCorrelation.find(p => p.id === selectedPatient.id)?.deepOverview[0]?.messageRepresentation;
      setSampleMessage(sample || null);
    }
  }, [selectedPatient]);

  // Simulate fetching messages by date
  useEffect(() => {
    if (selectedPatient && selectedDate) {
      const patientMessages = staticDashboardData.PatientCorrelation
        .find(p => p.id === selectedPatient.id)
        ?.deepOverview.map(s => s.messageRepresentation)
        .filter(m => m.timestamp.startsWith(selectedDate)) || [];
      setDateMessages(patientMessages);
    }
  }, [selectedPatient, selectedDate]);

  // Handle message sending
  const handleSendMessage = () => {
    if (selectedPatient) {
      const messageText = customMessage || selectedTemplate.replace('[Patient]', selectedPatient.displayName);
      const newMessage: MessageLog = {
        text: messageText,
        assignedPatient: selectedPatient.id,
        assignedHealer: healerId,
        timestamp: new Date().toISOString(),
      };
      setMessageHistory(prev => [...prev, newMessage]);
      setCustomMessage('');
      setSelectedTemplate('');
      alert('Message sent successfully!'); // Simulated dispatch
    }
  };

  // Chart for patient symbols
  const SymbolChart: React.FC<{ patient: Patient }> = ({ patient }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const chart = new Chart(ctx, {
            type: 'bar' as const,
            data: {
              labels: patient.deepOverview.map(s => s.attributes),
              datasets: [
                {
                  label: 'Progress',
                  data: patient.deepOverview.map(s => parseFloat(s.progress) || 0),
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: { y: { beginAtZero: true } },
            },
          });
          return () => chart.destroy();
        }
      }
    }, [patient]);

    return <canvas ref={canvasRef} className="w-full h-64"></canvas>;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Patient List */}
      <div className="w-1/4 p-4 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4">Patients</h2>
        {dashboardDetails?.PatientCorrelation.map(patient => (
          <div
            key={patient.id}
            className={`p-2 cursor-pointer hover:bg-gray-200 ${selectedPatient?.id === patient.id ? 'bg-gray-200' : ''}`}
            onClick={() => setSelectedPatient(patient)}
          >
            <p><strong>{patient.displayName}</strong> ({patient.name})</p>
            <p className="text-sm">{patient.email}</p>
            <p className="text-sm">{patient.phone}</p>
            <p className="text-sm text-green-600">{patient.onboardingStatus}</p>
          </div>
        ))}
      </div>

      {/* Patient Details */}
      <div className="w-2/4 p-4">
        {selectedPatient ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedPatient.displayName}'s Details</h2>
            <p><strong>Name:</strong> {selectedPatient.name}</p>
            <p><strong>Email:</strong> {selectedPatient.email}</p>
            <p><strong>Phone:</strong> {selectedPatient.phone}</p>
            <p><strong>Age:</strong> {selectedPatient.age}</p>
            <p><strong>Onboarding Status:</strong> {selectedPatient.onboardingStatus}</p>
            <p><strong>Overview:</strong> {selectedPatient.quickOverviewDetails}</p>

            <h3 className="text-xl font-bold mt-4">Sample Message</h3>
            {sampleMessage ? (
              <p>{sampleMessage.text}</p>
            ) : (
              <p>No sample message available</p>
            )}

            <h3 className="text-xl font-bold mt-4">Messages by Date</h3>
            <input
              type="date"
              className="border p-2 mb-2"
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            {dateMessages.length > 0 ? (
              <ul className="list-disc pl-5">
                {dateMessages.map((msg, index) => (
                  <li key={index}>{msg.text} <span className="text-gray-500 text-sm">({msg.timestamp})</span></li>
                ))}
              </ul>
            ) : (
              <p>No messages for selected date</p>
            )}

            <h3 className="text-xl font-bold mt-4">Message Composer</h3>
            <select
              className="border p-2 w-full mb-2"
              value={selectedTemplate}
              onChange={(e) => setCustomMessage('') || setSelectedTemplate(e.target.value)}
            >
              <option value="">Select a template</option>
              {messageTemplates.map((template, index) => (
                <option key={index} value={template}>
                  {template.replace('[Patient]', selectedPatient.displayName).substring(0, 30) + '...'}
                </option>
              ))}
            </select>
            <textarea
              className="border p-2 w-full mb-2"
              placeholder="Or type a custom message..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              maxLength={500}
            />
            <p className="text-sm text-gray-600">Character count: {customMessage.length || selectedTemplate.length}/500</p>
            <button
              className="bg-blue-500 text-white p-2 rounded mt-2"
              onClick={handleSendMessage}
              disabled={!selectedTemplate && !customMessage}
            >
              Send Message
            </button>

            <h3 className="text-xl font-bold mt-4">Message History</h3>
            {messageHistory.length > 0 ? (
              <ul className="list-disc pl-5">
                {messageHistory
                  .filter(msg => msg.assignedPatient === selectedPatient.id)
                  .map((msg, index) => (
                    <li key={index}>
                      {msg.text.substring(0, 50) + (msg.text.length > 50 ? '...' : '')}{' '}
                      <span className="text-gray-500 text-sm">({msg.timestamp})</span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No message history</p>
            )}
          </div>
        ) : (
          <p>Select a patient to view details</p>
        )}
      </div>

      {/* Symbol Chart */}
      <div className="w-1/4 p-4 bg-white shadow-md">
        <h2 className="text-xl font-bold mb-4">Patient Insights</h2>
        {selectedPatient && selectedPatient.deepOverview.length > 0 ? (
          <SymbolChart patient={selectedPatient} />
        ) : (
          <p>No insights available</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;