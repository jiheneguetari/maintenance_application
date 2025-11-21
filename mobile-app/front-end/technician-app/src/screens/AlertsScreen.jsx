import { useEffect, useState, useCallback } from "react";
import { 
    View, 
    Text, 
    TouchableOpacity, 
    FlatList, 
    ActivityIndicator,
    StyleSheet // Importation de StyleSheet
} from "react-native";
import api from "../api/axios";

export default function AlertsScreen({ navigation }) {
    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); // Ajout pour gérer les erreurs réseau

    // Fonction pour récupérer les alertes, enveloppée dans useCallback
    const fetchAlerts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await api.get("/alerts");
            
            // FILTRAGE CÔTÉ FRONT-END : Afficher uniquement les alertes non résolues/ignorées
            const filteredAlerts = res.data.filter(
                // On affiche 'active' et 'en_cours'
                alert => alert.status !== "resolue" && alert.status !== "ignoree"
            );
            setAlerts(filteredAlerts);
        } catch (err) {
            console.error("Erreur lors de la récupération des alertes:", err);
            setError("Impossible de charger les alertes. Vérifiez la connexion au serveur.");
        } finally {
            setIsLoading(false);
        }
    }, []);


    useEffect(() => {
        // 1. Déclenchement initial et abonnement au focus
        const unsubscribe = navigation.addListener('focus', () => {
            fetchAlerts();
        });

        // 2. Nettoyage de l'abonnement lors du démontage
        return unsubscribe;
    }, [navigation, fetchAlerts]); // Dépendances requises

    
    // --- RENDU BASÉ SUR L'ÉTAT ---
    
    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Chargement des alertes...</Text>
            </View>
        );
    }
    
    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchAlerts} style={styles.retryButton}>
                    <Text style={styles.retryText}>Réessayer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // --- RENDU PRINCIPAL ---

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Alertes à Traiter</Text>
            
            {alerts.length === 0 && (
                <Text style={styles.emptyText}>
                    Félicitations ! Aucune alerte active ou en cours.
                </Text>
            )}

            <FlatList
                data={alerts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.card,
                            // Utilisation d'une fonction pour déterminer la couleur du statut
                            getStatusStyle(item.status) 
                        ]}
                        // Assurez-vous d'envoyer l'ID pour la page de détails
                        onPress={() => navigation.navigate("AlertDetails", { id: item._id })}
                    >
                        {/* Utilisation de machineId qui est présent dans vos données */}
                        <Text style={styles.title}>{item.machineId}</Text> 
                        <Text>Type: {item.type}</Text>
                        <Text>Valeur: {item.value}</Text>
                        <Text>Statut: 
                            <Text style={styles.statusText}> {item.status.toUpperCase()}</Text>
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

// Fonction utilitaire pour le style conditionnel
const getStatusStyle = (status) => {
    switch (status) {
        case 'active':
            return { backgroundColor: '#FFDDDD', borderColor: '#FF0000' };
        case 'en_cours':
            return { backgroundColor: '#FFFFAA', borderColor: '#FFA500' };
        default:
            return { backgroundColor: '#eee' };
    }
}


const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20 
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: { 
        fontSize: 26, 
        fontWeight: "bold", 
        marginTop: 40,
        marginBottom: 10
    },
    loadingText: { 
        textAlign: 'center', 
        color: 'gray', 
        marginTop: 10 
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center'
    },
    emptyText: {
        marginTop: 20, 
        color: 'gray',
        fontSize: 16 
    },
    card: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd'
    },
    title: { 
        fontSize: 18, 
        fontWeight: "bold",
        marginBottom: 5 
    },
    statusText: { 
        fontWeight: 'bold', 
        color: '#333' 
    },
    retryButton: {
        padding: 10,
        backgroundColor: '#007AFF',
        borderRadius: 5,
    },
    retryText: {
        color: 'white',
        fontWeight: 'bold',
    }
});