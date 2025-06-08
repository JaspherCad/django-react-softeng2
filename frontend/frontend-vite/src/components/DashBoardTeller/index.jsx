// src/components/TellerDashboard.jsx

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './TellerDashboard.module.css';
import { SearchBillingsApi, SearchPatientsApi } from '../../api/axios';
import SearchBar from '../AngAtingSeachBarWIthDropDown';

const TellerDashboard = () => {
  // ─── State ─────────────────────────────────────────────────
  const [dateFilter, setDateFilter] = useState(new Date());
  const [billingSearch, setBillingSearch] = useState('');
  const [patientSearch, setPatientSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)  //required for SearchBar

  // placeholder data for layout
  const metrics = {
    todaysBills: 45,
    paymentsCollected: 12300,
    pendingPayments: 12,
    dailyTarget: 15000,
  };
  const billings = [
    { id: 1, patient: { name: 'Jose' }, code: 'ABC123', total_due: '1200.00', status: 'Unpaid' },
    { id: 2, patient: { name: 'Maria' }, code: 'DEF456', total_due: '3200.00', status: 'Paid' },
    { id: 3, patient: { name: 'Juan' }, code: 'GHI789', total_due: '750.00', status: 'Partial' },
  ];
  const summary = [
    { date: '2025-06-01', total: 1200 },
    { date: '2025-06-02', total: 1500 },
    { date: '2025-06-03', total: 900 },
    { date: '2025-06-04', total: 2000 },
    { date: '2025-06-05', total: 1100 },
    { date: '2025-06-06', total: 800 },
    { date: '2025-06-07', total: 950 },
  ];

  // ─── Handlers ──────────────────────────────────────────────
  const onDateChange = date => setDateFilter(date);

  return (
    <div className={styles.container}>


      <section className={styles.metrics}>
        <div className={styles.card}>
          <div className={styles.number}>{metrics.todaysBills}</div>
          <div className={styles.label}>Today's Bills</div>
        </div>
        <div className={styles.card}>
          <div className={styles.number}>₱{metrics.paymentsCollected.toLocaleString()}</div>
          <div className={styles.label}>Payments Collected</div>
        </div>
        <div className={styles.card}>
          <div className={styles.number}>{metrics.pendingPayments}</div>
          <div className={styles.label}>Pending Payments</div>
        </div>
        <div className={styles.card}>
          <div className={styles.number}>₱{metrics.dailyTarget.toLocaleString()}</div>
          <div className={styles.label}>Daily Target</div>
        </div>
      </section>

      <section className={styles.toolbar}>

        <button className={styles.primaryBtn}>New Billing</button>


        <div className={styles.searchbars}>
          <SearchBar
            placeholder={"Search Patient"}
            searchApi={SearchPatientsApi}
            // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is trigered
            //to accept throw temp function 
            onSelectSuggestion={(filtered) => console.log(filtered)}
            isIDIncludedInResultSuggestion={false}
            suggestedOutput={['code', 'name']}
            searchTerm={patientSearch}
            setSearchTerm={setPatientSearch}
            isDropdownVisible={isDropdownVisible}
            setIsDropdownVisible={setIsDropdownVisible}
          />
          <SearchBar
            placeholder={"Search Billings"}
            searchApi={SearchBillingsApi}
            // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is trigered
            //to accept throw temp function 
            onSelectSuggestion={(filtered) => console.log(filtered)}
            isIDIncludedInResultSuggestion={false}
            suggestedOutput={['code', 'patient']}
            searchTerm={billingSearch}
            setSearchTerm={setBillingSearch}
            isDropdownVisible={isDropdownVisible}
            setIsDropdownVisible={setIsDropdownVisible}
          />
        </div>


        <Calendar
          onChange={onDateChange}
          value={dateFilter}
          className={styles.calendar}
        />
      </section>

      <section className={styles.recentTransactions}>
        <h2>Recent Transactions</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Billing ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {billings.map((b, i) => (
                <tr key={b.id}>
                  <td>{i + 1}</td>
                  <td>{b.patient.name}</td>
                  <td>{b.code}</td>
                  <td>₱{parseFloat(b.total_due).toFixed(2)}</td>
                  <td>{b.status}</td>
                  <td>
                    {b.status !== 'Paid' && (
                      <button className={styles.smallBtn}>Pay</button>
                    )}
                    <button className={styles.smallBtn}>⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className={styles.linkBtn}>View All</button>
      </section>

      <section className={styles.bottom}>
        <div className={styles.chartContainer}>
          <h2>Last 7 Days Collection</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={summary}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#007acc" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <button className={styles.actionBtn}>Refund</button>
          <button className={styles.actionBtn}>Generate Report</button>
          <button className={styles.actionBtn}>Export CSV</button>
          <button className={styles.actionBtn}>Price List</button>
        </div>
      </section>
    </div>
  );
};

export default TellerDashboard;
