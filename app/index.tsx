import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, Image, StyleSheet, Button, TextInput, Alert } from "react-native";
import { getInfo } from "@/api.tsx";
import { Stack } from "expo-router";
import { Link } from "expo-router";

export default function Index() {
  const [equipos, setEquipos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEquipo, setNewEquipo] = useState({
    id: "",
    name: "",
    description: "",
    goals: 0,
    points: 0,
    logo: "",
  });

  useEffect(() => {
    const fetchInfo = async () => {
      const response = await getInfo();
      setEquipos(response);
    };

    fetchInfo();
  }, []);


  const handleAddEquipo = () => {
    setShowForm(true); 
  };


  const handleDeleteEquipo = async (id: String) => {
    try {
      const response = await fetch(`http://161.35.143.238:8000/jfodere/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        setEquipos(equipos.filter((equipo) => equipo.id !== id));
        Alert.alert("Éxito", "El equipo fue eliminado correctamente.");
      } else {
        Alert.alert("Error", "No se pudo eliminar el equipo.");
      }
    } catch (error) {
      console.error("Error al eliminar el equipo:", error);
      Alert.alert("Error", "Hubo un problema al conectar con el servidor.");
    }
  };


  const handleSubmit = async () => {
    try {
      const equipoData = {
        ...newEquipo,
    };

  

      const response = await fetch("http://161.35.143.238:8000/jfodere", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipoData), 
      });

      if (response.ok) {
        const createdEquipo = await response.json();
        setEquipos([...equipos, createdEquipo]); 
        setShowForm(false); 
        setNewEquipo({
          id: "",
          name: "",
          description: "",
          goals: 0,
          points: 0,
          logo: "",
        }); 
        Alert.alert("Éxito", "El equipo fue agregado correctamente.");
      } else {
        Alert.alert("Error", "No se pudo agregar el equipo.");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Alert.alert("Error", "Hubo un problema al conectar con el servidor.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Eliminatorias sudamericanas",
          headerStyle: { backgroundColor: "#4a90e2" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />

      {showForm ? (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Agregar Nuevo Planeta</Text>
          <TextInput
            style={styles.input}
            placeholder="ID del Planeta"
            value={newEquipo.id}
            onChangeText={(text) => setNewEquipo({ ...newEquipo, id: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre del Equipo"
            value={newEquipo.name}
            onChangeText={(text) => setNewEquipo({ ...newEquipo, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={newEquipo.description}
            onChangeText={(text) => setNewEquipo({ ...newEquipo, description: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Cantidad de goles"
            keyboardType="numeric"
            value={newEquipo.goals.toString()}
            onChangeText={(text) => setNewEquipo({ ...newEquipo, goals: (text) })}
          />
          <TextInput
            style={styles.input}
            placeholder="Cantidad de puntos"
            keyboardType="numeric"
            value={newEquipo.points.toString()}
            onChangeText={(text) => setNewEquipo({ ...newEquipo, points: (text) })}
          />
          <TextInput
            style={styles.input}
            placeholder="URL de la Imagen"
            value={newEquipo.logo}
            onChangeText={(text) => setNewEquipo({ ...newEquipo, logo: text })}
          />
          <View style={styles.buttonGroup}>
            <Button title="Guardar" onPress={handleSubmit} color="#4a90e2" />
            <Button title="Cancelar" onPress={() => setShowForm(false)} color="#f4511e" />
          </View>
        </View>
      ) : (
        <>
          {equipos &&
            equipos.map((equipo) => (
              <View key={equipo.id} style={styles.card}>
                <Link
                  href={{
                    pathname: "/details",
                    params: { id: equipo.id },
                  }}
                >
                  <Text style={styles.nombreEquipo}>{equipo.name}</Text>
                  <View>
                    <Text style={styles.descEquipo}>{equipo.description}</Text>
                  </View>
                  <Image source={{ uri: equipo.logo }} />
                </Link>
                <Button title="Eliminar" onPress={() => handleDeleteEquipo(equipo.id)} color="#f4511e" />
              </View>
            ))};

          <View style={styles.buttonContainer}>
            <Button title="Agregar Planeta" onPress={handleAddEquipo} color="#4a90e2" />
          </View>
        </>
      )
      }
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f9",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  nombreEquipo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  descEquipo: {
    fontSize: 13,
    fontWeight: "bold",
    color: "blue",
    textAlign: "right",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});
