#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <ArduinoJson.h>

// ----- DHT22 -----
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// ----- Capteur vibration -----
#define VIBRATION_PIN 5
int lastState = HIGH;
unsigned long lastTime = 0;
int vibrationCount = 0;

// ----- LED -----
#define LED_PIN 2   // LED pour signaler alerte

// ----- WIFI -----
const char* ssid = "Joujou";
const char* password = "20022002";

// Machine ID
String machineId = "MACHINE-CNC-02";

// ----- Backend -----
String serverUrl = "http://192.168.1.13:5000/api/alerts/esp";


void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(VIBRATION_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);

  WiFi.begin(ssid, password);
  Serial.print("Connexion WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(300);
  }
  Serial.println("\n WiFi connecté !");
}


void loop() {

  // ----- VIBRATION -----
  int currentState = digitalRead(VIBRATION_PIN);
  if (currentState == LOW && lastState == HIGH) vibrationCount++;
  lastState = currentState;

  int vibrationValue = vibrationCount;

  if (millis() - lastTime >= 1000) {
    vibrationCount = 0;
    lastTime = millis();
  }

  // ----- TEMPERATURE -----
  float temperature = dht.readTemperature();
  if (isnan(temperature)) {
    Serial.println("Erreur lecture DHT22");
    delay(2000);
    return;
  }

  envoyerDonnees(temperature, vibrationValue);

  delay(3000);
}



void envoyerDonnees(float temperature, int vibrationValue) {

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi déconnecté !");
    return;
  }

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  // JSON envoyé au backend
  String json = "{";
  json += "\"machineId\":\"" + machineId + "\",";
  json += "\"temperature\":" + String(temperature) + ",";
  json += "\"vibrationValue\":" + String(vibrationValue);
  json += "}";

  Serial.println("JSON envoyé : " + json);

  int code = http.POST(json);
  Serial.println("Code HTTP : " + String(code));

  if (code > 0) {
    String response = http.getString();
    Serial.println("Réponse backend : " + response);

    // --- PARSER JSON ---
    StaticJsonDocument<512> doc;
    DeserializationError err = deserializeJson(doc, response);

    if (!err) {
      float seuilTemp = doc["seuilTemp"];
      float seuilVib  = doc["seuilVib"];

      Serial.println("Seuil Temp = " + String(seuilTemp));
      Serial.println("Seuil Vib = " + String(seuilVib));

      // ----- GESTION LED -----
      if (temperature > seuilTemp || vibrationValue > seuilVib) {
        digitalWrite(LED_PIN, HIGH);   // dépasse seuil → LED ON
      } else {
        digitalWrite(LED_PIN, LOW);    // normal → LED OFF
      }

    } else {
      Serial.println("Erreur parsing JSON !");
    }
  }

  http.end();
}
