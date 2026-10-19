// Frank's light sensor: reads the photoresistor and sends the number to the computer
const int sensorPin = A0;

void setup() {
  Serial.begin(9600);                  // open the line to the computer
}

void loop() {
  int light = analogRead(sensorPin);   // 0 to 1023
  Serial.println(light);               // send it, one number per line
  delay(50);                           // about 20 readings a second
}
