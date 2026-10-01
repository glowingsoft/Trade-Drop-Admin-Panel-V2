import { Page, View, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';

// ----------------------------------------------------------------------

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const styles = StyleSheet.create({
  page: {
    fontSize: 9,
    lineHeight: 1.4,
    fontFamily: 'Roboto',
    backgroundColor: '#FFFFFF',
    padding: '32px 24px',
  },
  title: { fontSize: 14, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 9, color: '#637381', marginBottom: 16 },
  table: { display: 'flex', width: '100%' },
  row: {
    flexDirection: 'row',
    padding: '8px 0',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e9ecef',
  },
  headerRow: { backgroundColor: '#f4f6f8' },
  cell: { flex: 1, paddingHorizontal: 6 },
  headerCell: { fontWeight: 700 },
});

// ----------------------------------------------------------------------

export function TablePdfDocument({ title, subheader, headers, rows }) {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        {subheader && <Text style={styles.subtitle}>{subheader}</Text>}

        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]} fixed>
            {headers.map((header) => (
              <Text key={header.key} style={[styles.cell, styles.headerCell]}>
                {header.label}
              </Text>
            ))}
          </View>

          {rows.map((row, index) => (
            <View key={index} style={styles.row} wrap={false}>
              {headers.map((header) => (
                <Text key={header.key} style={styles.cell}>
                  {row[header.key] === null || row[header.key] === undefined
                    ? ''
                    : String(row[header.key])}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
