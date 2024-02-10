/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const { Configuration, OpenAIApi } = require("openai");

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    async handle(handlerInput) {
        let speakOutput = 'Bienvenido a jardín conectado, para ver el estado de tus plantas puedes probar diciendo, estado de plantas. y para conocer más sobre los comandos puedes decir, ver funcionalidades. ';
        
        const data = await obtenerDatosPlanta();  
        if(verificarHumedad(data.planta1) === 'baja' || verificarHumedad(data.planta2) === 'baja' || verificarHumedad(data.planta3) === 'baja' || verificarHumedad(data.planta4) === 'baja' || verificarHumedad(data.planta5) === 'baja') 
        {
            speakOutput += ' Tienes una alerta. Niveles de humedad bajo detectado en: '
            if(verificarHumedad(data.planta1) === 'baja') speakOutput += data.planta1.nombre+', '
            if(verificarHumedad(data.planta2) === 'baja') speakOutput += data.planta2.nombre+', '
            if(verificarHumedad(data.planta3) === 'baja') speakOutput += data.planta3.nombre+', '
            if(verificarHumedad(data.planta4) === 'baja') speakOutput += data.planta4.nombre+', '
            if(verificarHumedad(data.planta5) === 'baja') speakOutput += data.planta5.nombre+', '
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    async handle(handlerInput) {
        const data = await obtenerDatosPlanta();
        let speakOutput ='holiwis'
        let delayres = await delay(6000);
        const data2 = await obtenerDatosPlanta();
        if(data.planta1.humedad < data2.planta1.humedad ) speakOutput = 'planta1 ah sido regada.'
            return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();

        
    }
};

const estadoPlantasHandler = {
    //PlantStatusIntent
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlantStatusIntent';
    },
    async handle(handlerInput) {
        let plantSelected = Alexa.getSlotValue(handlerInput.requestEnvelope, "planta") || "@"
        const plantName = Alexa.getSlotValue(handlerInput.requestEnvelope, "nomPlanta") || "@"
        let speakOutput =''
        if(plantName !== '@') 
        {
            plantSelected = 'nada'
            speakOutput ='Planta no encontrada.'
        }
        console.log(plantName)
        const data = await obtenerDatosPlanta();   
        console.log(plantName.toLowerCase() + " ==== " + data.planta1.nombre.toLowerCase())
        if(data.planta1 && plantSelected === '1' || plantName.toLowerCase() === data.planta1.nombre.toLowerCase() || data.planta1 && plantSelected === '@') speakOutput  = generadorRespuesta(data.planta1, data.sol, 1)
        if(data.planta2 && plantSelected === '2' || plantName.toLowerCase() === data.planta2.nombre.toLowerCase() || data.planta2 && plantSelected === '@') speakOutput += generadorRespuesta(data.planta2, data.sol, 2)
        if(data.planta3 && plantSelected === '3' || plantName.toLowerCase() === data.planta3.nombre.toLowerCase() || data.planta3 && plantSelected === '@') speakOutput += generadorRespuesta(data.planta3, data.sol, 3)
        if(data.planta4 && plantSelected === '4' || plantName.toLowerCase() === data.planta4.nombre.toLowerCase() || data.planta4 && plantSelected === '@') speakOutput += generadorRespuesta(data.planta4, data.sol, 4)
        if(data.planta5 && plantSelected === '5' || plantName.toLowerCase() === data.planta5.nombre.toLowerCase() || data.planta5 && plantSelected === '@') speakOutput += generadorRespuesta(data.planta5, data.sol, 5)
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt()
            .getResponse();
    }
};

const monitoreoPlantasHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'monitoreoPlantasIntent';
    },
    async handle(handlerInput) {
        const data = await obtenerDatosPlanta();
        let speakOutput ='no hubo ningun cambio en tus plantas'
        let delayres = await delay(6000);
        const data2 = await obtenerDatosPlanta();
        if(data.planta1.humedad < data2.planta1.humedad +5) speakOutput = ' planta1 ha sido regada.'
        if(data.planta2.humedad < data2.planta2.humedad +5) speakOutput = ' planta2 ha sido regada.'
        if(data.planta3.humedad < data2.planta3.humedad +5) speakOutput = ' planta3 ha sido regada.'
        if(data.planta4.humedad < data2.planta4.humedad +5) speakOutput = ' planta4 ha sido regada.'
        if(data.planta5.humedad < data2.planta5.humedad +5) speakOutput = ' planta5 ha sido regada.'
            return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();

        
    }
}

const preguntasHandler = {
      //PlantStatusIntent
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'preguntaIntent';
    },
    async handle(handlerInput) {
        const planta = Alexa.getSlotValue(handlerInput.requestEnvelope, "nombreplanta") || "@"
        const resp = await sendPrompt(planta)

        return handlerInput.responseBuilder
            .speak(resp)
            .reprompt()
            .getResponse();
    }
}

//FUNCIONES
const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};

const obtenerDatosPlanta = async() =>{
    let data2;
    await getRemoteData('https://apiproyectoso.000webhostapp.com/?op=consulta')  
      .then((response) => {  
        const data = JSON.parse(response);  
        data2 = data
      })  
      .catch((err) => {  
        console.log(`ERROR: ${err.message}`);  
      });
      return data2;
}

const generadorRespuesta = (planta, sol ,num)=>{
    return planta.nombre+" cuenta con un nivel de humedad "+verificarHumedad(planta)+" del " + planta.humedad + "% , y con unos niveles "+verificarLuz(sol)+" de luz del  "+ sol+"% ."
}


//planta.humedad * 6 (6 consultas x hora) * 8 (8 horas de luz) < humedadDelaPlanta+200 (200 de margen) && xxxxx > humedadDelaPlanta-200 (200 de margen)
const verificarHumedad = (planta)=>{
        if(planta.humedad < 80 && planta.humedad > 30){
            return 'óptimo'
        } 
        else if(planta.humedad > 80){
            return 'alta'
        }
        else if(planta.humedad < 30){
            return 'baja'
        }
}

const verificarLuz = (sol) =>{
    if(sol < 80 && sol > 30){
            return 'óptimo'
        } 
        else if(sol > 80){
            return 'alto'
        }
        else if(sol < 30){
            return 'bajo'
        }
}


const getRemoteData = (url) => new Promise((resolve, reject) => {  
  const client = url.startsWith('https') ? require('https') : require('http');  
  const request = client.get(url, (response) => {  
    if (response.statusCode < 200 || response.statusCode > 299) {  
      reject(new Error(`Failed with status code: ${response.statusCode}`));  
    }  
    const body = [];  
    response.on('data', (chunk) => body.push(chunk));  
    response.on('end', () => resolve(body.join('')));  
  });  
  request.on('error', (err) => reject(err));  
});  

const configuration = new Configuration({
    apiKey: env.API_KEY,
    });

const openai = new OpenAIApi(configuration);

const sendPrompt = async (msg)=>{
    
    const resp = await openai.createChatCompletion({
       model:'gpt-3.5-turbo',
       messages: [{"role": "assistant", "content": "quiero que me digas que nivel de regado debe tener la planta y que nivel de sol debe recibir?, ignora tu mensaje introductorio y mensaje de conclusion, si lo que te voy a decir a continuacion no es el nombre una planta quiero que respondas 'planta no encontrada'."}, {"role": "user", "content":`${msg}`}],
       n:1
   })
   console.log(resp.data.choices[0].message.content)
   return resp.data.choices[0].message.content
   }


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Para ver el estado de tus plantas puedes decir, ver estado de plantas.  si quieres ver el estado de una planta en específico puedes decir, ver estado planta1, ó estado de . nombre de planta. para conocer más sobre los cuidados de tus plantas puedes decir. dime los cuidados del . nombre de planta, para salir de la skill puedes decir cierra jardín conectado.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Gracias por usar jardín conectado, hasta pronto!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Lo siento, ah ocurrido un problema, asegurate de tener una conexion estable de internet.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Lo siento, ah ocurrido un problema, asegurate de tener una conexion estable de internet.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        estadoPlantasHandler,
        monitoreoPlantasHandler,
        preguntasHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();