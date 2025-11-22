#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// ----- DHT22 -----
#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

// ----- Capteur vibration -----
#define VIBRATION_PIN 5
int lastState = HIGH;
unsigned long lastTime = 0;
int vibrationCount = 0;

// ----- WIFI -----
const char* ssid = "Joujou";
const char* password = "20022002";

// ID unique pour cette machine
String machineId = "MACHINE-CNC-02";

// ----- BACKEND -----
String serverUrl = "http://192.168.1.11:5000/api/alerts/esp";

void setup() {
  Serial.begin(115200);
  dht.begin();
  pinMode(VIBRATION_PIN, INPUT);

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
Serial.println(digitalRead(VIBRATION_PIN));
delay(100);
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

  // JSON propre envoyé au backend
  String json = "{";
  json += "\"machineId\":\"" + machineId + "\",";
  json += "\"temperature\":" + String(temperature) + ",";
  json += "\"vibrationValue\":" + String(vibrationValue);
  json += "}";

  Serial.println("JSON envoyé : " + json);

  int code = http.POST(json);
  Serial.println("Code HTTP : " + String(code));

  if (code > 0) {
    Serial.println("Réponse backend : " + http.getString());
  }

  http.end();
}
