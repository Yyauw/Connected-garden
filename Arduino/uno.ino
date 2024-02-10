#include <ArduinoJson.h>
#define wet 360
#define dry 620
#define wet2 360
#define dry2 620
#define light 680
#define dark 10

String message = "";
bool messageReady = false;

void setup() {
  Serial.begin(9600);
}

void loop() {
  int Luz = analogRead(A0);
  int value1 = analogRead(A1);
  int value2 = analogRead(A2);
  int value3 = analogRead(A3);
  int value4 = analogRead(A4);
  int value5 = analogRead(A5);
  Serial.println(" ");
  int prLuz = map(Luz, light, dark, 100, 0);
  int planta1 = map(value1, wet, dry, 100, 0);
  int planta2 = map(value2, wet, dry, 100, 0);
  int planta3 = map(value3, wet2, dry2, 100, 0);
  int planta4 = map(value4, wet, dry, 100, 0);
  int planta5 = map(value5, wet, dry, 100, 0);
  // Only process message if there's one
    // The only messages we'll parse will be formatted in JSON
    DynamicJsonDocument doc(1024); // ArduinoJson version 6+
    // Attempt to deserialize the message
      doc["type"] = "response";
      // Get data from analog sensors
      doc["luz"] = prLuz;
      doc["planta1"] = planta1;
      doc["planta2"] = planta2;
      doc["planta3"] = planta3;
      doc["planta4"] = planta4;
      doc["planta5"] = planta5;
      serializeJson(doc,Serial);
      delay(5000);
}