#include <ESP8266WiFi.h>
//#include <ESP8266WebServer.h>
#include <ArduinoJson.h>
#include <WiFiClientSecure.h>
#include <ESP8266HTTPClient.h>

//ESP8266WebServer server;
const char* ssid = "wifi ssdid";
const char* password = "wifi pass";
unsigned long currMil = 0;
int total = 0;

WiFiClientSecure client;
HTTPClient http;


void setup()
{
  WiFi.begin(ssid,password);
  Serial.begin(9600);
  while(WiFi.status()!=WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }
  Serial.println("");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  //server.on("/",handleIndex);
  //server.begin();
}

void loop()
{
  //server.handleClient();

   DynamicJsonDocument doc(1024);
  int humedad = 0, luz = 0;
  // Reading the response
  boolean messageReady = false;
  boolean enviarDatos = true;
  String message = "";

  while(messageReady == false) { // blocking but that's ok
    if(Serial.available()) {
      message = Serial.readString();
      messageReady = true;
    }
  }

  // Attempt to deserialize the JSON-formatted message
  DeserializationError error = deserializeJson(doc,message);

  if(error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.c_str());
  }

  luz = doc["luz"];
  int planta1 = doc["planta1"];
  int planta2 = doc["planta2"];
  int planta3 = doc["planta3"];
  int planta4 = doc["planta4"];
  int planta5 = doc["planta5"];

  // Prepare the data for serving it over HTTP
  String output = "Luz: " + String(luz) + "\n";
  output += "Humedad: " + String(humedad);

  if( planta1 + planta2 + planta3 + planta4 + planta5 > total + 25){
    total = planta1 + planta2 + planta3 + planta4 + planta5;
    if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
    client.setInsecure();
    http.begin(client,"https://apiproyectoso.000webhostapp.com/?op=post");      //Specify request destination

    http.addHeader("Content-Type", "application/json");//Specify content-type header
    int httpCode = http.POST(message);   //Send the request
    String payload = http.getString();                  //Get the response payload
 
    Serial.println(httpCode);   //Print HTTP return code
    Serial.println(payload);    //Print request response payload
 
    http.end();
    }
  }
    //Listen to see if there has been a change in the plant.
  if(millis() > (currMil + 20000)){
    total = planta1 + planta2 + planta3 + planta4 + planta5;
    currMil = millis();
    if (WiFi.status() == WL_CONNECTED) { //Check WiFi connection status
    client.setInsecure();
    http.begin(client,"https://apiproyectoso.000webhostapp.com/?op=post");      //Specify request destination

    http.addHeader("Content-Type", "application/json");//Specify content-type header
    int httpCode = http.POST(message);   //Send the request
    String payload = http.getString();                  //Get the response payload
 
    Serial.println(httpCode);   //Print HTTP return code
    Serial.println(payload);    //Print request response payload
 
    http.end();  //Close connection
 
    } else {
 
    Serial.println("Error in WiFi connection");
 
  }

  }
   
  
}


