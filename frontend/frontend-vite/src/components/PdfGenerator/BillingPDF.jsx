// BillingPDF.jsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 18,
    marginBottom: 5
  },
  subtitle: {
    fontSize: 12,
    color: '#555'
  },
  section: {
    marginBottom: 15
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 15
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    paddingTop: 5
  },
  tableCell: {
    flex: 1,
    paddingRight: 5
  },
  bold: {
    fontWeight: 'bold'
  },
  total: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    color: '#666'
  },
  statusBadge: (status) => ({
    backgroundColor: status === 'Paid' ? '#e6ffe6' : '#ffebee',
    padding: 5,
    borderRadius: 5,
    textAlign: 'center',
    width: 80,
    alignSelf: 'flex-start'
  })
});

const BillingPDF = ({ billingData }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTotal = () => {
    return billingData.billing_items.reduce(
      (total, item) => total + parseFloat(item.subtotal),
      0
    ).toFixed(2);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Hospital Billing Statement</Text>
          <Text style={styles.subtitle}>Bill ID: {billingData.code}</Text>
        </View>

        {/* Patient Info */}
        <View style={styles.section}>
          <Text style={styles.bold}>Patient Information</Text>
          <Text>Patient ID: {billingData.patient.code}</Text>
          <Text>Name: {billingData.patient.name}</Text>
          <Text>Status: {billingData.patient.status}</Text>
          <Text>Admission Date: {formatDate(billingData.patient.admission_date)}</Text>
          <Text>Discharge Date: {billingData.patient.discharge_date 
            ? formatDate(billingData.patient.discharge_date) 
            : 'N/A'}
          </Text>
        </View>

        {/* Billing Details */}
        <View style={styles.section}>
          <Text style={styles.bold}>Billing Details</Text>
          <Text>Date: {formatDate(billingData.date_created)}</Text>
          <Text>Status: 
            <Text style={styles.statusBadge(billingData.status)}>
              {billingData.status}
            </Text>
          </Text>
          <Text>Prepared by: {billingData.created_by.role} ({billingData.created_by.user_id})</Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}><Text style={styles.bold}>Service</Text></Text>
            <Text style={styles.tableCell}><Text style={styles.bold}>Quantity</Text></Text>
            <Text style={styles.tableCell}><Text style={styles.bold}>Unit Price</Text></Text>
            <Text style={styles.tableCell}><Text style={styles.bold}>Total</Text></Text>
          </View>
          
          {billingData.billing_items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{item.service_name}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              {/* <Text style={styles.tableCell}>₱{parseFloat(item.service.cost).toFixed(2)}</Text> */}
              <Text style={styles.tableCell}>₱{parseFloat(item.subtotal).toFixed(2)}</Text>
            </View>
          ))}

          {/* Total Row */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}></Text>
            <Text style={styles.tableCell}><Text style={styles.bold}>Grand Total:</Text></Text>
            <Text style={styles.total}>₱{calculateTotal()}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>This is a computer-generated document. No signature required.</Text>
          <Text>Generated on: {formatDate(new Date().toISOString())}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default BillingPDF;