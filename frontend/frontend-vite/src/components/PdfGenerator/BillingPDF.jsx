// src/components/PdfGenerator/BillingPDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', fontSize: 10 },
  header: { marginBottom: 20, textAlign: 'center' },
  title: { fontSize: 18, marginBottom: 5 },
  subtitle: { fontSize: 12, color: '#555' },
  section: { marginBottom: 15 },
  bold: { fontWeight: 'bold' },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 4 },
  tableRow: { flexDirection: 'row', paddingTop: 4, paddingBottom: 4, borderBottomWidth: 0.5, borderBottomColor: '#ccc' },
  cell: { flex: 1, fontSize: 9 },
  rightAlign: { textAlign: 'right' },
  totalRow: { flexDirection: 'row', marginTop: 6 },
  totalLabel: { flex: 3, textAlign: 'right', fontSize: 11, fontWeight: 'bold' },
  totalValue: { flex: 1, textAlign: 'right', fontSize: 11, fontWeight: 'bold' },
  footer: { marginTop: 20, textAlign: 'center', color: '#666', fontSize: 8 }
});

export default function BillingPDF({ billingData }) {
  const formatDate = dt => new Date(dt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  // Aggregate bed assignments
  const bedMap = billingData.billing_items
    .filter(i => !i.service_availed && i.bed_assignment)
    .reduce((acc, item) => {
      const { bed } = item.bed_assignment;
      if (!acc[bed.id]) {
        acc[bed.id] = { roomName: bed.room.name, number: bed.number, hours: item.bed_assignment.total_hours, subtotal: parseFloat(item.subtotal) };
      } else {
        acc[bed.id].hours += item.bed_assignment.total_hours;
        acc[bed.id].subtotal += parseFloat(item.subtotal);
      }
      return acc;
    }, {});
  const bedList = Object.values(bedMap);

  // Service items
  const serviceList = billingData.billing_items.filter(i => i.service_availed);

  // Compute grand total
  const computedTotal = billingData.billing_items.reduce((sum, i) => sum + parseFloat(i.subtotal), 0).toFixed(2);
  const displayTotal = billingData.total_due || computedTotal;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Hospital Billing Statement</Text>
          <Text style={styles.subtitle}>Bill Code: {billingData.code}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Patient Information</Text>
          <Text>ID: {billingData.patient.code}</Text>
          <Text>Name: {billingData.patient.name}</Text>
          <Text>Status: {billingData.patient.status}</Text>
          <Text>Admission: {formatDate(billingData.patient.admission_date)}</Text>
          <Text>Discharge: {billingData.patient.discharge_date ? formatDate(billingData.patient.discharge_date) : 'N/A'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Billing Metadata</Text>
          <Text>Date Created: {formatDate(billingData.date_created)}</Text>
          <Text>Prepared by: {billingData.created_by.role} (ID: {billingData.created_by.user_id})</Text>
          <Text>Status: {billingData.status}</Text>
        </View>

        {/* Bed Assignments Table */}
        {bedList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.bold}>Bed Assignments</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.cell}>Room</Text>
              <Text style={styles.cell}>Bed#</Text>
              <Text style={[styles.cell, styles.rightAlign]}>Hours</Text>
              <Text style={[styles.cell, styles.rightAlign]}>Subtotal</Text>
            </View>
            {bedList.map((b, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.cell}>{b.roomName}</Text>
                <Text style={styles.cell}>{b.number}</Text>
                <Text style={[styles.cell, styles.rightAlign]}>{b.hours}</Text>
                <Text style={[styles.cell, styles.rightAlign]}>₱{b.subtotal.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Services Table */}
        {serviceList.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.bold}>Services Availed</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.cell}>Service</Text>
              <Text style={[styles.cell, styles.rightAlign]}>Qty</Text>
              <Text style={[styles.cell, styles.rightAlign]}>Unit Price</Text>
              <Text style={[styles.cell, styles.rightAlign]}>Subtotal</Text>
            </View>
            {serviceList.map((s, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.cell}>{s.service_name}</Text>
                <Text style={[styles.cell, styles.rightAlign]}>{s.quantity}</Text>
                <Text style={[styles.cell, styles.rightAlign]}>₱{(parseFloat(s.subtotal)/s.quantity).toFixed(2)}</Text>
                <Text style={[styles.cell, styles.rightAlign]}>₱{parseFloat(s.subtotal).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Grand Total:</Text>
          <Text style={styles.totalValue}>₱{parseFloat(displayTotal).toFixed(2)}</Text>
        </View>

        <Text style={styles.footer}>This is a computer-generated document. No signature required.</Text>
      </Page>
    </Document>
  );
}
