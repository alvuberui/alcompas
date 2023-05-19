import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Define the styles for the table
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    table: {
      display: "table",
      width: "auto",
      marginTop: 10,
      marginBottom: 10,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableColHeader: {
      width: "20%",
      backgroundColor: "#eee",
      fontWeight: "bold",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      padding: 5,
    },
    tableCol: {
      width: "20 %",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#000",
      padding: 5,
    },
  });

export const Documento = ({ transacciones }) => {
  return (
    <Document >
        <Page size="A4" >
        <View style={styles.container}>
            <Text>Cuentas banda:</Text>
            <View style={styles.table}>
                <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                    <Text>Fecha</Text>
                </View>
                <View style={styles.tableColHeader}>
                    <Text>Motivo</Text>
                </View>
                <View style={styles.tableColHeader}>
                    <Text>Descripción</Text>
                </View>
                <View style={styles.tableColHeader}>
                    <Text>Tipo</Text>
                </View>
                <View style={styles.tableColHeader}>
                    <Text>Cantidad</Text>
                </View>
                </View>
                {transacciones.map((item) => (
                <View key={item._id} style={styles.tableRow}>
                    <View style={styles.tableCol}>
                    <Text>{item.fecha}</Text>
                    </View>
                    <View style={styles.tableCol}>
                    <Text>{item.motivo}</Text>
                    </View>
                    <View style={styles.tableCol}>
                    <Text>{item.descripcion}</Text>
                    </View>
                    <View style={styles.tableCol}>
                    <Text>{item.tipo}</Text>
                    </View>
                    <View style={styles.tableCol}>
                    <Text>{item.cantidad}</Text>
                    </View>
                </View>
                ))}
            </View>
        </View>
        </Page>
    </Document>
  )
}
