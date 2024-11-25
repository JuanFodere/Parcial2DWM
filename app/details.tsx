import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, Image, TextInput, Button, Alert } from "react-native";
import { useEffect, useState } from "react";
import { getInfoById } from "@/api.tsx";

const Details = () => {
  const params = useLocalSearchParams();
  const [equipo, setEquipo] = useState({} as any);
  const [isEditing, setIsEditing] = useState(false);
  const [equipoEditado, setEquipoEditado] = useState({} as any);

  useEffect(() => {
    const fetchInfo = async () => {
      const response = await getInfoById(params.id as string);
      setEquipo(response);
      setEquipoEditado(response);
    };

    fetchInfo();
  }, [params.id]);

  const equipoAcutalizado = async () => {
    try {
      const response = await fetch(`http://161.35.143.238:8000/jfodere/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(equipoEditado),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setEquipo(updatedData);
        setIsEditing(false);
        Alert.alert("Éxito", "Se ectalizo el equipo correctamente.");
      } else {
        Alert.alert("Error", "No se pudo actualizar el equipo.");
      }
    } catch (error) {
      console.error("No se pudo actualizar el equipo:", error);
      Alert.alert("Error", "Hubo un problema al conectar con el servidor.");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Detalles del equipo",
          headerStyle: { backgroundColor: "#f4511e" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      {isEditing ? (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre del equipo"
            value={equipoEditado.name}
            onChangeText={(text) => setEquipoEditado({ ...equipoEditado, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={equipoEditado.description}
            onChangeText={(text) => setEquipoEditado({ ...equipoEditado, description: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Imagen URL"
            value={equipoEditado.image}
            onChangeText={(text) => setEquipoEditado({ ...equipoEditado, image: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Goles anotados"
            value={equipoEditado.goals}
            onChangeText={(text) => setEquipoEditado({ ...equipoEditado, goals: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Puntos conseguidos"
            value={equipoEditado.points}
            onChangeText={(text) => setEquipoEditado({ ...equipoEditado, points: text })}
          />
          <Button color={"green"} title="Confirmar Edición" onPress={equipoAcutalizado}/>
          <Button color={"red"} title="Cancelar" onPress={() => setIsEditing(false)} />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.title}>{equipo.name}</Text>
          <Text>{equipo.description}</Text>
          <Text>Cantidad de goles anotados: {equipo.goals}</Text>
          <Text>Puntos: {equipo.points}</Text>
          <Button title="Editar Equipo" onPress={() => setIsEditing(true)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "90%",
    margin: 16,
    padding: 16,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
    padding: 5,
  },
});

export default Details;
